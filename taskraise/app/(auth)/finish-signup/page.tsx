import { getProfileByID } from "@/lib/server/profileQuery";
import { getUser } from "@/lib/server/userQuery";
import React from "react";
import FinishSignUpForm from "@/components/auth/FinishProfile";
import { redirect } from "next/navigation";

async function FinishSignUp() {
  const user = await getUser();
  if (user.data.user?.id) {
    const profile = await getProfileByID(user.data.user.id);
    if (profile) {
      return <FinishSignUpForm profile={profile} user={user.data.user} />;
    }
  }
  redirect("/");
}

export default FinishSignUp;
