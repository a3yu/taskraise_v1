"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(
  data: FormData
): Promise<{ client_secret: string | null; url: string | null }> {
  const ui_mode = data.get(
    "uiMode"
  ) as Stripe.Checkout.SessionCreateParams.UiMode;

  const origin: string = headers().get("origin") as string;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "payment",
      setup_intent_data: {
        metadata: {
          capture_method: "manual",
        },
      },
      submit_type: "donate",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Custom amount donation",
            },
            unit_amount: formatAmountForStripe(
              Number(data.get("customDonation") as string),
              CURRENCY
            ),
          },
        },
      ],
      ...(ui_mode === "hosted" && {
        success_url: `${origin}/donate-with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/donate-with-checkout`,
      }),
      ...(ui_mode === "embedded" && {
        return_url: `${origin}/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      }),
      ui_mode,
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

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
  paymentIntentId: string,
  connectedAccountId: string
): Promise<{ client_secret: string; id: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.capture(paymentIntentId);
  return {
    client_secret: paymentIntent.client_secret as string,
    id: paymentIntent.id,
  };
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
