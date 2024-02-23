import React from "react";
import Billing from "@/components/dashboard/page/Billing";
import { getUser } from "@/lib/server/userQuery";
import { getProfileByID } from "@/lib/server/profileQuery";
import { getOrganizationInfoByID } from "@/lib/server/organizationQuery";
import { redirect } from "next/navigation";
import {
  createStripeAccount,
  createStripeAccountOnboardingLink,
  fetchAccount,
} from "@/utils/stripe";
import BillingDisplay from "@/components/stripe/BillingDisplay";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

async function BillingMain() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const user = await getUser();
  if (user.data.user) {
    const profile = await getProfileByID(user.data.user.id);
    if (profile?.organization) {
      const organization = await getOrganizationInfoByID(profile.organization);
      console.log(organization?.stripe_account);
      if (organization?.stripe_account) {
        const fetchAccountInfo = await fetchAccount(
          organization.stripe_account
        );

        if (fetchAccountInfo.details_submitted) {
          return <BillingDisplay account={organization.stripe_account} />;
        } else {
          const billingLink = await createStripeAccountOnboardingLink(
            organization.stripe_account
          );
          redirect(billingLink.url);
        }
      }
    }
  }
}

export default BillingMain;
