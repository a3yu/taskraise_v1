import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { getUser } from "@/lib/server/userQuery";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getProfileByID } from "@/lib/server/profileQuery";
import { Database } from "@/types/supabase";

export const metadata: Metadata = {
  title: "TaskRaise",
  description: "Fuel dreams.",
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <Script
        id="googlemaps"
        type="text/javascript"
        defer
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBgfQSsBnEUn1pNp-XHatpzO-ttacH1E88&libraries=places"
      />

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
