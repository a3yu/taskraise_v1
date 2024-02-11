import React from "react";
import ServicePage from "@/components/marketplace/page/Service";
import { getSingleServiceByID } from "@/lib/server/serviceQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { getCampaignByID } from "@/lib/server/campaignQuery";
import { getUser } from "@/lib/server/userQuery";

async function ServiceMain({ params }: { params: { id: string } }) {
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
          <ServicePage
            service={service}
            organization={organization}
            primaryCampaign={primaryCampaign}
            user={user.data.user}
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
