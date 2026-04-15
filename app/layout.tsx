import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import AskManoj from "@/components/ui/ask-manoj";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Manoj Kumar Palakuri — Full-Stack Developer & Security Researcher",
  description:
    "Portfolio of Manoj Kumar Palakuri — BCA student specializing in Cybersecurity & Cloud Computing. Building secure, scalable distributed systems at the intersection of cryptography and web technology.",
  keywords: [
    "Manoj Kumar Palakuri",
    "Full-Stack Developer",
    "Cybersecurity",
    "Cloud Computing",
    "React",
    "Node.js",
    "Portfolio",
    "Bengaluru",
  ],
  authors: [{ name: "Manoj Kumar Palakuri" }],
  openGraph: {
    title: "Manoj Kumar Palakuri — Developer & Security Researcher",
    description:
      "Building secure, scalable systems at the intersection of cryptography and web technology.",
    type: "website",
    url: "https://mk-portfolio.vercel.app", // Adjust if you have a custom domain
    images: [
      {
        url: "/og-image.png", // We'll assume a standard OG image path
        width: 1200,
        height: 630,
        alt: "Manoj Kumar Palakuri Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj Kumar Palakuri — Developer & Security Researcher",
    description: "Full-Stack Developer Specializing in Cybersecurity & AI.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <AskManoj />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
