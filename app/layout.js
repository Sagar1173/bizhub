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

export const metadata = {
  title: "Ravi Singh Godara | Find, finance and own your home",
  description: "Real estate search and mortgage services",
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
