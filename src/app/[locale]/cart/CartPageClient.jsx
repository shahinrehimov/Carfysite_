"use client";
import { useEffect } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useDispatch } from "react-redux";
import { setBasketData } from "@/store/cart";
import MobileList from "./components/MobileList";
import TableList from "./components/TableList";

export default function CartPageClient({ initialBasketData }) {
  const isMobileView = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();

  // Initialize Redux store with server-side data
  useEffect(() => {
    if (initialBasketData) {
      dispatch(setBasketData(initialBasketData));
    }
  }, [initialBasketData, dispatch]);

  return <>{isMobileView ? <MobileList /> : <TableList />}</>;
}
