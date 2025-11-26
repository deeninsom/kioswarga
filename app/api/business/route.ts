// /app/api/business/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // gunakan singleton prisma

// =========================================================
// GET: Mengambil daftar semua Business (beserta produknya)
// =========================================================
export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        products: true,
        owner: {
          select: { id: true, name: true, email: true }
        }
      },
    })

    return NextResponse.json(businesses, { status: 200 })
  } catch (error) {
    console.error("Error fetching businesses:", error)
    return NextResponse.json({ error: "Gagal mengambil data bisnis" }, { status: 500 })
  }
}

// =========================================================
// POST: Membuat Business baru
// (Diasumsikan ini dipanggil saat user yang sudah ada membuat bisnis)
// =========================================================
export async function POST(req: Request) {
  try {
    const {
      name,
      category,
      description,
      longDescription,
      address,
      phone,
      location,
      openingHours,
      image,
      ownerId // ID dari User yang akan menjadi pemilik bisnis
    } = await req.json()

    // Validasi dasar
    if (!name || !ownerId) {
      return NextResponse.json(
        { error: "Nama bisnis dan Owner ID wajib diisi" },
        { status: 400 }
      )
    }

    // 1. Cek apakah Owner ID valid dan belum memiliki bisnis
    const existingUser = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { businessId: true }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Owner ID tidak ditemukan" }, { status: 404 });
    }

    // Berdasarkan skema, relasi User:Business adalah 1:1, jadi kita cek businessId di User
    if (existingUser.businessId) {
      return NextResponse.json({ error: "User ini sudah memiliki bisnis" }, { status: 409 });
    }

    // 2. Buat Business baru
    const newBusiness = await prisma.business.create({
      data: {
        name,
        category,
        description,
        longDescription,
        address,
        phone,
        location,
        openingHours,
        image,
        isOpen: true, // Default: Buka

        // Relasi ke User akan diatur setelah Business dibuat
      },
    })

    // 3. Update User untuk menghubungkan ke Business yang baru dibuat
    await prisma.user.update({
      where: { id: ownerId },
      data: {
        businessId: newBusiness.id,
      }
    })


    // Gabungkan respons untuk memudahkan klien
    return NextResponse.json({
      ...newBusiness,
      ownerId: ownerId
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating business:", error)
    return NextResponse.json({ error: "Gagal membuat bisnis baru" }, { status: 500 })
  }
}