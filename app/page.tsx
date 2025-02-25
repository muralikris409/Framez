import { signIn } from "@/auth";
import { auth } from "@/auth";
import { handleOAuth } from "./actions/oAuthHandler";
import { redirect } from "next/navigation";

export default async function Page() {
 
  redirect("/home");
  return (
   <></>
  );
}
