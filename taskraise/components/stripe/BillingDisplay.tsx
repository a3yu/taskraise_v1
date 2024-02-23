"use client";
import React, { useState } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectPayments,
  ConnectPayouts,
  ConnectPaymentDetails,
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from "@stripe/react-connect-js";
import { fetchClientSecretAccount } from "@/utils/stripe";
import { Card } from "../ui/card";

function BillingDisplay({ account }: { account: string }) {
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      // Fetch the AccountSession client secret
      const response = await fetchClientSecretAccount(account);
      if (!response) {
        return "";
      } else {
        return response.client_secret;
      }
    };
    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_STRIPE_PUBLIC_KEY as string,
      fetchClientSecret: fetchClientSecret,
    });
  });
  if (stripeConnectInstance) {
    return (
      <div>
        <h1 className="text-4xl font-bold pb-6">Billing</h1>
        <Card className="p-10">
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <div className="space-y-4">
              <ConnectPayouts />
              <ConnectAccountOnboarding
                onExit={() => {
                  console.log("Account onboarding exited");
                }}
              />
              <ConnectPayments />
            </div>
          </ConnectComponentsProvider>
        </Card>
      </div>
    );
  }
}

export default BillingDisplay;
