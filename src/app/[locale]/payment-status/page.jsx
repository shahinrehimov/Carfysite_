import { Suspense } from "react";
import PaymentStatusContent from "./PaymentStatusContent";

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center py-16 mb-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00569C]"></div>
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
