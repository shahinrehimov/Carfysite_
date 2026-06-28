import BreadcrumbView from "@/components/breadcrumb/breadcrumb";
import MainFilter from "@/components/filter/MainFilter";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductActions from "@/components/product/product-actions";
import ProductSpecifications from "@/components/product/product-specifications";
import ProductReviews from "@/components/product/product-reviews";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { serverApi } from "@/lib/axios";
import { notFound } from "next/navigation";
import SimilarProductsList from "../../../../components/product/similar-products-list";
import { getTranslations } from "next-intl/server";
import { generateServiceUrl } from "@/lib/generateServiceUrl";
const getProduct = async (category, subcategory, seller, variant) => {
  try {
    const response = await serverApi.get(
      `/products/show/${category}/${subcategory}?seller=${seller}&variant=${variant}&with_related=yes`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Errorraaaa:",
      error?.response?.data?.message ?? error.message
    );
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
    const res = await serverApi.get(generateServiceUrl(services));
    return res.data.data;
  } catch (error) {
    return {
      setting: null,
    };
  }
};
export default async function ProductDetail({ params, searchParams }) {
  const { category, subcategory } = await params;
  const { seller, variant } = await searchParams;
  const data = await getProduct(category, subcategory, seller, variant);
  const services = await getServices();
  const setting = services.setting;
  const t = await getTranslations();
  if (!data) notFound();

  return (
    <div>
      <div className="bg-[#F8F8F8]">
        <MainFilter type="default" />
      </div>
      <div className="container">
        <div className="py-4">
          <BreadcrumbView
            data={[
              { id: 1, type: "link", href: "/", title: t("home") },
              ...(data.product.main_category
                ? [
                    {
                      id: 2,
                      type: "link",
                      href: `/${data.product.main_category.slug}`,
                      title: data.product.main_category.title,
                    },
                  ]
                : []),
              { id: 3, type: "page", title: data.title },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10">
          <div className="col-span-1 lg:col-span-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 pb-10">
              <div className="col-span-1">
                <ProductImageGallery
                  images={[
                    data.main_image,
                    data.hover_image,
                    ...data.images,
                    data.product.main_image || null,
                    data.product.hover_image || null,
                    ...(data.product.images || []),
                  ]}
                  productTitle={data.title}
                />
              </div>

              <div className="col-span-1 flex flex-col justify-between">
                <div>
                  <ProductInfo data={data} />
                  <ProductActions data={data} />
                </div>
                <ProductSpecifications data={data} />
              </div>
            </div>

            <div className="pb-10">
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed text-justify">
                {data.description}
              </p>
            </div>

            {/* product reviews */}
            <ProductReviews data={data} />
          </div>
          <div className="col-span-1 hidden lg:block">
            <div className="bg-[#F3F9FE] rounded-4xl p-6 lg:p-8 flex flex-col items-center justify-center gap-4">
              <Image src="/icons/chat.svg" alt="chat" width={64} height={64} />

              <p className="text-gray-700 text-center text-sm lg:text-lg font-regular">
                {t("contact_us_for_more_information")}
              </p>

              <Button
                variant="outline"
                size="lg"
                className="w-full text-[12px] lg:text-[14px] font-medium cursor-pointer h-10 lg:h-11"
                asChild
              >
                <a href={`mailto:${setting?.email ?? ""}`}>
                  {t("write_to_us")}
                </a>
              </Button>
            </div>

            <div className="mt-4 px-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-lg font-medium cursor-pointer h-10 lg:h-14 "
                asChild
              >
                <a href={`tel:${setting?.phone ?? ""}`}>{t("call_us")}</a>
              </Button>
            </div>

            <div className="mt-4">
              <Image
                src="/images/ads.png"
                alt="ads"
                width={300}
                height={700}
                className="w-full h-[700px] object-cover rounded-[20px] h"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <SimilarProductsList similarProducts={data.related_products} />
    </div>
  );
}
