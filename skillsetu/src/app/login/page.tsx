import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return <div className="mx-auto w-full max-w-md px-4 py-16"><AuthForm mode="login" /></div>;
}
