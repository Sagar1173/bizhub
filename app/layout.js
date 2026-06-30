import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://bizhub.ca";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
  description:
    "Looking for a business in Greater Toronto Area? Bizhub is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
  keywords: "Restaurants, Convenience Stores, Businesses for Sale, Ontario",
  openGraph: {
    title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
    description:
      "Looking for a business in Greater Toronto Area? Bizhub is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
    url: "/",
    siteName: "Bizhub",
    type: "website",
    images: [{ url: "/office.jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurants, Convenience Stores and Businesses for Sale in Ontario",
    description:
      "Looking for a business in Greater Toronto Area? Bizhub is the best place to find your business. We have a wide range of businesses for sale in Ontario.",
    images: ["/office.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-white text-slate-900`}
      >
        <NextTopLoader
          color="#29D"
          height={3}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
