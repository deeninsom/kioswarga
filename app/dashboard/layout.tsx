"use client"

import type React from "react"
import Link from "next/link"
import { LayoutDashboard, Store, ShoppingBag, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBusiness } from "@/lib/business-context" // Asumsi ini ada
import { useAuth } from "@/lib/auth-context" // Hook yang baru kita buat
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { businesses, currentUserBusinessId } = useBusiness()
  const { user, isLoading: isAuthLoading, logout } = useAuth() // Ambil user, loading, dan logout dari context
  const router = useRouter()

  // Tentukan business saat ini
  const currentBusiness = businesses.find(b => b.id === currentUserBusinessId)

  // --- 1. PROTEKSI RUTE ---
  useEffect(() => {
    // Jika otentikasi selesai loading DAN user tidak ada, arahkan ke login
    if (!isAuthLoading && !user) {
      router.push("/login")
    }
  }, [isAuthLoading, user, router])

  // Fungsi Logout yang diperbarui
  const handleLogout = () => {
    logout() // Panggil fungsi logout dari AuthContext
  }

  // 2. TAMPILKAN LOADING ATAU PENGALIHAN
  // Jika masih loading otentikasi atau user belum ditemukan (sedang proses redirect)
  if (isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 rounded-lg shadow-lg bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <h1 className="text-lg font-semibold text-gray-700">Memuat Sesi...</h1>
          <p className="text-sm text-gray-500">Memeriksa status otentikasi atau mengalihkan.</p>
        </div>
      </div>
    )
  }

  // Setelah otentikasi berhasil, tampilkan layout
  const businessNameDisplay = currentBusiness?.name || "KiosWarga" // Gunakan name, bukan businessName

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-muted/40 border-r hidden md:flex flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Store className="h-6 w-6 text-primary" />
            <span>{businessNameDisplay}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
            {/* Navigasi - Anda mungkin perlu menambahkan logika active state di sini */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              Produk Saya
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Pengaturan
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2 text-red-600 border-red-300 hover:bg-red-50/50" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header (Tambahkan Button Logout di sini jika diperlukan) */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Store className="h-6 w-6" />
              <span className="">{businessNameDisplay}</span>
            </Link>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Keluar</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}