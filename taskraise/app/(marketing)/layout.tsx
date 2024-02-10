import NavigationBar from "@/components/navigation/Navigationbar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-violet-100 to-white">
      <NavigationBar user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
