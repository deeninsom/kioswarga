
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Interface untuk parameter dinamis di Next.js App Router
interface RouteContext {
  params: { id: string }
}

// GET /api/products/[id] (Ditambahkan untuk mengambil detail 1 produk)
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  if (!id) return NextResponse.json({ error: "ID produk wajib diisi" }, { status: 400 })

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        business: true
      } // Sertakan detail bisnis
    })

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}


// PUT /api/products/[id]
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Menambahkan description
    const { name, price, image, description } = await req.json()
    const { id } = await context.params

    if (!name || !price) {
      return NextResponse.json({ error: "Name dan price wajib diisi" }, { status: 400 })
    }

    // Memastikan price adalah integer sebelum disimpan
    const numericPrice = parseInt(price);
    if (isNaN(numericPrice)) {
      return NextResponse.json({ error: "Price harus berupa angka valid" }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: numericPrice, // Menggunakan numericPrice
        description,
        image: image || "/placeholder.svg",
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (err: any) {
    console.error(err)
    // Penanganan khusus untuk data tidak ditemukan
    if (err.code === 'P2025') {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// DELETE /api/products/[id]
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  if (!id) return NextResponse.json({ error: "ID produk wajib diisi" }, { status: 400 })

  try {
    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ message: "Produk berhasil dihapus" })
  } catch (err: any) {
    console.error(err)
    if (err.code === 'P2025') {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}