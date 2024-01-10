import { Tables } from "@/types/supabase";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserList } from "./UserList";

function OrganizationUsers({
  organizationUsers,
  userData,
}: {
  organizationUsers: Tables<"profiles">[];
  userData: Tables<"profiles">;
}) {
  return (
    <div>
      <Card>
        <CardContent>
          <UserList organizationUsers={organizationUsers} />
        </CardContent>
      </Card>
    </div>
  );
}

export default OrganizationUsers;
