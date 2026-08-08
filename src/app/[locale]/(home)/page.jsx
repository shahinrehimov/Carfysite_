import Image from "next/image";
import Banner from "../home/Banner";
import CategoryCards from "../home/CategoryCards";
import BestSeller from "../home/BestSeller";
import AllProducts from "../home/AllProducts";
import Promotion from "../home/Promotion";
import serverApi from "@/lib/serverApi";
import { serverApi as axiosServerApi } from "@/lib/axios";
import { generateServiceUrl } from "@/lib/generateServiceUrl";

const getCategories = async () => {
  try {
    const response = await serverApi.get("/categories/list?with_image=yes");
    return response.data?.data ?? [];
  } catch {
    return [];
  }
};

const getProducts = async () => {
  try {
    const response = await axiosServerApi.get("/products/load?limit=10");
    return {
      products: response.data?.data ?? [],
      meta: response.data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
    };
  } catch {
    return {
      products: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
    };
  }
};

const getBestSellers = async () => {
  try {
    const response = await axiosServerApi.get(
      "/groups/single/bestsellers/products/load"
    );
    return response.data?.data?.product_variants ?? [];
  } catch {
    return [];
  }
};

const getHomeBanner = async () => {
  try {
    const response = await axiosServerApi.get(
      "/advertisements/by-key/home_banner"
    );
    return response.data?.data ?? null;
  } catch {
    return null;
  }
};

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

export default async function Home() {
  const [categories, { products, meta: productsMeta }, bestSellers, homeBanner, services] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getBestSellers(),
      getHomeBanner(),
      getServices(),
    ]);

  return (
    <div className="w-full">
      <Banner services={services} />
      <CategoryCards categories={categories} />
      <div className="w-full bg-[#F8F8F8]">
        <div className="container-left-aligned ">
          <div className="container-left-aligned-content">
            <BestSeller products={bestSellers} />
            <AllProducts initialProducts={products} initialMeta={productsMeta} />
          </div>

          {homeBanner && (
            <div className="ads-container">
              <a
                href={homeBanner.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={homeBanner.image_url}
                  alt={homeBanner.title}
                  width={300}
                  height={1000}
                />
              </a>
            </div>
          )}
        </div>
      </div>
      <Promotion />
      <div className="w-full h-[50px] bg-[#CEE5F8] mb-[-50px] lg:h-[100px] lg:mb-[-100px]"></div>
    </div>
  );
}
