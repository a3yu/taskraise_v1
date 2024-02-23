import Orders from "@/components/orders/Orders";
import { orderQueryUser } from "@/lib/queryTypes";
import { getUserOrders } from "@/lib/server/orderQuery";
import { getProfileByID } from "@/lib/server/profileQuery";
import { getUser } from "@/lib/server/userQuery";
import { redirect } from "next/navigation";
function elevateUsername(
  order: orderQueryUser
): orderQueryUser & { org_name: string } {
  const { organizations, ...rest } = order;
  return {
    ...rest,
    organizations,
    org_name: organizations.org_name,
  };
}
function elevateUsernames(
  orders: orderQueryUser[]
): (orderQueryUser & { org_name: string })[] {
  return orders.map(elevateUsername);
}
export default async function OrdersMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user.data.user) {
    const profile = await getProfileByID(user.data.user.id);
    const orders = await getUserOrders(user.data.user.id);
    if (profile?.gen_role !== "BUYER" && orders) {
      const newOrders = elevateUsernames(orders);
      return <Orders user={user.data.user} orders={newOrders} />;
    } else {
      redirect("/dashboard");
    }
  } else {
    redirect("/sign-in");
  }
}
