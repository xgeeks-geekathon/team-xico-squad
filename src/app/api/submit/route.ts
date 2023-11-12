import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { Account, Profile, User, getServerSession } from "next-auth";
import { JWT, getToken } from "next-auth/jwt";
import { writeToUserTemplate } from "../../../../repo-generator-ai/ai-repo-gen";
import { AdapterUser } from "next-auth/adapters";
import { resolve } from "path";

dotenv.config({ path: `.env.local` });

export async function POST(req: Request) {
  const json = await req.json();
  console.log("SUBMIT json", json);

  const { libName, issueDescription, repoName, libVersion } = json;

  const token = await getToken({ req });

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
    const bag = token.token as Bag;
    console.log("SUBMIT POST session", bag);
    const accessToken = bag.account?.access_token;

    const username = bag.profile?.login ?? "";

    const { finalGithubUrl } = await writeToUserTemplate({
      gitHubCredentials: {
        username,
        token: accessToken ?? "",
      },
      libName,
      libVersion,
      templateName: "react-ts",
      newRepoName: repoName,
      openAiKey: process.env.OPENAI_API_KEY ?? "",
      libProblemExplain: issueDescription,
      parentPrefixPath: resolve(__dirname, "../../../../../repo-generator-ai"),
    });

    return NextResponse.json({ username, repoName }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
