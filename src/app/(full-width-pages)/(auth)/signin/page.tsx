import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSO Signin | RSUD dr Abdul Rivai",
  description: "SSO Signin | RSUD dr Abdul Rivai",
};

export default function SignIn() {
  return <SignInForm />;
}
