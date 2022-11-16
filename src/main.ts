#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack, PipelineStackProps } from "./lib/pipeline-stack";

const REPOSITORY_OWNER = "TymoteuszGach";
const REPOSITORY_NAME = "cart-service";

const app = new cdk.App();
const props: PipelineStackProps = {
  git: {
    owner: REPOSITORY_OWNER,
    repository: REPOSITORY_NAME,
    codeStarConnectionSSMParameterName: "/github-connection-arn",
  },
  pipelineAppStageProps: {},
};

new PipelineStack(app, "PipelineStack", props);

app.synth();
