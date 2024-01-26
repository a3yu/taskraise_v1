import Services from "@/components/dashboard/page/Services";
import { redirect } from "next/navigation";

async function DashboardService({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <Services />;
}

export default DashboardService;
