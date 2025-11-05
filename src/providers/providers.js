"use client";
import { NextIntlClientProvider } from "next-intl";
import { CartProvider } from "@/contexts/cart-context";

export function Providers({ children, locale, messages }) {
  function onError(error) {
    if (error.code === "MISSING_MESSAGE") return;
    console.error(error);
  }
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={onError}
      timeZone="Asia/Baku"
    >
      <CartProvider>{children}</CartProvider>
    </NextIntlClientProvider>
  );
}
