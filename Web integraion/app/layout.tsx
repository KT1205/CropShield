/* import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FallingLeaves from "@/components/FallingLeaves"
import { ThemeProvider } from "@/components/ThemeProvider"
import Background from "@/components/Background"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CropShield",
  description: "Agricultural crop health prediction system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Background />
          <FallingLeaves />
          <Navbar />
          <main className="flex-grow z-10 relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css' */

import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FallingLeaves from "@/components/FallingLeaves"
import { ThemeProvider } from "@/components/ThemeProvider"
import Background from "@/components/Background"
import { Toaster } from "react-hot-toast"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CropShield",
  description: "Agricultural crop health prediction system",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Background />
          <FallingLeaves />
          <Navbar />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#4CAF50", // CropShield green tone
                color: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              },
            }}
          />
          <main className="flex-grow z-10 relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
