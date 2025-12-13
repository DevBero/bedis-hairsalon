import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  ManagedLoginVersion,
  OAuthScope,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolEmail,
  UserPoolGroup,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import {
  AccessKey,
  Effect,
  ManagedPolicy,
  PolicyStatement,
  User,
} from "aws-cdk-lib/aws-iam";

export interface AuthStackProps extends StackProps {
  readonly appHost: string;
  readonly localPort: number;
}

export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const { appHost, localPort } = props;

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: "BedisHairsalon",
      passwordPolicy: {
        minLength: 8,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(7),
        passwordHistorySize: 5,
      },
      email: UserPoolEmail.withCognito(),
      standardAttributes: {
        fullname: {
          required: true,
        },
        email: {
          required: true,
        },
      },
      selfSignUpEnabled: false,
      removalPolicy: RemovalPolicy.RETAIN,
      userInvitation: {
        emailSubject: "Willkommen bei Bedis Hairsalon",
        emailBody: `
        <h2>Willkommen bei Bedis Hairsalon!</h2>
        <p>Dein Benutzername lautet {username}. Dein temporäres Passwort lautet {####}</p>
        <p>Du kannst dich mit diesem Passwort hier anmelden: ${appHost}</p>
        `,
      },
    });

    const userPoolManagementPolicy = new ManagedPolicy(
      this,
      "UserPoolManagementPolicy",
      {
        description: "Policy for managing Cognito User Pool users",
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
              "cognito-idp:AdminAddUserToGroup",
              "cognito-idp:AdminCreateUser",
              "cognito-idp:AdminDeleteUser",
              "cognito-idp:AdminDisableUser",
              "cognito-idp:AdminEnableUser",
              "cognito-idp:AdminGetUser",
              "cognito-idp:AdminListGroupsForUser",
              "cognito-idp:AdminRemoveUserFromGroup",
              "cognito-idp:AdminResetUserPassword",
              "cognito-idp:AdminSetUserPassword",
              "cognito-idp:AdminUpdateUserAttributes",
              "cognito-idp:DescribeUserPool",
              "cognito-idp:ListGroups",
              "cognito-idp:ListUsers",
            ],
            resources: [userPool.userPoolArn],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["cognito-idp:ListUserPools"],
            resources: ["*"],
          }),
        ],
      }
    );

    const adminUser = new User(this, "AdminUser", {
      userName: `${id}AdminUser`,
      managedPolicies: [userPoolManagementPolicy],
    });

    const accessKey = new AccessKey(this, "DockerUserAccessKey", {
      user: adminUser,
    });

    new CfnOutput(this, "AdminUserAccessKeyId", {
      value: accessKey.accessKeyId,
    });
    new CfnOutput(this, "AdminUserSecretAccessKey", {
      value: accessKey.secretAccessKey.unsafeUnwrap(),
    });
    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    const superAdminGroup = new UserPoolGroup(this, "SuperAdminGroup", {
      userPool,
      groupName: "SuperAdmin",
      description: "Admin Group for founders of the App",
    });

    new CfnOutput(this, "SuperAdminGroupName", {
      value: superAdminGroup.groupName,
    });

    const client = new UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: "BedisHairsalonApp",
      generateSecret: true,
      authFlows: {
        user: true,
        userSrp: true,
      },
      enableTokenRevocation: true,
      accessTokenValidity: Duration.minutes(15),
      idTokenValidity: Duration.minutes(15),
      refreshTokenValidity: Duration.days(30),
      preventUserExistenceErrors: true,
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: [
          `https://${appHost}/api/auth/callback/cognito`,
          `http://localhost:${localPort}/api/auth/callback/cognito`,
        ],
        logoutUrls: [`https://${appHost}`, `http://localhost:${localPort}`],
      },
    });

    new CfnOutput(this, "UserPoolProviderUrl", {
      value: userPool.userPoolProviderUrl,
    });

    new CfnOutput(this, "UserPoolClientId", {
      value: client.userPoolClientId,
    });

    new CfnOutput(this, "UserPoolClientSecret", {
      value: client.userPoolClientSecret.unsafeUnwrap(),
    });

    const defaultDomain = userPool.addDomain("UserPoolDefaultDomain", {
      cognitoDomain: {
        domainPrefix: "bedis-hairsalon-app",
      },
      managedLoginVersion: ManagedLoginVersion.NEWER_MANAGED_LOGIN,
    });
    new CfnOutput(this, "UserPoolDefaultDomain", {
      value: defaultDomain.baseUrl().replace("https://", ""),
    });
  }
}
