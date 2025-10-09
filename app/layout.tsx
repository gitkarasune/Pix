import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import JsonLd from "@/components/SEO/JsonLd";
import { defaultSEO, getSEOMetadata } from "@/lib/seo";
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = getSEOMetadata({ 
  title: defaultSEO.title,
  description: defaultSEO.description,
  image: defaultSEO.image,
  url: defaultSEO.url,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
  <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* OG Meta tags for strong social previews */}
          <meta property="og:image" content={defaultSEO.image} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={defaultSEO.title} />
          <meta property="og:description" content={defaultSEO.description} />
          <meta property="og:url" content={defaultSEO.url} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={defaultSEO.title} />
          <meta name="twitter:description" content={defaultSEO.description} />
          <meta name="twitter:image" content={defaultSEO.image} />
          <meta name="keywords" content={defaultSEO.keywords.join(", ")} />
        </head>

        <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <JsonLd />

              {children}
              <Toaster position='top-center' theme='dark' richColors />
              <Analytics />
            </ThemeProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  )
}
