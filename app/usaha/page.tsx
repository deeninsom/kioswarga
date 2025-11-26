"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Store, ArrowLeft, Loader2 } from "lucide-react"
import BusinessCard from "@/components/business-card"
import Link from "next/link"
// Import data categories tetap dipertahankan, tetapi businesses akan di-fetch
import { categories } from "@/lib/dummy-data"

// --- DEFINISI TIPE (Pastikan konsisten dengan API Anda) ---
interface Product {
  name: string;
  image: string;
  price: string;
}

interface Business {
  id: string;
  name: string; // Nama usaha
  description: string; // Deskripsi yang akan dicari
  category: string;
  rating: number;
  location: string;
  isOpen: boolean;
  image: string;
  products: Product[];
  // Tambahkan properti lain yang relevan untuk BusinessCard
}
// --- AKHIR DEFINISI TIPE ---

/**
 * Fungsi Data Layer untuk fetch semua data bisnis.
 * Dipanggil di Client Component, sehingga menggunakan path relatif.
 */
async function fetchAllBusinesses(): Promise<Business[]> {
  try {
    const res = await fetch("/api/business", {
      // Pastikan data selalu baru saat masuk halaman ini
      cache: "no-store",
    })

    if (!res.ok) {
      // Melempar error untuk ditangkap di blok catch pada useEffect
      throw new Error(`Gagal memuat data usaha: Status ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching businesses:", error)
    return [] // Mengembalikan array kosong jika terjadi kegagalan
  }
}


export default function UsahaPage() {
  // ✅ FIX 1: Ganti businesses dummy dengan state
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  // ✅ FIX 2: Tambahkan state loading dan error
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ FIX 3: Gunakan useEffect untuk fetch data
  useEffect(() => {
    const loadBusinesses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchAllBusinesses()
        setBusinesses(data)
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("Terjadi kesalahan saat memuat data.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadBusinesses()
  }, []) // Dependency array kosong: hanya jalan saat mount

  const filteredBusinesses = businesses.filter((business) => {
    // Pastikan properti description ada atau gunakan fallback string kosong
    const businessDescription = business.description || "";

    const matchesSearch =
      // Perhatikan: Mengganti business.name dengan business.businessName jika API Anda menggunakan businessName
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      businessDescription.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "Semua" || business.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // --- Rendering UI Berdasarkan State ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600">Memuat data usaha...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Gagal Memuat Data</h2>
        <p className="text-slate-600 mb-4">Terjadi kesalahan: {error}</p>
        <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
          Coba Muat Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Sederhana (Tidak Berubah) */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <Store className="h-6 w-6" />
              <span>KiosWarga</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Semua Usaha</h1>
          <p className="text-slate-600 mb-6">Temukan berbagai usaha lokal terbaik di sekitar Anda.</p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari usaha..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filter Category (Tetap menggunakan data categories dummy) */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat, idx) => (
                <Button
                  key={idx}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedCategory === cat.name
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-slate-600 border-slate-200 hover:bg-slate-50"
                  }
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid Usaha */}
          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard key={business.id} data={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-500 text-lg">Tidak ada usaha yang ditemukan.</p>
              <Button
                variant="link"
                className="text-blue-600 mt-2"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Semua")
                }}
              >
                Reset Pencarian
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}