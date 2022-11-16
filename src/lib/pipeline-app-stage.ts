import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CartServiceStack, CartServiceStackProps } from "./cart-service-stack";

export interface PipelineAppStageProps extends cdk.StackProps {
  cartServiceStackProps?: CartServiceStackProps;
}

export class PipelineAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: PipelineAppStageProps) {
    super(scope, id, props);

    new CartServiceStack(this, "CartService", props.cartServiceStackProps);
  }
}
