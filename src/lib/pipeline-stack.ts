import { Stack, StackProps } from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineAppStage, PipelineAppStageProps } from "./pipeline-app-stage";

const DEFAULT_MAIN_BRANCH_NAME = "main";

export interface GitProps {
  codeStarConnectionSSMParameterName: string;
  owner: string;
  repository: string;
  branch?: string;
}

export interface PipelineStackProps extends StackProps {
  git: GitProps;
  pipelineAppStageProps: PipelineAppStageProps;
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const connectionArn = ssm.StringParameter.fromStringParameterAttributes(this, "ConnectionParameter", {
      parameterName: props.git.codeStarConnectionSSMParameterName,
    }).stringValue;

    const repositoryName = `${props.git.owner}/${props.git.repository}`;
    const branch = props.git.branch ?? DEFAULT_MAIN_BRANCH_NAME;

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.connection(repositoryName, branch, {
          connectionArn: connectionArn,
        }),
        commands: ["npm ci", "npm run build", "npm run synth"],
      }),
    });

    pipeline.addStage(new PipelineAppStage(this, "AppStage", props.pipelineAppStageProps));
  }
}
