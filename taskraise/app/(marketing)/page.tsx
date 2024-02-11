import NavigationBar from "@/components/navigation/Navigationbar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import HomePage from "@/components/marketplace/page/HomePage";
export default async function MarketingPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-violet-100 to-white">
      <HomePage user={user} />
    </div>
  );
}
