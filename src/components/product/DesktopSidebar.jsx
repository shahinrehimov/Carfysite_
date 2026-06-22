"use client";
import React from "react";
import SidebarFilter from "@/components/filter/SidebarFilter";
import Image from "next/image";

export default function DesktopSidebar({ initialFilters }) {
  return (
    <div className="col-span-1 hidden lg:block lg:sticky lg:top-4 lg:self-start space-y-6">
      <SidebarFilter
        mode="desktop"
        isOpen={false}
        onClose={() => {}}
        initialFilters={initialFilters}
      />

      <Image
        src="/images/ads.png"
        alt="Advertisement"
        width={500}
        height={800}
        className="w-full max-h-[280px] object-cover rounded-[20px]"
      />
    </div>
  );
}
