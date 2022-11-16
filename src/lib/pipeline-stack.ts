import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineAppStage, PipelineAppStageProps } from "./pipeline-app-stage";

const DEFAULT_MAIN_BRANCH_NAME = "main";

export interface GitProps {
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

    const branch = props.git.branch ?? DEFAULT_MAIN_BRANCH_NAME;

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(props.git.repository, branch),
        commands: ["npm run test", "npm run package"],
      }),
    });

    pipeline.addStage(new PipelineAppStage(this, "AppStage", props.pipelineAppStageProps));
  }
}
