"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.target as HTMLFormElement
    const data = {
      firstName: (form.querySelector("#first-name") as HTMLInputElement).value,
      lastName: (form.querySelector("#last-name") as HTMLInputElement).value,
      email: (form.querySelector("#email") as HTMLInputElement).value,
      password: (form.querySelector("#password") as HTMLInputElement).value,
      businessName: (form.querySelector("#business-name") as HTMLInputElement).value,
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Terjadi kesalahan")

      alert("Register berhasil! Silahkan login")
      router.push("/login")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
              <Store className="h-8 w-8" />
              <span>KiosWarga</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-center">
            Mulai perjalanan bisnis digital Anda bersama KiosWarga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Nama Depan</Label>
                  <Input id="first-name" placeholder="Budi" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Nama Belakang</Label>
                  <Input id="last-name" placeholder="Santoso" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@contoh.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business-name">Nama Usaha</Label>
                <Input id="business-name" placeholder="Contoh: Kopi Kenangan Mantan" required />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={isLoading}>
                {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
