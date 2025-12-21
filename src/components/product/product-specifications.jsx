import React from "react";

export default function ProductSpecifications({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 mt-4 border-t border-[#E0E0E0] pt-4">
      {specifications.map((spec, index) => (
        <div key={index} className="flex flex-col">
          <div className="text-[#9E9E9E] text-sm mb-1.5">{spec.label}</div>
          <div className="text-gray-900 font-normal text-base">
            {spec.value}
          </div>
        </div>
      ))}
    </div>
  );
}
