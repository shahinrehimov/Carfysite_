import { Suspense } from "react";
import { ResetPasswordContent } from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-0 flex items-center justify-center p-4 py-10 lg:min-h-[70vh] bg-gray-50">
          <div className="w-full max-w-2xl min-h-[600px] bg-[#E8F1FC] rounded-[80px] shadow-[0px_1px_8px_0px_#00000029] animate-pulse" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
