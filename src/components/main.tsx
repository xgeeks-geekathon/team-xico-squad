'use client'
import { useSession } from "next-auth/react"
import { LogoutButton } from "./logout-button"
import { LoginForm } from "./login-form"

export function Main() {
    const {data} = useSession()
    return <>
     {data ?
                <LogoutButton />
                : <LoginForm />
            }</>
}