import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Hernia Consultation with Dr. Preethi Mrinalini - Understand Your Condition Before It Worsens",
  description:
    "A bulge, heaviness, or post-pregnancy bulge that won't go away? Book a detailed hernia and diastasis recti assessment with Dr. Preethi Mrinalini, Advanced Laparoscopic Surgeon.",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/Marina-logo_tjcywr.png",
        sizes: "32x32",
      },
      {
        url: "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/Marina-logo_tjcywr.png",
        sizes: "192x192",
      },
    ],
    apple: "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/Marina-logo_tjcywr.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/* Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5CK5DZPR"
          strategy="afterInteractive"
          async
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
