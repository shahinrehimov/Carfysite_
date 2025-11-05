import React from "react";
import TopBar from "./top-bar";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

export default function Header() {
  return (
    <div>
      <MobileNav />
      <TopBar />
      <div className="container py-4">
        <DesktopNav />
      </div>
    </div>
  );
}
