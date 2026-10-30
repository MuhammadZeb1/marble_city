import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import WhatsAppButton from "@/components/whatsapp-button";
import { ProductProvider } from "@/context/product-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marble City | Natural Stone, Thoughtfully Considered",
  description:
    "Explore natural marble, granite and quartzite. Discover considered materials, meet our makers and start a project enquiry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProductProvider>
          <header className="site-header">
            <Link aria-label="Marble City home" className="wordmark" href="/">
              MARBLE<span> CITY</span>
              <small>STONE, THOUGHTFULLY CONSIDERED</small>
            </Link>
            <nav aria-label="Main navigation" className="main-nav">
              <Link href="/">Collection</Link>
              <Link href="/about">Our story</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <Link className="header-cta" href="/admin/products">
              Manage collection <span aria-hidden="true">↗</span>
            </Link>
          </header>
          {children}
          <WhatsAppButton />
          <footer className="site-footer">
            <div className="footer-main section-wrap">
              <div>
                <Link className="wordmark footer-wordmark" href="/">
                  MARBLE<span> CITY</span>
                  <small>STONE, THOUGHTFULLY CONSIDERED</small>
                </Link>
                <p>Natural stone for the everyday extraordinary.</p>
              </div>
              <div className="footer-links">
                <Link href="/about">Our story</Link>
                <Link href="/contact">Get in touch</Link>
                <Link href="/admin/products">Manage collection</Link>
              </div>
            </div>
            <div className="footer-bottom section-wrap">
              <span>© {new Date().getFullYear()} Marble City</span>
              <span>Made of good things.</span>
            </div>
          </footer>
        </ProductProvider>
      </body>
    </html>
  );
}
