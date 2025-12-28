import WishlistItems from "./components/WishlistItems";
import serverApi from "@/lib/serverApi";

const getWishlistData = async () => {
  try {
    const result = await serverApi.get("/wishlist/load");
    return result.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, data: [] };
  }
};

export const metadata = {
  title: "Seçilmişlər | Carfy",
  description: "Seçilmiş məhsullarınız",
};

export default async function WishlistPage() {
  const wishlistResponse = await getWishlistData();
  const favoriteProducts = wishlistResponse.data || [];

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      <div className="flex flex-col gap-6 lg:gap-10">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold">
          Seçilmiş məhsullar
        </h1>

        <WishlistItems initialProducts={favoriteProducts} />
      </div>
    </div>
  );
}
