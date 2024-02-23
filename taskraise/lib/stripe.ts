import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(
  "sk_test_51Oih6yIV7HR0j5Zn1eAgrdlp13QPPrulgWQ2X7E4HmZCpKL9ZmcXakQ94tcbmbcqckMaEejTuH0ku0xdZ5RWQmDI00wNmipEhF" as string,
  {
    apiVersion: "2023-10-16",
    appInfo: {
      name: "nextjs-with-stripe-typescript-demo",
      url: "https://nextjs-with-stripe-typescript-demo.vercel.app",
    },
  }
);
