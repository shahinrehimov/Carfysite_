"use client";
import React from "react";
import SidebarFilter from "@/components/filter/SidebarFilter";
import Image from "next/image";

export default function DesktopSidebar({ initialFilters }) {
  return (
    <div className="col-span-1 hidden lg:flex flex-col gap-6">
      <SidebarFilter isOpen={false} onClose={() => {}} initialFilters={initialFilters} />

      <div className="sticky top-4">
        <Image
          src="/images/ads.png"
          alt="Advertisement"
          width={500}
          height={800}
          className="w-full h-auto object-cover rounded-[20px]"
        />
      </div>
    </div>
  );
}

