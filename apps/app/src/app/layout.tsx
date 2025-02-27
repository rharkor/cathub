import "./globals.css"
import "react-toastify/ReactToastify.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { ToastContainer } from "react-toastify"

import EasterEgg from "@/components/easter-egg"
import { SessionProvider } from "@/contexts/use-session"
import { parseJwt } from "@/lib/jwt"
import TrpcProvider from "@/lib/trpc/provider"

import RootNextUIProvider from "./ui-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cathub",
  description: "Find your cat's cat for a night. Grrrr miawww",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const payload = token ? parseJwt(token.value) : null

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased dark`}>
        <TrpcProvider>
          <SessionProvider ssrToken={token?.value ?? null} ssrPayload={payload ?? null}>
            <RootNextUIProvider>
              {children}
              {/* <Footer /> */}
              <ToastContainer theme="dark" />
              <EasterEgg />
            </RootNextUIProvider>
          </SessionProvider>
        </TrpcProvider>
      </body>
    </html>
  )
}
