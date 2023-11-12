"use client";
import { useSession } from "next-auth/react";
import { MainForm } from "./main-form";
import { LoginForm } from "./login-form";

export function Main() {
  const { data } = useSession();
  return <>{data ? <MainForm /> : <LoginForm />}</>;
}
