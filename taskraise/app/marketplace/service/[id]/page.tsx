import React from "react";
import ServicePage from "@/components/marketplace/page/Service";
import { getSingleServiceByID } from "@/lib/server/serviceQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { getCampaignByID } from "@/lib/server/campaignQuery";

async function ServiceMain({ params }: { params: { id: string } }) {
  const service = await getSingleServiceByID(parseInt(params.id));

  if (service) {
    const organization = await getOrganizationInfoByID(service.organization);
    if (organization) {
      const primaryCampaign = await getCampaignByID(
        organization.primary_campaign
      );
      return (
        <div>
          <ServicePage
            service={service}
            organization={organization}
            primaryCampaign={primaryCampaign}
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

export default ServiceMain;
