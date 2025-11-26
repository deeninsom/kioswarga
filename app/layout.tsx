import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Mempertahankan AuthProvider agar proteksi rute berfungsi
import { AuthProvider } from '@/lib/auth-context'
import { BusinessProvider } from "@/lib/business-context"

const inter = Inter({ subsets: ["latin"] })

// Metadata yang diperbarui dari input Anda
export const metadata: Metadata = {
  title: "KiosWarga - Platform UMKM Indonesia",
  description: "Promosikan usaha Anda dan temukan produk lokal terbaik di KiosWarga.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{ // Menggunakan Readonly
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* KRITIS: AuthProvider diperlukan untuk useAuth di Dashboard, 
            sehingga harus melingkupi BusinessProvider. */}
        <AuthProvider>
          <BusinessProvider>
            {children}
          </BusinessProvider>
        </AuthProvider>
      </body>
    </html>
  )
}