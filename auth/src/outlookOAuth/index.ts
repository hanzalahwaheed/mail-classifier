import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import * as msal from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}`,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET as string,
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

export const getOutlookAuthUrl = () => {
  const authUrlParams = {
    scopes: [
      "https://graph.microsoft.com/Mail.Read",
      "https://graph.microsoft.com/Mail.Send",
    ],
    redirectUri: "http://localhost:3000/auth/google/callback",
  };
  return pca.getAuthCodeUrl(authUrlParams);
};

export const getOutlookToken = async (code: string) => {
  const tokenRequest = {
    code,
    scopes: [
      "https://graph.microsoft.com/Mail.Read",
      "https://graph.microsoft.com/Mail.Send",
    ],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI as string,
  };
  return await pca.acquireTokenByCode(tokenRequest);
};

export const getOutlookClient = (accessToken: string) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};
