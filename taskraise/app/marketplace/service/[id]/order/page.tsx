import React from "react";
import { getUser } from "@/lib/server/userQuery";
import Stripe from "stripe";
import ServiceOrder from "@/components/marketplace/page/ServiceOrder";
import { getSingleServiceByID } from "@/lib/server/serviceQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { getCampaignByID } from "@/lib/server/campaignQuery";
import { parseCookies, setCookie } from "nookies";
import { cookies } from "next/headers";
import { loadStripe } from "@stripe/stripe-js";

async function ServiceOrderMain({ params }: { params: { id: string } }) {
  const stripePromise = await loadStripe(
    "pk_test_51Oih6yIV7HR0j5ZnxWpdWgqLxyW02esnEjaKfjm64j8f2KZXJBnU0Dtbdf9wbTSDvdm7hcnxOzULy6RkwhUQiTO60076UKtGPY"
  );
  const stripe = new Stripe(
    "pk_test_51Oih6yIV7HR0j5ZnxWpdWgqLxyW02esnEjaKfjm64j8f2KZXJBnU0Dtbdf9wbTSDvdm7hcnxOzULy6RkwhUQiTO60076UKtGPY"
  );
  let paymentIntent;

  const nextCookies = cookies();

  const paymentIntentId = nextCookies.get("paymentIntentId");
  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId.value);
  }

  const service = await getSingleServiceByID(parseInt(params.id));

  if (service) {
    const organization = await getOrganizationInfoByID(service.organization);
    if (organization) {
      const primaryCampaign = await getCampaignByID(
        organization.primary_campaign
      );
      const user = await getUser();
      if (user.data.user) {
        return (
          <div>
            <ServiceOrder
              user={user.data.user}
              organization={organization}
              primaryCampaign={primaryCampaign}
              service={service}
            />
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  } else {
    return <div></div>;
  }
}

export default ServiceOrderMain;
