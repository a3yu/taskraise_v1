import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(
      "sk_test_51Oih6yIV7HR0j5Zn1eAgrdlp13QPPrulgWQ2X7E4HmZCpKL9ZmcXakQ94tcbmbcqckMaEejTuH0ku0xdZ5RWQmDI00wNmipEhF"
    );

  return stripePromise;
}
