#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack, PipelineStackProps } from "./lib/pipeline-stack";

const REPOSITORY_NAME = "tymoteuszgach/cart-service";

const app = new cdk.App();
const props: PipelineStackProps = {
  git: {
    repository: REPOSITORY_NAME,
  },
  pipelineAppStageProps: {},
};

new PipelineStack(app, "PipelineStack", props);

app.synth();
