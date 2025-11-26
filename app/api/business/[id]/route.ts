// /app/api/business/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================================================
// GET: Mengambil detail Business berdasarkan ID
// =========================================================
export async function GET(
  req: Request, context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        products: true
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business ID tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error(`Error fetching business ${id}:`, error);
    return NextResponse.json(
      { error: "Gagal mengambil data bisnis" },
      { status: 500 }
    );
  }
}

// =========================================================
// PUT/PATCH: Memperbarui detail Business berdasarkan ID
// =========================================================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const data = await req.json();
    const { id, owner, createdAt, updatedAt, products, ...businessDataToUpdate } = data;
    // Hapus ID dari data agar tidak mencoba memperbarui Primary Key
    if (data.id) delete data.id;

    const updatedBusiness = await prisma.business.update({
      where: { id: id },
      data: businessDataToUpdate
    });

    return NextResponse.json(updatedBusiness, { status: 200 });
  } catch (error) {
    console.error(`Error updating business ${id}:`, error);
    // Catatan: Error 500 bisa jadi karena validasi data di Prisma gagal, dll.
    return NextResponse.json(
      { error: "Gagal memperbarui data bisnis" },
      { status: 500 }
    );
  }
}