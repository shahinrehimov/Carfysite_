import Image from "next/image";
import { notFound } from "next/navigation";
import serverApi from "@/lib/serverApi";

const resolveUrl = (item) =>
  typeof item === "string" ? item : item?.url ?? item?.path ?? null;

const getPageData = async (slug) => {
  try {
    const result = await serverApi.get(`/pages/show/${slug}`);
    return result.data?.data ?? null;
  } catch (error) {
    console.error(
      "[StaticPage] API error:",
      error?.response?.status,
      error?.response?.data ?? error?.message
    );
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    keywords: page.meta_keywords,
  };
}

export default async function StaticPage({ params }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  const mainImageUrl = resolveUrl(page.main_image);
  const galleryImages = (page.images ?? []).map(resolveUrl).filter(Boolean);

  return (
    <div>
      {/* Banner */}
      {mainImageUrl && (
        <div className="relative w-full h-[260px] md:h-[400px] lg:h-[500px] overflow-hidden">
          <Image
            src={mainImageUrl}
            alt={page.meta_title || "banner"}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="container py-8 lg:py-12">
        {page.title && (
          <h1
            className="text-2xl lg:text-4xl font-semibold mb-6"
            dangerouslySetInnerHTML={{ __html: page.title }}
          />
        )}

        {page.description && (
          <div
            className="prose prose-gray max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: page.description }}
          />
        )}

        {page.body && (
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {galleryImages.map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                >
                  <Image
                    src={src}
                    alt={`${page.meta_title || "image"} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
