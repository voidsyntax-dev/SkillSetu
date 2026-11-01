import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return <div className="mx-auto w-full max-w-md px-4 py-16"><AuthForm mode="signup" /></div>;
}
