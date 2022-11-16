import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface CartServiceStackProps extends cdk.StackProps {}

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CartServiceStackProps) {
    super(scope, id, props);
  }
}
