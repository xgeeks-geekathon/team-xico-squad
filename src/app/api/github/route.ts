import dotenv from "dotenv";
import Replicate from "replicate";
import { NextResponse } from "next/server";

dotenv.config({ path: `.env.local` });

export async function GET(request: Request) {
  const appClientID = process.env.REACT_APP_CLIENT_ID;
  const appClientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const appRedirectURI = process.env.REACT_APP_REDIRECT_URI;

  try {
    console.log("appClientID", appClientID);
    const output = fetch(
      `https://github.com/login/oauth/authorize?client_id=${appClientID}`
    );

    console.log("output", NextResponse.json((await output).body));
    const b = await output;

    return NextResponse.redirect("http://localhost:3000/home");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//     const appClientID = process.env.REACT_APP_CLIENT_ID;
//     const appClientSecret = process.env.REACT_APP_CLIENT_SECRET;
//     const appRedirectURI = process.env.REACT_APP_REDIRECT_URI;

//     try {
//       console.log("appClientID", appClientID);
//       const output = fetch({
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },

//       }
//         `https://github.com/login/oauth/access_token?client_id=${appClientID}&client_secret=${appClientSecret}&code=${request.body.code}&redirect_uri=${appRedirectURI}`
//       );

//       console.log("output", NextResponse.json(output));

//       return NextResponse.json(output);
//     } catch (error: any) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }
