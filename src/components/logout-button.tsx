"use client";
import { signOut, useSession } from "next-auth/react";

export function LogoutButton() {

    const { data: session } = useSession();

    console.log(session)
    return (
        <button onClick={() => signOut()}>Sign out</button>
    )
}