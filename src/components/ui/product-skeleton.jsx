import { cn } from "@/lib/utils";
import { SkeletonBlock } from "@/components/account/account-loading";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] p-3 lg:p-5 shadow-sm h-full flex flex-col animate-pulse">
      <SkeletonBlock className="aspect-square w-full rounded-xl mb-3 lg:mb-4" />
      <SkeletonBlock className="h-5 w-24 mb-2" />
      <SkeletonBlock className="h-4 w-full mb-1" />
      <SkeletonBlock className="h-4 w-2/3 mb-3" />
      <SkeletonBlock className="h-4 w-full mb-4" />
      <SkeletonBlock className="h-10 lg:h-11 w-full rounded-full mt-auto" />
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="container-fluid py-4 lg:py-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        <SkeletonBlock className="h-12 flex-1 rounded-full" />
        <SkeletonBlock className="h-12 w-full lg:w-40 rounded-full" />
        <SkeletonBlock className="h-12 w-full lg:w-36 rounded-full hidden lg:block" />
      </div>
    </div>
  );
}

export function SidebarFilterSkeleton() {
  return (
    <div className="col-span-1 hidden lg:block lg:sticky lg:top-4 lg:self-start space-y-6 animate-pulse">
      <div className="bg-white rounded-[20px] p-4 border border-gray-100 space-y-4">
        <SkeletonBlock className="h-6 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-4 w-full" />
        ))}
        <SkeletonBlock className="h-12 w-full rounded-full mt-4" />
      </div>
      <SkeletonBlock className="w-full h-[280px] rounded-[20px]" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div
      className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductsPageLoading() {
  return (
    <div aria-busy="true" aria-label="Yüklənir">
      <div className="bg-[#F8F8F8]">
        <FilterBarSkeleton />
      </div>
      <div className="container">
        <div className="py-4">
          <SkeletonBlock className="h-4 w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10 items-start">
          <SidebarFilterSkeleton />
          <div className="col-span-1 lg:col-span-4 space-y-4">
            <SkeletonBlock className="h-10 w-full lg:hidden rounded-xl animate-pulse" />
            <ProductGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Yüklənir">
      <div className="bg-[#F8F8F8]">
        <FilterBarSkeleton />
      </div>
      <div className="container pb-10">
        <div className="py-4">
          <SkeletonBlock className="h-4 w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="col-span-1 lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <SkeletonBlock className="aspect-square rounded-xl animate-pulse" />
              <div className="space-y-4 animate-pulse">
                <SkeletonBlock className="h-8 w-3/4" />
                <SkeletonBlock className="h-6 w-32" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-12 w-full rounded-full mt-6" />
                <SkeletonBlock className="h-12 w-full rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="h-24 w-full rounded-xl animate-pulse" />
            <div className="space-y-3 animate-pulse">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-20 w-full rounded-xl" />
            </div>
          </div>
          <div className="hidden lg:block animate-pulse space-y-4">
            <SkeletonBlock className="h-48 w-full rounded-4xl" />
            <SkeletonBlock className="h-14 w-full rounded-full" />
            <SkeletonBlock className="h-[400px] w-full rounded-[20px]" />
          </div>
        </div>
        <div className="mt-10">
          <SkeletonBlock className="h-8 w-48 mb-6 animate-pulse" />
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}

export function CartPageLoading() {
  return (
    <div
      className="container py-6 lg:py-10 animate-pulse"
      aria-busy="true"
      aria-label="Yüklənir"
    >
      <SkeletonBlock className="h-10 w-48 mb-10" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl"
          >
            <SkeletonBlock className="w-20 h-20 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-4 w-1/3" />
            </div>
            <SkeletonBlock className="h-9 w-24 rounded-full shrink-0" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="h-32 w-full max-w-md ml-auto mt-10 rounded-xl" />
    </div>
  );
}

export function WishlistPageLoading() {
  return (
    <div
      className="container mx-auto px-4 py-6 lg:py-10"
      aria-busy="true"
      aria-label="Yüklənir"
    >
      <SkeletonBlock className="h-10 w-48 mb-6 lg:mb-10 animate-pulse" />
      <ProductGridSkeleton count={4} />
    </div>
  );
}

export function HomeBannerSkeleton() {
  return (
    <div className="relative container-fluid h-[240px] lg:h-[420px] bg-[#cee5f8] animate-pulse rounded-b-[16px] rounded-t-[40px] lg:rounded-t-[80px] overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm">
        <div className="container-fluid py-3 lg:py-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <SkeletonBlock className="h-11 lg:h-12 flex-1 rounded-full bg-white/60" />
            <SkeletonBlock className="h-11 lg:h-12 w-full lg:w-40 rounded-full bg-white/60 hidden sm:block" />
            <SkeletonBlock className="h-11 lg:h-12 w-full lg:w-36 rounded-full bg-white/60 hidden lg:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryCardsSkeleton({ count = 12 }) {
  return (
    <section className="container py-12 md:py-16 lg:py-20 animate-pulse">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white rounded-xl md:rounded-2xl p-2 md:p-4 lg:p-6 border border-gray-100"
          >
            <SkeletonBlock className="w-full aspect-square max-w-[50px] lg:max-w-[100px] rounded-lg mb-1.5 md:mb-3 lg:mb-4" />
            <SkeletonBlock className="h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePageLoading() {
  return (
    <div className="w-full" aria-busy="true" aria-label="Yüklənir">
      <HomeBannerSkeleton />
      <CategoryCardsSkeleton />

      <div className="w-full bg-[#F8F8F8]">
        <div className="container-left-aligned">
          <div className="container-left-aligned-content animate-pulse">
            {/* Best sellers */}
            <div className="py-12">
              <SkeletonBlock className="h-8 w-44 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonBlock key={i} className="w-2.5 h-2.5 rounded-full" />
                ))}
              </div>
            </div>

            {/* All products */}
            <div className="pt-12 pb-30">
              <SkeletonBlock className="h-8 w-40 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <SkeletonBlock className="h-14 w-40 rounded-full" />
              </div>
            </div>
          </div>

          <SkeletonBlock className="ads-container hidden xl:block !bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Promotion */}
      <section className="w-full bg-[#CEE5F8] animate-pulse">
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="lg:pl-40 space-y-4 max-w-lg">
            <SkeletonBlock className="h-10 w-full lg:h-14" />
            <SkeletonBlock className="h-10 w-3/4 lg:hidden" />
            <SkeletonBlock className="h-5 w-full max-w-md" />
            <div className="flex items-center gap-4 pt-2">
              <SkeletonBlock className="h-12 w-28 rounded-lg" />
              <SkeletonBlock className="h-12 w-28 rounded-lg" />
              <SkeletonBlock className="w-20 h-20 rounded-lg shrink-0" />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[100px] bg-[#CEE5F8] mb-[-100px]" />
    </div>
  );
}
