import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
})

export const metadata: Metadata = {
  title: "Our Special Day", // تم التحديث إلى الإنجليزية
  description: "A special celebration of beautiful traditions.", // تم التحديث إلى الإنجليزية
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar" // لا يزال باللغة العربية
      className={`${inter.variable} ${playfairDisplay.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
