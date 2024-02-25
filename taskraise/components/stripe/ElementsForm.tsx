"use client";

import type { StripeError } from "@stripe/stripe-js";

import * as React from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";

import * as config from "@/config";
import getStripe from "@/utils/get-stripejs";
import { createPaymentIntent } from "@/utils/stripe";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ServiceOrder from "../marketplace/page/ServiceOrder";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";

export default function ElementsForm({
  service,
  primaryCampaign,
  organization,
  user,
}: {
  service: Tables<"services">;
  primaryCampaign: Tables<"campaigns"> | null;
  organization: Tables<"organizations">;
  user: User;
}): JSX.Element {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        appearance: {
          variables: {
            colorIcon: "#6772e5",
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
          },
        },
        currency: config.CURRENCY,
        capture_method: "manual",
        mode: "payment",

        amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
      }}
    >
      <ServiceOrder
        user={user}
        organization={organization}
        primaryCampaign={primaryCampaign}
        service={service}
      />
    </Elements>
  );
}
