import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: "India’s AI Inflection Point | NxtGen AI@Work",
    description: "Assess your enterprise AI readiness and identify a practical private AI deployment path with NxtGen.",
    icons: {
      icon: "/nxtgen-mark.png",
      shortcut: "/nxtgen-mark.png",
    },
    openGraph: {
      title: "India’s AI Inflection Point | NxtGen AI@Work",
      description: "Move from AI ambition to a clear, secure deployment path.",
      type: "website",
      images: [{ url: imageUrl, width: 1731, height: 909, alt: "NxtGen AI@Work — India’s AI Inflection Point" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "India’s AI Inflection Point | NxtGen AI@Work",
      description: "Move from AI ambition to a clear, secure deployment path.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
