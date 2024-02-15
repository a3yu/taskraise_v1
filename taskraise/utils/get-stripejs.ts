/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(
      `"pk_test_51Oih6yIV7HR0j5ZnxWpdWgqLxyW02esnEjaKfjm64j8f2KZXJBnU0Dtbdf9wbTSDvdm7hcnxOzULy6RkwhUQiTO60076UKtGPY"`
    );

  return stripePromise;
}
