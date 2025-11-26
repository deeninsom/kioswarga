// /app/dashboard/page.tsx (Ditingkatkan dengan Proteksi dan Fix Data)

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { Button } from "@/components/ui/button"
import { PlusCircle, ShoppingBag, Activity, Phone } from "lucide-react"
import { useBusiness } from "@/lib/business-context"
import { useAuth } from "@/lib/auth-context" // *ASUMSI: Hook otentikasi Anda
import { useRouter } from "next/navigation" // Digunakan untuk navigasi
import { useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const { businesses, currentUserBusinessId } = useBusiness()
  const { isLoading: isAuthLoading, user } = useAuth() // *ASUMSI: Ambil status otentikasi
  const router = useRouter()

  // --- 1. PROTEKSI RUTE ---
  useEffect(() => {
    // Jika otentikasi sudah selesai (tidak lagi loading) dan user tidak ada, 
    // arahkan ke halaman login.
    if (!isAuthLoading && !user) {
      router.push("/login")
    }
  }, [isAuthLoading, user, router])


  // --- 2. LOGIKA DATA DAN LOADING STATE ---
  // Tentukan business saat ini
  const currentBusiness = businesses.find((b) => b.id === currentUserBusinessId)

  // Tampilkan loading state jika otentikasi atau data bisnis belum siap
  if (isAuthLoading || !user || !currentBusiness) {
    // Jika user tidak ada, useEffect akan menendang user ke /login.
    // Jika user ada tapi data bisnis belum load, tampilkan loading.
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Memuat Dashboard...</h1>
        <p className="text-muted-foreground">Mohon tunggu sebentar.</p>
      </div>
    )
  }

  // Pastikan products terdefinisi (jika relasi Product[] di schema mungkin kosong)
  const productCount = currentBusiness.products?.length ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard {currentBusiness.name}</h1>
          <p className="text-sm text-muted-foreground">Selamat datang kembali, berikut ringkasan usaha Anda.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Nomor Telepon (FIXED: whatsapp -> phone) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nomor Kontak</CardTitle>
            <Phone className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {/* FIX KRITIS: Menggunakan field 'phone' sesuai schema */}
            <div className="text-2xl font-bold text-green-600">{currentBusiness.phone || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Nomor tujuan pemesanan</p>
          </CardContent>
        </Card>

        {/* CARD 2: Total Produk */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <ShoppingBag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{productCount}</div>
            <p className="text-xs text-muted-foreground">Item tersedia di etalase</p>
          </CardContent>
        </Card>

        {/* CARD 3: Status Toko */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Toko</CardTitle>
            <Activity className={`h-4 w-4 ${currentBusiness.isOpen ? "text-blue-500" : "text-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentBusiness.isOpen ? "text-blue-600" : "text-red-600"}`}>
              {currentBusiness.isOpen ? "Buka" : "Tutup"}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentBusiness.isOpen ? "Siap menerima pesanan" : "Toko sedang tutup"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Statistik Kunjungan</CardTitle>
            <CardDescription>Jumlah pengunjung profil usaha Anda dalam 7 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}