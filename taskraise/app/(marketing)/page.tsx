import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Brush, Container, Laptop, PersonStanding } from "lucide-react";

export default async function HomePage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 ">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
            Tap into a network of ambitious experts.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Support fundraising organizations while getting the services you
            need.
          </p>
          <div className="space-x-4">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Find Services
            </Link>
            <Link
              href={"/fundraising"}
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Start Fundraising
            </Link>
          </div>
        </div>
      </section>
      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 ">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-foreground">
            Fund Dreams.
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            From <b>mowing lawns</b> to <b>graphic design</b>, find
            organizations that provide the services you need. Using these
            services supports organizations fundraising efforts and helps them
            reach their goals.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <Brush className="text-primary" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Graphic Design</h3>
                <p className="text-sm text-muted-foreground">
                  Get a logo, branding, or other graphic design services.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0  24 24" className="h-12 w-12 fill-current">
                <PersonStanding className="text-primary" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">General Work</h3>
                <p className="text-sm text-muted-foreground">
                  Tap into local organizations to get your lawn mowed, groceries
                  delivered, or other general work.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="h-12 w-12 fill-current"
              >
                <Laptop className="text-primary" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Web Design</h3>
                <p className="text-sm text-muted-foreground">
                  Get a website designed for your needs.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <Container className="text-primary" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Business Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Get your business needs met through things like social media
                  management, inventory management, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
