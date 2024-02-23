import React, { Suspense } from "react";
import { getUser } from "@/lib/server/userQuery";
import { getSingleServiceByID } from "@/lib/server/serviceQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { getCampaignByID } from "@/lib/server/campaignQuery";
import { parseCookies, setCookie } from "nookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ElementsForm from "@/components/stripe/ElementsForm";
import { getOrderById } from "@/lib/server/orderQuery";
import OrderDetails from "@/components/orders/page/OrderDetails";
import { getMessagesByOrderId } from "@/lib/server/messageQuery";
import { getProfileByID } from "@/lib/server/profileQuery";

async function OrderDetailsMain({ params }: { params: { id: string } }) {
  const order = await getOrderById(parseInt(params.id));
  const user = await getUser();

  if (order && user.data.user) {
    const profile = await getProfileByID(user.data.user.id);
    const service = await getSingleServiceByID(order.service);
    const messages = await getMessagesByOrderId(order.id);
    if (service && profile) {
      return (
        <OrderDetails
          order={order}
          service={service}
          messages={messages}
          profile={profile}
        />
      );
    }
  }
}

export default OrderDetailsMain;
