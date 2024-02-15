import { getProfileByID } from "@/lib/server/profileQuery";
import { getUser } from "@/lib/server/userQuery";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user.data.user) {
    const profile = await getProfileByID(user.data.user.id);
    if (profile?.gen_role === "FUNDRAISER") {
      return (
        <>
          <div className="">
            <div className="bg-background">
              <div className="">{children}</div>
            </div>
          </div>
        </>
      );
    } else {
      redirect("/orders");
    }
  } else {
    redirect("/sign-in");
  }
}
