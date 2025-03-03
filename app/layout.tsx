import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { GlobalProvider } from "@/lib/context/GlobalContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "McKenzie Properties Auction TRNC",
  description: "Sleek and unique real estate auctions in TRNC",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-navy-50 min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GlobalProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}