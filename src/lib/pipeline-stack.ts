import { Stack, StackProps } from "aws-cdk-lib";
import { BuildEnvironmentVariableType } from "aws-cdk-lib/aws-codebuild";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineAppStage, PipelineAppStageProps } from "./pipeline-app-stage";

const DEFAULT_MAIN_BRANCH_NAME = "main";
const DEFAULT_CODE_STAR_CONNECTION_SSM_PARAMETER_NAME = "/github-connection-arn";
const DEFAULT_GITHUB_TOKEN_SSM_PARAMETER_NAME = "/github-token";

export interface GitProps {
  owner: string;
  repository: string;
  branch?: string;
  codeStarConnectionSSMParameterName?: string;
  githubTokenSSMParameterName?: string;
}

export interface PipelineStackProps extends StackProps {
  git: GitProps;
  pipelineAppStageProps: PipelineAppStageProps;
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const connectionArn = ssm.StringParameter.fromStringParameterAttributes(this, "ConnectionParameter", {
      parameterName: props.git.codeStarConnectionSSMParameterName ?? DEFAULT_CODE_STAR_CONNECTION_SSM_PARAMETER_NAME,
    }).stringValue;

    const repositoryName = `${props.git.owner}/${props.git.repository}`;
    const branch = props.git.branch ?? DEFAULT_MAIN_BRANCH_NAME;

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.connection(repositoryName, branch, {
          connectionArn: connectionArn,
        }),
        commands: [
          `npm set //npm.pkg.github.com/:_authToken \$GITHUB_TOKEN`,
          "npm set @tymoteuszgach:registry=https://npm.pkg.github.com/",
          "npm ci",
          "npm run synth",
        ],
        buildEnvironment: {
          environmentVariables: {
            GITHUB_TOKEN: {
              type: BuildEnvironmentVariableType.PARAMETER_STORE,
              value: props.git.githubTokenSSMParameterName ?? DEFAULT_GITHUB_TOKEN_SSM_PARAMETER_NAME,
            },
          },
        },
      }),
    });

    pipeline.addStage(new PipelineAppStage(this, "AppStage", props.pipelineAppStageProps));
  }
}
