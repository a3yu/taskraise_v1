import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

cookies().getAll(); // Keep cookies in the JS execution context for Next.js build
export const supabaseServer = createServerComponentClient<Database>({
  cookies,
});
