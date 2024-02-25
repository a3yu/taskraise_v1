"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";

export async function createPaymentIntent(
  amt: number
): Promise<{ client_secret: string; id: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amt, CURRENCY),
      capture_method: "manual",
      currency: CURRENCY,
    });

  return {
    client_secret: paymentIntent.client_secret as string,
    id: paymentIntent.id,
  };
}

export async function capturePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.capture(paymentIntentId);
  return paymentIntent;
}
export async function denyPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.cancel(paymentIntentId);
  return paymentIntent;
}
export async function createStripeAccount() {
  const account = await stripe.accounts.create({ type: "standard" });
  return account;
}

export async function createStripeAccountOnboardingLink(account: string) {
  const accountLink = await stripe.accountLinks.create({
    account: account,
    refresh_url: "http://localhost:3000/dashboard",
    return_url: "http://localhost:3000/dashboard",
    type: "account_onboarding",
  });
  return accountLink;
}

export async function fetchAccount(account: string) {
  const accountInfo = await stripe.accounts.retrieve(account);
  return accountInfo;
}

export async function fetchClientSecretAccount(account: string) {
  const accountLink = await stripe.accountSessions.create({
    account: account,
    components: {
      payments: {
        enabled: true,
        features: {
          refund_management: true,
          dispute_management: true,
          capture_payments: true,
        },
      },
      payouts: {
        enabled: true,
        features: {
          standard_payouts: true,
        },
      },
    },
  });
  return accountLink;
}

export async function transferToConnectedAccount(
  connectedAccountId: string,
  amount: number
) {
  const transfer = await stripe.transfers.create({
    amount: formatAmountForStripe(amount, CURRENCY),
    currency: CURRENCY,
    destination: connectedAccountId,
  });
  return transfer;
}
