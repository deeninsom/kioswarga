"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Store, ArrowRight, XCircle, Utensils, Zap, ShoppingBag, Wrench, Shield, Home as HomeIcon } from "lucide-react" // Tambahkan ikon yang mungkin dibutuhkan
import BusinessCard from "@/components/business-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"

// --- DEFINISI TIPE UNTUK FETCHING ---
const FALLBACK_CATEGORIES = [
  { name: "Semua", icon: HomeIcon },
  { name: "Makanan", icon: Utensils },
  { name: "Jasa", icon: Wrench },
  { name: "Retail", icon: ShoppingBag },
];

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  // State baru untuk menyimpan data dari API
  const [allBusinesses, setAllBusinesses] = useState([])
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES) // Default untuk menghindari error mapping
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)


  // --- LOGIKA FETCHING DATA DARI API ---
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);

      try {
        // 1. Fetch Bisnis
        const businessRes = await fetch('/api/business', { cache: 'no-store' });
        if (!businessRes.ok) {
          throw new Error('Gagal memuat data bisnis.');
        }
        const businessData = await businessRes.json();
        setAllBusinesses(businessData);

        // 2. Fetch Kategori (Jika API terpisah)
        // Jika Anda memiliki API kategori terpisah, gunakan ini:
        // const categoryRes = await fetch('/api/categories', { cache: 'no-store' });
        // if (categoryRes.ok) {
        //   const categoryData = await categoryRes.json();
        //   // Tambahkan kategori "Semua" di awal
        //   setCategories([{ name: "Semua", icon: HomeIcon }, ...categoryData]);
        // } else {
        //   console.warn("Gagal memuat kategori dari API, menggunakan fallback.");
        // }

        // CATATAN: Karena struktur API Kategori yang Anda gunakan tidak diberikan,
        // dan kategori lokal menggunakan komponen Icon, saya akan biarkan `categories`
        // menggunakan FALLBACK_CATEGORIES yang sudah dimock di atas untuk memastikan
        // tampilan kategori tidak rusak, kecuali jika Anda sudah mengimplementasikan
        // API Categories yang mengembalikan object icon (yang sulit dilakukan di JSON API).

      } catch (error) {
        console.error("Fetch error:", error);
        setFetchError(error.message);
        setAllBusinesses([]); // Kosongkan data jika error
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);
  // --- END LOGIKA FETCHING DATA DARI API ---


  const filteredBusinesses = allBusinesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) // Tambah pencarian di kategori juga

    const matchesCategory = selectedCategory === "Semua" || business.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Logika untuk menampilkan kategori (match icon dari FALLBACK_CATEGORIES)
  const availableCategories = categories.map(cat => {
    // Cari ikon di FALLBACK_CATEGORIES berdasarkan nama
    const fallbackCat = FALLBACK_CATEGORIES.find(f => f.name === cat.name);
    return {
      ...cat,
      icon: cat.icon || (fallbackCat ? fallbackCat.icon : Store) // Gunakan ikon dari data atau fallback
    };
  });


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Sederhana */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Store className="h-6 w-6" />
            <span>KiosWarga</span>
          </div>
          <div className="flex gap-2">
            <Link href="/login" >
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 cursor-pointer text-white hover:bg-blue-700">
                Daftar Usaha
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center max-w-3xl">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-blue-700 bg-blue-50 border-blue-100">
              Platform #1 Untuk UMKM Indonesia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Promosikan Usaha Anda ke <span className="text-blue-600">Jutaan Pelanggan</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Dari jualan es di pinggir jalan hingga jasa profesional. Buat profil bisnis Anda dalam hitungan menit dan
              jangkau lebih banyak pelanggan secara online.
            </p>

            {/* Search Bar Utama */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white p-2 rounded-xl shadow-lg border border-slate-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari bakso, laundry, atau kopi..."
                  className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Cari Sekarang</Button>
            </div>
          </div>
        </section>

        {/* Directory Section */}
        <section className="py-16 px-4 container mx-auto" id="directory">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Jelajahi Usaha Sekitarmu</h2>
              <p className="text-slate-500">Temukan produk dan jasa terbaik dari pengusaha lokal.</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {availableCategories.map((cat, idx) => (
                <Button
                  key={idx}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedCategory === cat.name
                      ? "bg-blue-600 text-white hover:bg-blue-700 flex-shrink-0"
                      : "text-slate-600 border-slate-200 hover:bg-slate-50 flex-shrink-0"
                  }
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    // Jika search bar di hero section digunakan untuk filter, bisa disinkronkan di sini
                    if (searchQuery) setSearchQuery("");
                  }}
                >
                  {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid Usaha */}
          {isLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner className="mx-auto mb-4 h-8 w-8" />
              <p className="text-slate-500 text-lg">Memuat daftar usaha...</p>
            </div>
          ) : fetchError ? (
            <div className="text-center py-12 bg-red-50 border border-red-200 p-6 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <p className="text-red-700 text-lg font-medium">Gagal memuat data:</p>
              <p className="text-red-500 text-sm">{fetchError}</p>
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard key={business.id} data={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Tidak ada usaha yang ditemukan untuk kriteria ini.</p>
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

          <div className="mt-12 text-center">
            <Link href="/usaha">
              <Button variant="default" size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                Lihat Semua Usaha <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 px-4 border-t border-blue-500">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-white">Punya Usaha Sendiri?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Bergabunglah dengan ribuan pengusaha lainnya. Gratis biaya pendaftaran untuk 100 pendaftar pertama bulan
              ini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold">
                  Buat Halaman Usaha
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Pelajari Cara Kerja
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Store className="h-6 w-6" />
              <span>KiosWarga</span>
            </div>
            <p className="text-sm">Membantu UMKM Indonesia Go Digital dengan mudah dan cepat.</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Dukungan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Hubungi Kami</h3>
            <p className="text-sm mb-2">support@kioswarga.id</p>
            <p className="text-sm">Jakarta, Indonesia</p>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © 2025 KiosWarga. All rights reserved.
        </div>
      </footer>
    </div>
  )
}