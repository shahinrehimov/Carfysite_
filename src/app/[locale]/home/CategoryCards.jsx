import React from "react";
import Image from "next/image";
import Link from "next/link";

function CategoryCards({ categories = [] }) {
  return (
    <section className="container py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-8 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categories[]=${category.slug}`}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-50 p-3 md:p-4 lg:p-5 transition-colors duration-200 ease-out group-hover:bg-light-blue/40">
              <div className="relative h-[45px] w-[45px] md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={70}
                  height={70}
                  className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            <h3 className="mt-2 md:mt-3 text-[11px] md:text-sm font-medium leading-tight text-gray-700 transition-colors duration-200 ease-out group-hover:text-blue">
              {category.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryCards;
