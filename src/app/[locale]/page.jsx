import Image from "next/image";
import Banner from "./home/Banner";
import CategoryCards from "./home/CategoryCards";
import BestSeller from "./home/BestSeller";
import AllProducts from "./home/AllProducts";
import Promotion from "./home/Promotion";

export default function Home() {
  return (
    <div className="w-full">
      <Banner />
      <CategoryCards />
      <div className="w-full bg-[#F8F8F8]">
        <div className="container-left-aligned ">
          <div className="container-left-aligned-content">
            <BestSeller />
            <AllProducts />
          </div>

          <div className="ads-container">
            <Image src="/images/ads.png" alt="ads" width={300} height={1000} />
          </div>
        </div>
      </div>
      <Promotion />
      <div className="w-full h-[100px] bg-[#CEE5F8] mb-[-100px]"></div>
    </div>
  );
}
