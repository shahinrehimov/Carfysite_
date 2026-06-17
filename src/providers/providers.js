"use client";
import { NextIntlClientProvider } from "next-intl";
import { Provider } from "react-redux";
import { store } from "@/store";
import { GuestProvider } from "./GuestProvider";
import { ToastProvider } from "./ToastProvider";
import { EmailVerificationProvider } from "./EmailVerificationProvider";

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
