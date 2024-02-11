import React from "react";
import { getUser } from "@/lib/server/userQuery";
import { redirect } from "next/navigation";
import ServiceOrder from "@/components/marketplace/page/ServiceOrder";
import { getSingleServiceByID } from "@/lib/server/serviceQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { getCampaignByID } from "@/lib/server/campaignQuery";

async function ServiceOrderMain({ params }: { params: { id: string } }) {
  const service = await getSingleServiceByID(parseInt(params.id));

  if (service) {
    const organization = await getOrganizationInfoByID(service.organization);
    if (organization) {
      const primaryCampaign = await getCampaignByID(
        organization.primary_campaign
      );
      const user = await getUser();
      return (
        <div>
          <ServiceOrder
            organization={organization}
            primaryCampaign={primaryCampaign}
            service={service}
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  } else {
    return <div></div>;
  }
}

export default ServiceOrderMain;
