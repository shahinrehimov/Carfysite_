import BreadcrumbView from "@/components/breadcrumb/breadcrumb";
import MainFilter from "@/components/filter/MainFilter";
import ProductImageGallery from "@/components/product/product-image-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductActions from "@/components/product/product-actions";
import ProductSpecifications from "@/components/product/product-specifications";
import ProductReviews from "@/components/product/product-reviews";
import ProductCard from "@/components/product/product-card";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { serverApi } from "@/lib/axios";

const getProduct = async (category, subcategory, slug, seller, variant) => {
  try {
    const response = await serverApi.get(
      `/products/show/${category}/${subcategory}/${slug}?seller=${seller}&variant=${variant}&with_related=yes`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      error: error.message,
    };
  }
};

export default async function ProductDetail({ params, searchParams }) {
  const { category, subcategory, slug } = await params;
  const { seller, variant } = await searchParams;
  const data = await getProduct(category, subcategory, slug, seller, variant);
  console.log(data);
  // Sample product data
  // In production, this would be fetched from API using the slug parameter
  const product = {
    title: "Automobile spare part",
    subtitle: "362428345 Automobile spare part 2",
    rating: 4.9,
    reviewCount: 13,
    discount: "10% endirim kuponu",
    currentPrice: "2 499.00",
    oldPrice: "3 119.00",
    currency: "₼",
    productCode: "362428345",
    specifications: [
      { label: "Şəhər", value: "Bakı" },
      { label: "Kateqoriya", value: "Mator" },
      { label: "Marka", value: "BYD" },
      { label: "Model", value: "87568" },
      { label: "Vaziyyət", value: "İşlənmiş" },
      { label: "İl", value: "2024" },
    ],
    images: [
      "/images/product-1.png",
      "/images/product-2.png",
      "/images/product-3.png",
      "/images/product-4.png",
      "/images/product-1.png",
      "/images/product-2.png",
    ],
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
  };

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      username: "Aysel Mammadova",
      rating: 5,
      comment:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      date: "2025-08-31T08:04:00",
      images: [],
    },
    {
      id: 2,
      username: "Kamran Aliyev",
      rating: 5,
      comment:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      date: "2025-08-31T08:04:00",
      images: [],
    },
    {
      id: 3,
      username: "Nigar Hasanova",
      rating: 5,
      comment:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      date: "2025-08-31T08:04:00",
      images: [],
    },
    {
      id: 4,
      username: "Elvin Quliyev",
      rating: 5,
      comment:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      date: "2025-08-31T08:04:00",
      images: [],
    },
  ];

  // Similar products data
  const similarProducts = Array.from({ length: 8 }, (_, index) => {
    const imageNumber = (index % 4) + 1;
    return {
      id: index + 1,
      image: `/images/product-${imageNumber}.png`,
      title: "Automobile spare part",
      code: `362428345`,
      price: 365.0,
      oldPrice: 365.0,
      rating: 5,
      reviews: 72,
    };
  });

  return (
    <div>
      <div className="bg-[#F8F8F8]">
        <MainFilter type="default" />
      </div>
      <div className="container">
        <div className="py-4">
          <BreadcrumbView
            data={[
              { id: 1, type: "link", href: "/", title: "Ana səhifə" },
              ...(data.product.main_category.parent
                ? [
                    {
                      id: 2,
                      type: "link",
                      href: `/${data.product.main_category.parent.slug}`,
                      title: data.product.main_category.parent.title,
                    },
                    {
                      id: 3,
                      type: "link",
                      href: `/${data.product.main_category.slug}`,
                      title: data.product.main_category.title,
                    },
                  ]
                : []),
              { id: 4, type: "page", title: data.title },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10">
          <div className="col-span-1 lg:col-span-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 pb-10">
              <div className="col-span-1">
                <ProductImageGallery
                  images={[data.main_image, data.hover_image, ...data.images]}
                  productTitle={product.title}
                />
              </div>

              <div className="col-span-1 flex flex-col justify-between">
                <div>
                  <ProductInfo data={data} />
                  <ProductActions />
                </div>
                <ProductSpecifications
                  specifications={product.specifications}
                />
              </div>
            </div>

            <div className="pb-10">
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            {/* product reviews */}
            <ProductReviews product={product} reviews={reviews} />
          </div>
          <div className="col-span-1 hidden lg:block">
            <div className="bg-[#F3F9FE] rounded-4xl p-6 lg:p-8 flex flex-col items-center justify-center gap-4">
              <Image src="/icons/chat.svg" alt="chat" width={64} height={64} />

              <p className="text-gray-700 text-center text-sm lg:text-lg font-regular">
                Daha ətraflı məlumat üçün bizimlə əlaqə qurun.
              </p>

              <Button
                variant="outline"
                size="lg"
                className="w-full text-[12px] lg:text-[14px] font-medium cursor-pointer h-10 lg:h-11"
              >
                Carfy’ə yaz
              </Button>
            </div>

            <div className="mt-4 px-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-lg font-medium cursor-pointer h-10 lg:h-14 "
              >
                Carfy’ə zəng et
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
      <div className="pb-10 py-10  bg-[#F8F8F8]">
        <div className="container">
          <div className="px-0 lg:px-20">
            <h2 className="text-[24px] lg:text-[32px] font-medium text-center text-gray-900 mb-6">
              Bənzər məhsullar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
