import dotenv from "dotenv"; 
import { NextResponse } from "next/server";
import { Account, Profile, User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { JWT } from "next-auth/jwt";
import { writeToUserTemplate } from "../../../../repo-generator-ai/ai-repo-gen";
import { AdapterUser } from "next-auth/adapters";
import { resolve } from "path";

dotenv.config({ path: `.env.local` });

export async function POST(request: Request) {
  const appClientID = process.env.REACT_APP_CLIENT_ID;
  const appClientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const appRedirectURI = process.env.REACT_APP_REDIRECT_URI;

  const json = await request.json();
  console.log("SUBMIT json", json);

  const { libName, issueDescription, repoName } = json;

  const session = await getServerSession(authOptions);

  type Bag = {
    token: JWT;
    user: User | AdapterUser;
    account: Account | null;
    profile?: Profile | undefined;
    trigger?: "signIn" | "signUp" | "update" | undefined;
    isNewUser?: boolean | undefined;
    session?: any;
  };

  try {
    const bag = session.token.token.token as Bag;
    console.log("SUBMIT POST session", bag);
    const accessToken = bag.account?.access_token;
    const a = "";
    console.log("SUBMIT POST accessToken", accessToken);

    console.log("bag.profile", bag.profile);
    await writeToUserTemplate({
      gitHubCredentials: {
        username: bag.profile?.login ?? "",
        token: accessToken ?? "",
      },
      libName,
      templateName: "react-ts",
      newRepoName: repoName,
      openAiKey: process.env.OPENAI_API_KEY ?? "",
      libProblemExplain: issueDescription,
      parentPrefixPath: resolve(__dirname, "../../../../../repo-generator-ai"),
    });

    // const octokit = new Octokit({
    //   auth: accessToken,
    // });
    // const requestResponse = await octokit.request("POST /user/repos", {
    //   name: repoName,
    //   description: issueDescription,
    //   homepage: "https://github.com",
    //   private: false,
    //   is_template: true,
    //   headers: {
    //     "X-GitHub-Api-Version": "2022-11-28",
    //   },
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
