"use client";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import React from "react";

const Page = () => {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-32">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Codex"
            width={75}
            height={75}
            className="hidden hover:animate-pulse md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-medium text-center">Pricing</h1>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Upgrade your plan
        </p>
        <PricingTable
          appearance={{
            baseTheme:currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!",
            },
          }}
        />
      </section>
    </div>
  );
};

export default Page;
