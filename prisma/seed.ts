// prisma/seed.ts (DITINGKATKAN)

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Definisikan data dasar untuk konsistensi
const ADMIN_EMAIL = "admin@mail.com"
const DEFAULT_PASSWORD = "123456"

async function main() {
  console.log("--- Memulai Proses Seeding ---")
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  // --- 1. DATA BUSINESS ---
  const businessData = {
    name: "Admin Store UMKM",
    category: "Makanan",
    description: "Warung contoh untuk aplikasi dashboard",
    longDescription: "Menjual berbagai macam makanan dan minuman.",
    address: "Jl. Contoh Seeding No. 123",
    phone: "081234567890",
    location: "Jakarta Selatan",
    openingHours: "09:00 - 18:00",
    isOpen: true,
    logo: null,
    image: "/placeholder-business.jpg",
  }

  // Cari Business berdasarkan ID (Diasumsikan kita cari Business yang sudah ada berdasarkan owner)
  // Karena kita tidak punya Business ID unik yang mudah diakses selain melalui User, kita akan mencari User dulu.

  let businessIdToConnect: string;

  // --- 2. UPSERT USER ---
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      // Update juga password jika ada perubahan
      password: hashedPassword,
      // businessId akan di-handle di create atau dibiarkan jika sudah terisi
    },
    create: {
      name: "Admin Satu (Owner)",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      // businessId akan diisi nanti setelah Business dibuat
    },
    include: {
      business: true // Include business untuk mengetahui apakah sudah terhubung
    }
  })

  console.log(`[USER] User '${user.name}' ditemukan/dibuat.`)


  // --- 3. UPSERT BUSINESS DAN HUBUNGKAN KE USER ---

  if (user.business) {
    // Jika Business sudah ada, cukup update datanya
    businessIdToConnect = user.business.id;
    await prisma.business.update({
      where: { id: user.business.id },
      data: businessData,
    })
    console.log(`[BUSINESS] Business '${businessData.name}' di-update. ID: ${businessIdToConnect}`)
  } else {
    // Jika Business belum ada, buat baru dan hubungkan ke User (Owner)
    const newBusiness = await prisma.business.create({
      data: {
        ...businessData,
        owner: {
          connect: { id: user.id } // Hubungkan Business ke User (Owner)
        }
      }
    })

    // Perbarui businessId di User yang sudah ada
    businessIdToConnect = newBusiness.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { businessId: businessIdToConnect }
    })
    console.log(`[BUSINESS] Business '${businessData.name}' dibuat baru. ID: ${businessIdToConnect}`)
  }


  // --- 4. SEED PRODUK (Menggunakan ID Business yang sudah dipastikan ada) ---
  const productList = [
    { name: "Nasi Goreng Spesial", description: "Nasi goreng lengkap dengan ayam dan telur", price: 25000, image: "/product-ngoreng.jpg" },
    { name: "Es Teh Manis", description: "Pelepas dahaga yang manis", price: 5000, image: "/product-esteh.jpg" },
    { name: "Mie Ayam Bakso", description: "Mie ayam lengkap dengan bakso sapi", price: 30000, image: "/product-mieayam.jpg" },
  ]

  const seededProducts = []

  for (const productData of productList) {
    const product = await prisma.product.upsert({
      // Gunakan nama unik sebagai kunci upsert jika ID bukan string statis
      where: { id: productData.name.replace(/\s/g, '_') }, // Ini hanya contoh, disarankan menggunakan id asli
      update: { ...productData },
      create: {
        ...productData,
        // Biarkan ID dibuat otomatis (UUID)
        business: {
          connect: {
            id: businessIdToConnect
          }
        },
      },
    })
    seededProducts.push(product.name)
  }

  console.log(`[PRODUK] ${seededProducts.length} produk berhasil di-seed: ${seededProducts.join(', ')}`)
  console.log("--- Proses Seeding Selesai ---")
}

main()
  .catch((e) => {
    console.error("FATAL SEED ERROR:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })