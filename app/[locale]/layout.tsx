import "../../styles/globals.css";
import { notFound } from "next/navigation";
import { Lato } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import BaseProvider from "@/providers";

export const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: any;
  params: Promise<{ locale: "tr" | "en" }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  return (
    <html lang={locale}>
      {/* <GoogleTagManager gtmId="GTM-5R3LBQVC" /> */}
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="alternate icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/favicon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/favicon-64x64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/favicon-128x128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href="/favicon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon-512x512.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${lato.className}`}>
        <NextIntlClientProvider messages={messages}>
          <BaseProvider>{children}</BaseProvider>
        </NextIntlClientProvider>
      </body>

      {/* <GoogleAnalytics gaId="G-2WN5DJV4EB" /> */}
    </html>
  );
}
