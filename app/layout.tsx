import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { 
  title: "Pix",
  description:
    "Discover, download, and organize stunning images with AI assistance"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
  <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
