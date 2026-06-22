// import BreadcrumbView from "@/components/breadcrumb/breadcrumb";
import MainFilter from "@/components/filter/MainFilter";
import ProductsList from "@/components/product/ProductsList";
import MobileFilterToggle from "@/components/product/MobileFilterToggle";
import DesktopSidebar from "@/components/product/DesktopSidebar";
import { serverApi } from "@/lib/axios";

const FILTER_KEYS = [
  "brands[]",
  "models[]",
  "min_year",
  "max_year",
  "min_price",
  "max_price",
  "city_id",
  "color_id",
  "statuses[]",
  "categories[]",
  "sub_categories[]",
  "sort_option",
  "sort_type",
];

function buildQueryParams(searchParams, extra = {}) {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = searchParams[key];
    if (!value) continue;
    if (key.endsWith("[]")) {
      // Convert brands[]=a&brands[]=b  →  brands[0]=a&brands[1]=b
      const baseKey = key.slice(0, -2);
      const values = Array.isArray(value) ? value : [value];
      values.forEach((v, i) => params.append(`${baseKey}[${i}]`, v));
    } else {
      params.append(key, Array.isArray(value) ? value[0] : value);
    }
  }
  for (const [key, value] of Object.entries(extra)) {
    params.set(key, String(value));
  }
  return params;
}

async function getProducts(searchParams) {
  try {
    const params = buildQueryParams(searchParams, { limit: 8 });
    const response = await serverApi.get(`/products/load?${params.toString()}`);
    return {
      products: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
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

export default async function Products({ searchParams }) {
  const resolvedParams = await searchParams;
  const { products, meta } = await getProducts(resolvedParams);

  // Plain query string forwarded to client for load-more pagination
  const filterQueryString = buildQueryParams(resolvedParams).toString();

  return (
    <div>
      {/* Main Filter Bar */}
      <div className="bg-[#F8F8F8]">
        <MainFilter type="default" initialFilters={resolvedParams} />
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
          <DesktopSidebar initialFilters={resolvedParams} />

          <div className="col-span-1 lg:col-span-4">
            <MobileFilterToggle totalResults={meta.total} searchTerm="Mator" initialFilters={resolvedParams} />

            <ProductsList
              initialProducts={products}
              initialMeta={meta}
              filterQueryString={filterQueryString}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
