import { Tables } from "@/types/supabase";
import React from "react";
import { InviteList } from "./InviteList";

function NonAssignedUser({ userData }: { userData: Tables<"profiles"> }) {
  return (
    <div className="p-16 px-20">
      <h1 className="text-4xl font-bold font-heading">
        Hello, {userData.first_name}!
      </h1>
      <>
        <h3 className="my-4 text-md">
          You are not apart of any organizations. Accept an invite or create
          one:
        </h3>
        <div className="">
          <InviteList userData={userData} />
        </div>
      </>
    </div>
  );
}

export default NonAssignedUser;
