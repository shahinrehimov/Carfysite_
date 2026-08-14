import React from "react";

import OrdersList from "./components/OrdersList";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 py-2 lg:gap-10 lg:py-4">
      <OrdersList />
    </div>
  );
}
