import CartPageClient from "./CartPageClient";
import CartTotalsWrapper from "./components/CartTotalsWrapper";
import CartHeader from "./components/CartHeader";
import serverApi from "@/lib/serverApi";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const getBasketData = async () => {
  try {
    const result = await serverApi.get("/basket/load");
    return result.data;
  } catch (error) {
    console.error("Error fetching basket:", error);
    return { success: false, data: [], basket_data: {} };
  }
};

export default async function CartPage() {
  const basketData = await getBasketData();

  if (!basketData || !basketData.data || basketData.data.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-20">
          <Image
            src="/icons/cart.svg"
            alt="Empty cart"
            width={80}
            height={80}
            className="mx-auto mb-6 opacity-30"
          />
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4">
            Səbətiniz boşdur
          </h2>
          <p className="text-gray-500 mb-8">
            Məhsulları səbətə əlavə etməyə başlayın
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/">Alış-verişə davam et</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex flex-col gap-10 py-6 lg:py-10">
        <CartHeader />

        <div className="w-full">
          <CartPageClient initialBasketData={basketData} />
        </div>

        <CartTotalsWrapper />
      </div>
    </div>
  );
}
