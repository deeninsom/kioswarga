"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlusCircle, Pencil, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Mengimpor Product type dari context dan menggunakan semua fungsi dari context
import { useBusiness, Product } from "@/lib/business-context"


// Tipe untuk Form Data
interface FormProduct {
  id: string | null // Tambahkan ID, null jika produk baru
  name: string
  price: string // Biarkan string di form untuk input teks
  image: string // Non-opsional di form
}


export default function ProductsPage() {
  // --- PANGGIL SEMUA HOOK TERLEBIH DAHULU ---
  const {
    businesses,
    currentUserBusinessId,
    addProduct, // Fungsi API dari BusinessContext
    updateProduct, // Fungsi API dari BusinessContext
    deleteProduct // Fungsi API dari BusinessContext
  } = useBusiness()

  const currentBusiness = businesses.find((b) => b.id === currentUserBusinessId)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // Ganti `editingProductIndex` menjadi `editingProductId`
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormProduct>({ id: null, name: "", price: "", image: "" })
  const [isSubmitting, setIsSubmitting] = useState(false) // State untuk loading button

  // Ambil daftar produk dari state BusinessContext
  const products: Product[] = currentBusiness?.products || []

  // Mock console log functions
  const showMessage = (message: string) => console.log(`[Pesan]: ${message}`)
  const askConfirmation = (message: string): boolean => {
    // PENTING: Ganti ini dengan custom modal di produksi
    console.warn(`[Konfirmasi Diperlukan]: ${message}. Asumsi: YA (true) untuk menjalankan aksi.`)
    return true
  }

  /**
   * Mengatur state untuk membuka dialog, baik untuk membuat atau mengedit produk.
   * @param product Data produk yang akan diedit (opsional).
   */
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name ?? "",
        price: product.price?.toString() ?? "",
        image: product.image ?? "",
      })
      setEditingProductId(product.id)
    } else {
      setFormData({ id: null, name: "", price: "", image: "" })
      setEditingProductId(null)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!currentBusiness?.id) {
      showMessage("Error: Bisnis saat ini tidak ditemukan.")
      return
    }

    if (!formData.name.trim() || !formData.price) {
      showMessage("Nama produk dan harga tidak boleh kosong")
      return
    }

    // Pastikan harga adalah angka valid
    const priceNumber = Number(formData.price)
    if (isNaN(priceNumber) || priceNumber < 0) {
      showMessage("Harga harus berupa angka positif yang valid.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingProductId) {
        // --- UPDATE PRODUCT ---
        const productData: Product = {
          id: editingProductId,
          name: formData.name,
          price: priceNumber,
          image: formData.image || "/placeholder.svg?height=100&width=100",
        }
        await updateProduct(currentBusiness.id, productData) // Panggil API update
        showMessage(`Produk ${formData.name} berhasil diperbarui!`)

      } else {
        // --- CREATE PRODUCT ---
        const productData: Omit<Product, 'id'> = {
          // ID tidak perlu dikirim, akan dibuat di backend
          name: formData.name,
          price: priceNumber,
          image: formData.image || "/placeholder.svg?height=100&width=100",
        }
        await addProduct(currentBusiness.id, productData) // Panggil API create
        showMessage(`Produk ${formData.name} berhasil ditambahkan!`)
      }

      setIsDialogOpen(false)
      setFormData({ id: null, name: "", price: "", image: "" }) // Reset form
    } catch (err) {
      console.error("Failed to save product:", err)
      showMessage("Gagal menyimpan produk. Lihat konsol untuk detail.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Menangani penghapusan produk.
   * @param productId ID produk yang akan dihapus.
   * @param productName Nama produk untuk pesan konfirmasi.
   */
  const handleDelete = async (productId: string, productName: string) => {
    if (!currentBusiness?.id) return

    if (askConfirmation(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      try {
        await deleteProduct(currentBusiness.id, productId) // Panggil API delete
        showMessage(`Produk ${productName} berhasil dihapus!`)
      } catch (err) {
        console.error("Failed to delete product:", err)
        showMessage("Gagal menghapus produk. Lihat konsol untuk detail.")
      }
    }
  }

  // --- CONDITIONAL RENDERING HARUS DI SINI ---
  if (!currentBusiness) {
    // Asumsi: BusinessProvider menangani loading awal dan setting currentUserBusinessId
    // Tampilkan loading jika businesses masih kosong atau currentUserBusinessId belum ditemukan
    if (businesses.length === 0 && currentUserBusinessId === null) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">Memuat data bisnis...</div>
        </div>
      )
    }
    // Kasus lain (e.g., bisnis yang dipilih tidak ditemukan)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-red-500">Bisnis saat ini tidak ditemukan.</div>
      </div>
    )
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Produk Saya</h1>
          <p className="text-sm text-muted-foreground">Kelola daftar menu atau produk usaha Anda</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Total {products.length} produk tersedia di etalase Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Gambar</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    // Menggunakan product.id sebagai key
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                          <Image
                            // Gunakan Image dari next/image atau ganti dengan <img> jika tidak menggunakan Next.js Image Component
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>Rp{product.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={isSubmitting} // Menonaktifkan tombol saat submit
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Belum ada produk. Silakan tambahkan produk pertama Anda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>{editingProductId ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
            <DialogDescription>Isi detail produk Anda di bawah ini. Klik simpan jika sudah selesai.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nasi Goreng Spesial"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Contoh: 25000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">URL Gambar (Opsional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <div className="flex items-center justify-center w-10 h-10 border rounded bg-muted shrink-0">
                    {formData.image ? (
                      <div className="relative w-full h-full overflow-hidden rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Tampilkan placeholder jika URL gambar gagal dimuat
                            ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      </div>
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : (editingProductId ? "Simpan Perubahan" : "Tambah Produk")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}