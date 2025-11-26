"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { jwtDecode } from 'jwt-decode';
// ... (Definisi tipe Product dan Business tetap sama) ...
export type Product = {
  id: string
  name: string
  description?: string | null
  price: number
  image?: string | null
}

export type Business = {
  id: string
  name: string // Nama pemilik/user
  businessName: string // Nama usaha
  address?: string | null
  logo?: string | null
  products: Product[]
  phone: string | null
  isOpen: boolean // Status buka/tutup toko
  // Asumsi ada owner:
  owner?: { id: string; name: string; email: string } | null
}

type JwtPayload = {
  id: string;
  // Tambahkan field lain yang ada di payload token Anda
  exp?: number;
};

// Tambahkan definisi untuk API utilities
const BASE_URL_PRODUCTS = "/api/products"
const BASE_URL_BUSINESS = "/api/business" // URL baru untuk bisnis

// --- API UTILITY FUNCTIONS (Simulasi Async Fetch) ---

// Fungsi baru untuk fetch Business by ID
export async function apiFetchBusinessById(businessId: string): Promise<Business | null> {
  // 1. Dapatkan Base URL dari Environment Variable
  // Menggunakan URL Absolut sangat penting di Next.js Server Components dan API Routes.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/business/${businessId}`;

  try {
    console.log(`[DATA LAYER] Fetching from API: ${apiUrl}`);

    // 2. Lakukan Fetch API
    const response = await fetch(apiUrl, {
      // Opsi untuk memastikan data selalu baru (opsional, tergantung kebutuhan caching Anda)
      cache: "no-store",
    });

    // 3. Penanganan HTTP Status: 404 (Not Found)
    if (response.status === 404) {
      console.warn(`Business ID ${businessId} not found (404).`);
      return null;
    }

    // 4. Penanganan HTTP Status: Selain 200 OK dan 404 (misal: 500, 401)
    if (!response.ok) {
      // Baca body error untuk informasi lebih lanjut (jika ada)
      const errorText = await response.text();

      // Lemparkan Error, yang bisa ditangkap oleh Error Boundary/try-catch pemanggil
      throw new Error(`Failed to fetch business data. Status: ${response.status}. Body: ${errorText.substring(0, 100)}...`);
    }

    // 5. Kembalikan Data JSON
    return response.json();

  } catch (error) {
    console.error(`Error fetching business ID ${businessId}:`, error);

    // Kembalikan null atau lemparkan ulang error tergantung pada strategi penanganan error global Anda.
    return null;
  }
}


async function apiAddProduct(businessId: string, product: Omit<Product, 'id'>): Promise<Product> {
  // ... (implementasi tetap sama) ...
  const res = await fetch(BASE_URL_PRODUCTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...product, businessId }),
  })
  if (!res.ok) throw new Error("Gagal menambah produk via API")
  return res.json() as Promise<Product>
}

async function apiUpdateProduct(businessId: string, product: Product): Promise<Product> {
  // ... (implementasi tetap sama) ...
  const res = await fetch(`${BASE_URL_PRODUCTS}/${product.id}`, {
    method: "PUT", // Atau PATCH
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...product, businessId }),
  })
  if (!res.ok) throw new Error("Gagal memperbarui produk via API")
  return res.json() as Promise<Product>
}

async function apiDeleteProduct(productId: string): Promise<void> {
  // ... (implementasi tetap sama) ...
  const res = await fetch(`${BASE_URL_PRODUCTS}/${productId}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Gagal menghapus produk via API")
}


// --- CONTEXT TYPE DEFINITION ---
type BusinessContextType = {
  businesses: Business[]
  // ... (Fungsi CRUD Business tetap sama) ...
  addBusiness: (business: Business) => void
  updateBusiness: (id: string, updatedBusiness: Partial<Business>) => void
  deleteBusiness: (id: string) => void

  // ... (Fungsi CRUD Product tetap sama) ...
  addProduct: (businessId: string, product: Omit<Product, 'id'>) => Promise<Product>
  updateProduct: (businessId: string, product: Product) => Promise<Product>
  deleteProduct: (businessId: string, productId: string) => Promise<void>

  // FUNGSI BARU UNTUK FETCH BY ID
  getBusinessById: (id: string) => Business | undefined // Fungsi sinkron mencari di state

  currentUserBusinessId: string | null
  setCurrentUserBusinessId: (id: string | null) => void
  // Menerima userId opsional untuk filtering
  fetchBusinesses: (userId?: string) => Promise<void>
  isContextLoading: boolean // Tambahkan loading state ke Context Type
}


const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  // Note: currentUserBusinessId kemungkinan adalah Business ID, bukan User ID.
  // Untuk filtering API, kita memerlukan User ID.
  const [currentUserId, setCurrentUserId] = useState<string | null>("dummy-user-1") // User ID (Simulasi)
  const [currentUserBusinessId, setCurrentUserBusinessId] = useState<string | null>(null)
  const [isContextLoading, setIsContextLoading] = useState(true) // Tambahkan state loading
  const USER_TOKEN_KEY = 'token';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const token = localStorage.getItem(USER_TOKEN_KEY);

        if (token) {
          // --- LOGIC PARSING TOKEN DITAMBAHKAN DI SINI ---
          const decodedPayload = jwtDecode<JwtPayload>(token);
          console.log(decodedPayload)
          const userId = decodedPayload.id; // Ambil nilai 'userId' yang benar

          if (userId) {
            setCurrentUserId(userId);
            console.log(`[AUTH] Extracted User ID from token: ${userId.substring(0, 10)}...`);
          } else {
            // Token ada, tapi tidak valid atau tidak memiliki userId
            console.error("[AUTH] Token found but no 'userId' claim.");
            setCurrentUserId(null);
            setIsContextLoading(false);
          }
        } else {
          console.log("[AUTH] No user token found in localStorage. Assuming logged out.");
          setCurrentUserId(null);
          setIsContextLoading(false);
        }
      } catch (error) {
        // Tangani error decoding (misalnya, token invalid/expired)
        console.error("Error reading or decoding token:", error);
        setCurrentUserId(null);
        setIsContextLoading(false);
      }
    }
  }, [])

  // Fungsi untuk mengambil data bisnis dari API. Sekarang menerima userId.
  const fetchBusinesses = async (userId: string | null = currentUserId) => {
    if (!userId) {
      console.warn("Cannot fetch businesses: User ID is null.");
      setBusinesses([]);
      setIsContextLoading(false);
      return;
    }

    setIsContextLoading(true);
    try {
      // Modifikasi URL untuk menyertakan parameter query userId
      const url = `${BASE_URL_BUSINESS}?userId=${userId}`
      const res = await fetch(url)

      if (!res.ok) throw new Error("Gagal fetch data bisnis")
      const data: Business[] = await res.json()

      setBusinesses(data)
      // Tetapkan ID bisnis pertama sebagai default user (jika belum diset)
      if (!currentUserBusinessId && data.length > 0) {
        setCurrentUserBusinessId(data[0].id)
      } else if (data.length === 0) {
        setCurrentUserBusinessId(null);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error)
      // Penanganan error yang lebih baik di aplikasi nyata
    } finally {
      setIsContextLoading(false);
    }
  }

  // Effect untuk menjalankan fetch saat komponen di-mount
  useEffect(() => {
    // Jalankan fetch dengan ID User saat ini
    fetchBusinesses(currentUserId)
  }, [currentUserId]) // Re-run fetch jika User ID berubah (misal: setelah login)

  // FUNGSI BARU UNTUK MENCARI DI STATE
  const getBusinessById = (id: string): Business | undefined => {
    return businesses.find(b => b.id === id);
  }


  // ... (Semua fungsi CRUD Business dan Product lainnya tetap sama) ...
  const addBusiness = (business: Business) => {
    setBusinesses(prev => [...prev, business])
  }

  const updateBusiness = (id: string, updatedFields: Partial<Business>) => {
    setBusinesses(prev =>
      prev.map(b => b.id === id ? { ...b, ...updatedFields } : b)
    )
  }

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id))
    if (currentUserBusinessId === id) {
      setCurrentUserBusinessId(null)
    }
  }

  // Fungsi utilitas untuk update state Business setelah operasi Product
  const updateBusinessStateWithProduct = (businessId: string, updatedProduct: Product, type: 'ADD' | 'UPDATE') => {
    setBusinesses(prev => prev.map(business => {
      if (business.id === businessId) {
        let newProducts = [...business.products]

        if (type === 'ADD') {
          // Tambahkan produk baru
          newProducts.push(updatedProduct)
        } else {
          // Temukan dan ganti produk yang sudah ada
          const index = newProducts.findIndex(p => p.id === updatedProduct.id)
          if (index !== -1) {
            newProducts[index] = updatedProduct
          }
        }
        return { ...business, products: newProducts }
      }
      return business
    }))
  }

  // CREATE Product
  const addProduct = async (businessId: string, product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = await apiAddProduct(businessId, product)
    updateBusinessStateWithProduct(businessId, newProduct, 'ADD')
    return newProduct
  }

  // UPDATE Product
  const updateProduct = async (businessId: string, product: Product): Promise<Product> => {
    const updatedProduct = await apiUpdateProduct(businessId, product)
    updateBusinessStateWithProduct(businessId, updatedProduct, 'UPDATE')
    return updatedProduct
  }

  // DELETE Product
  const deleteProduct = async (businessId: string, productId: string): Promise<void> => {
    await apiDeleteProduct(productId)

    // Update state dengan menghapus produk
    setBusinesses(prev => prev.map(business => {
      if (business.id === businessId) {
        return {
          ...business,
          products: business.products.filter(p => p.id !== productId)
        }
      }
      return business
    }))
  }


  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentUserBusinessId,
        setCurrentUserBusinessId,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        addProduct,
        updateProduct,
        deleteProduct,
        // Expose fetchBusinesses tanpa argumen (menggunakan currentUserId internal)
        fetchBusinesses: () => fetchBusinesses(currentUserId),
        getBusinessById,
        isContextLoading,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider")
  }
  return context
}