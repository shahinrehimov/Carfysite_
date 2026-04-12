// import BreadcrumbView from "@/components/breadcrumb/breadcrumb";
import MainFilter from "@/components/filter/MainFilter";
import ProductsList from "@/components/product/ProductsList";
import MobileFilterToggle from "@/components/product/MobileFilterToggle";
import DesktopSidebar from "@/components/product/DesktopSidebar";
import { serverApi } from "@/lib/axios";

async function getProducts() {
  try {
    const response = await serverApi.get("/products/load?limit=8");
    console.log(response);
    return {
      products: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
      },
    };
  }
}

export default async function Products() {
  const { products, meta } = await getProducts();
  console.log(products);
  return (
    <div>
      {/* Main Filter Bar */}
      <div className="bg-[#F8F8F8]">
        <MainFilter type="default" />
      </div>

      <div className="container">
        {/* Breadcrumb */}
        <div className="py-4">
          {/* <BreadcrumbView
            data={[
              { id: 1, type: "link", href: "/", title: "Ana səhifə" },
              { id: 2, type: "link", href: "/", title: "Mühərrik hissələri" },
              { id: 3, type: "page", title: "Mator" },
            ]}
          /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10">
          <DesktopSidebar />

          <div className="col-span-1 lg:col-span-4">
            <MobileFilterToggle totalResults={meta.total} searchTerm="Mator" />

            <ProductsList initialProducts={products} initialMeta={meta} />
          </div>
        </div>
      </div>
    </div>
  );
}
