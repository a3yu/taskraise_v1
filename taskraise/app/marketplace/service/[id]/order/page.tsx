import React, { Suspense } from "react";
import { getUser } from "@/lib/server/userQuery";
import { getSingleServiceByID } from "@/lib/server/serviceQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { getCampaignByID } from "@/lib/server/campaignQuery";
import { parseCookies, setCookie } from "nookies";
import { cookies } from "next/headers";
import { loadStripe } from "@stripe/stripe-js";
import { redirect } from "next/navigation";
import ElementsForm from "@/components/stripe/ElementsForm";

async function ServiceOrderMain({ params }: { params: { id: string } }) {
  const nextCookies = cookies();

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
            <Suspense>
              <ElementsForm
                user={user.data.user}
                organization={organization}
                primaryCampaign={primaryCampaign}
                service={service}
              />
            </Suspense>
          </div>
        );
      } else {
        redirect("/sign-in");
      }
    } else {
      return <div></div>;
    }
  } else {
    return <div></div>;
  }
}

export default ServiceOrderMain;
