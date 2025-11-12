import React from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Mühərrik hissələri",
    image: "/images/category1.svg",
    link: "/category/engine-parts",
  },
  {
    id: 2,
    title: "Sürətlər qutusu və transmissiya",
    image: "/images/category2.svg",
    link: "/category/transmission",
  },
  {
    id: 3,
    title: "Əyləc sistemi",
    image: "/images/category3.svg",
    link: "/category/brake-system",
  },
  {
    id: 4,
    title: "Salon hissələri",
    image: "/images/category2.svg",
    link: "/category/interior",
  },
  {
    id: 5,
    title: "Yağlar və mayeler",
    image: "/images/category1.svg",
    link: "/category/fluids",
  },
  {
    id: 6,
    title: "Aksesuarlar",
    image: "/images/category3.svg",
    link: "/category/accessories",
  },
  {
    id: 7,
    title: "Mühərrik hissələri",
    image: "/images/category1.svg",
    link: "/category/engine-parts-2",
  },
  {
    id: 8,
    title: "Sürətlər qutusu və transmissiya",
    image: "/images/category2.svg",
    link: "/category/transmission-2",
  },
  {
    id: 9,
    title: "Əyləc sistemi",
    image: "/images/category3.svg",
    link: "/category/brake-system-2",
  },
  {
    id: 10,
    title: "Salon hissələri",
    image: "/images/category2.svg",
    link: "/category/interior-2",
  },
  {
    id: 11,
    title: "Yağlar və mayeler",
    image: "/images/category1.svg",
    link: "/category/fluids-2",
  },
  {
    id: 12,
    title: "Aksesuarlar",
    image: "/images/category3.svg",
    link: "/category/accessories-2",
  },
];

function CategoryCards() {
  return (
    <section className="container py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.link}
            className="group relative flex flex-col items-center justify-center bg-white rounded-xl md:rounded-2xl p-2 md:p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue/30 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square mb-1.5 md:mb-3 lg:mb-4 flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.title}
                width={100}
                height={100}
                className="w-full max-w-[50px] lg:max-w-[100px] h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Title */}
            <h3 className="text-center text-[10px] md:text-sm lg:text-base font-medium text-gray-800 leading-tight">
              {category.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryCards;
