import React from "react";

import OrdersList from "./components/OrdersList";

export default function OrdersPage() {
  return (
    <div className="container">
      <div className="flex flex-col gap-10 py-10">
        <OrdersList />
      </div>
    </div>
  );
}
