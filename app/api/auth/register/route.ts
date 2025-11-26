// /app/api/auth/register/route.ts (Versi yang Ditingkatkan)

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client" // Gunakan import ini jika "@/lib/prisma" tidak ada
import bcrypt from "bcryptjs"

// Gunakan instance Prisma jika "@/lib/prisma" adalah import yang benar, 
// atau buat instance baru jika Anda tidak memiliki file prisma terpisah:
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Pastikan mengambil semua field yang dibutuhkan
    const { name, email, password, businessName, address, logo } = body

    // 1. VALIDASI INPUT
    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: "Nama, Email, Password, dan Nama Usaha wajib diisi" },
        { status: 400 }
      )
    }

    // 2. CEK DUPLIKAT EMAIL
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
    }

    // 3. HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. BUAT USER BARU DENGAN NESTED CREATE UNTUK BUSINESS
    // Karena relasi 1:1, kita akan membuat User dan Business secara bersamaan
    // dengan membuat Business terlebih dahulu, kemudian menghubungkannya ke User.

    // Kita gunakan transaction untuk memastikan kedua operasi berhasil
    const newUserWithBusiness = await prisma.$transaction(async (tx) => {

      // A. Buat entitas Business terlebih dahulu
      const newBusiness = await tx.business.create({
        data: {
          name: businessName, // Digunakan untuk Business Name
          address: address || null,
          logo: logo || null,
          // Set nilai default untuk field baru yang diperlukan:
          category: "Umum",
          isOpen: true,
          description: `${businessName} - Selamat datang di toko kami!`,
        }
      })

      // B. Buat User dan hubungkan ke Business (menggunakan businessId)
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          // Menggunakan businessId dari Business yang baru dibuat
          businessId: newBusiness.id,
        },
        include: {
          business: true // Include business untuk data respons
        }
      })

      return user;
    })

    // 5. RESPON SUKSES
    return NextResponse.json({
      message: "Registrasi dan pembuatan bisnis berhasil",
      user: {
        id: newUserWithBusiness.id,
        name: newUserWithBusiness.name,
        email: newUserWithBusiness.email,
        // Ambil nama bisnis dari relasi
        businessId: newUserWithBusiness.business?.id,
        businessName: newUserWithBusiness.business?.name,
      },
    })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat mendaftarkan user dan bisnis" },
      { status: 500 }
    )
  }
}