import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/products?businessId=...
// Mengambil semua produk berdasarkan Business ID.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const businessId = searchParams.get("businessId")

  if (!businessId) {
    // Mengubah pesan error agar sesuai dengan businessId
    return NextResponse.json({ error: "businessId wajib diisi" }, { status: 400 })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        businessId: businessId, // Menggunakan businessId untuk filter
      },
      // Opsional: Anda mungkin ingin menyertakan detail Business
      include: {
        business: {
          select: { name: true, location: true }
        }
      }
    })
    return NextResponse.json(products)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 })
  }
}

// POST /api/products
// Membuat produk baru dan menghubungkannya dengan Business.
export async function POST(req: Request) {
  try {
    // Mengubah userId menjadi businessId
    const { name, price, image, businessId, description } = await req.json()

    // Mengubah validasi: Name, price, dan businessId wajib diisi
    if (!name || !price || !businessId) {
      return NextResponse.json(
        { error: "Name, price, dan businessId wajib diisi" },
        { status: 400 }
      )
    }

    // Memastikan price adalah integer sebelum disimpan (seperti di schema)
    const numericPrice = parseInt(price);
    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: "Price harus berupa angka valid" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: numericPrice, // Menggunakan numericPrice
        image: image || "/placeholder.svg",
        description, // Menambahkan description
        businessId, // Menyimpan businessId
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    console.error(err)
    // Penanganan error P2003 (Foreign key constraint failed) jika businessId tidak valid
    if (err.code === 'P2003') {
      return NextResponse.json({ error: "Business ID tidak valid atau tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}