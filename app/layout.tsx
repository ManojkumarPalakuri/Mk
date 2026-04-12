import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
