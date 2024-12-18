import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(process.env.NEXT_STRIPE_SECRET_KEY as string);

  return stripePromise;
}
