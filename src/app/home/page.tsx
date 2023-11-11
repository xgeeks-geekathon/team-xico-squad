
import Navbar from "@/components/Navbar";
import Examples from "@/components/Examples";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { LoginForm } from "@/components/login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SessionProvider } from "next-auth/react";
import { LogoutButton } from "@/components/logout-button";

async function handleClick() {
    const resp = await fetch("/api/auth/signin");
    console.log(resp);
}


export default async function Page() {

    const session = await getServerSession(authOptions);
    if (session) {
        console.log("9999");
    }



    return (
        <main className="flex flex-col items-center min-h-screen gap-8">
            {session ?
                <LogoutButton />
                : <LoginForm />
            }
        </main>
    );
}
