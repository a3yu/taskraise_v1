import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

export const metadata: Metadata = {
  title: "TaskRaise",
  description: "Fuel dreams.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export default function RootLayout({
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
