import React from "react";
import TopBar from "./top-bar";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

import { serverApi as axiosServerApi } from "@/lib/axios";
import { generateServiceUrl } from "@/lib/generateServiceUrl";

const services = [
  {
    key: "setting",
    limit: 100,
  },
];

const getServices = async () => {
  try {
    const res = await axiosServerApi.get(generateServiceUrl(services));
    return res.data.data;
  } catch (error) {
    return {
      setting: null,
    };
  }
};
export default async function Header() {
  const setting = await getServices();
  return (
    <div>
      <MobileNav />
      <TopBar phone={setting.setting?.phone} />
      <div className="container py-4">
        <DesktopNav />
      </div>
    </div>
  );
}
