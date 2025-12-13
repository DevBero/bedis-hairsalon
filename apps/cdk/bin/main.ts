import { App } from "aws-cdk-lib";
import { AuthStack } from "../lib/auth-stack";

require("dotenv").config();

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
};

const appHost = process.env.APP_HOST!;
const localPort = Number(process.env.LOCAL_PORT!);

const app = new App();
new AuthStack(app, "BedisHairsalonCognito", {
  localPort,
  appHost,
  env,
});
