import type { Metadata } from "next";
import { League_Spartan, Cairo } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Starting SEO as your Home - Learn SEO from Scratch",
  description: "Master SEO strategies and search engine optimization techniques from scratch. Learn keyword research, search intent, metadata rules, and structural SEO setup.",
  keywords: [
    "SEO",
    "Search Engine Optimization",
    "Learn SEO",
    "SEO Course",
    "Digital Marketing",
    "Keyword Research",
    "Technical SEO",
  ],
  authors: [{ name: "IT Legend" }],
  openGraph: {
    title: "Starting SEO as your Home - Learn SEO from Scratch",
    description: "Master SEO strategies and search engine optimization techniques from scratch.",
    url: "https://job-test-itlegend.vercel.app",
    siteName: "IT Legend",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starting SEO as your Home - Learn SEO from Scratch",
    description: "Master SEO strategies and search engine optimization techniques from scratch.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
