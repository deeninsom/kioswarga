// /app/api/auth/login/route.ts (Versi yang Ditingkatkan)

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Gunakan instance Prisma yang sudah ada, atau buat jika Anda tidak menggunakan "@/lib/prisma"
// (Diasumsikan Anda menggunakan PrismaClient jika "@/lib/prisma" tidak didefinisikan)
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. VALIDASI INPUT
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // 2. CARI USER DAN RELASI BUSINESS
    // Gunakan 'include' untuk mengambil data businessName dan businessId
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        business: {
          select: {
            id: true, // Ambil Business ID
            name: true, // Ambil Business Name (businessName di kode lama Anda)
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau Password salah" }, // Pesan gabungan lebih aman
        { status: 401 }
      );
    }

    // 3. VERIFIKASI PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Email atau Password salah" }, // Pesan gabungan lebih aman
        { status: 401 }
      );
    }

    // Tentukan data Business yang akan digunakan
    const businessId = user.business?.id || null;
    const businessName = user.business?.name || null;

    // 4. BUAT JSON WEB TOKEN (JWT)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        businessId: businessId, // Menyertakan ID Bisnis di payload JWT (PENTING!)
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 5. RESPON SUKSES
    return NextResponse.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        businessId: businessId, // Kirim ID Bisnis
        businessName: businessName, // Kirim Nama Bisnis
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  } finally {
    // Disarankan untuk memutuskan koneksi jika Anda membuat instance Prisma baru di sini
    // await prisma.$disconnect(); 
  }
}