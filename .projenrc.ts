import { CdkMicroservice } from "@tymoteuszgach/projen-template";
const project = new CdkMicroservice({
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  devDeps: ["@tymoteuszgach/projen-template"],
  name: "cart-service",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
