"use client";
import { NextIntlClientProvider } from "next-intl";
import { Provider } from "react-redux";
import { store } from "@/store";
import { GuestProvider } from "./GuestProvider";
import { ToastProvider } from "./ToastProvider";
import { EmailVerificationProvider } from "./EmailVerificationProvider";
import CartAuthSync from "@/components/cart/cart-auth-sync";

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
      <Provider store={store}>
        <CartAuthSync />
        <GuestProvider>
          <ToastProvider>
            <EmailVerificationProvider>
              {children}
            </EmailVerificationProvider>
          </ToastProvider>
        </GuestProvider>
      </Provider>
    </NextIntlClientProvider>
  );
}
