import React from "react";
import Image from "next/image";
import Link from "next/link";

function CategoryCards({ categories = [] }) {
  return (
    <section className="container py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-5 md:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categories[]=${category.slug}`}
            className="group relative flex h-full flex-col items-center justify-start bg-white rounded-xl md:rounded-2xl p-2 md:p-4 lg:p-6 shadow-sm card-hover border border-gray-100 hover:border-blue/30 hover:-translate-y-0.5"
          >
            <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] lg:w-[100px] lg:h-[100px] mb-1.5 md:mb-3 lg:mb-4 flex items-center justify-center shrink-0">
              <Image
                src={category.image}
                alt={category.title}
                width={100}
                height={100}
                className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              />
            </div>

            <h3 className="w-full text-center text-[8px] md:text-sm lg:text-base font-medium text-gray-800 leading-tight">
              {category.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryCards;
