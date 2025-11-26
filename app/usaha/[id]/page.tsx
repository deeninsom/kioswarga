
import { getBusinessById } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, Clock, Phone, ArrowLeft, Share2, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Business } from "@/lib/business-context"

const fetchBusinessData = async (businessId: string): Promise<any | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/business/${businessId}`;

  try {
    const response = await fetch(apiUrl, { cache: "no-store" });

    if (response.status === 404) return null;

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `Gagal memuat data (Status: ${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch API Error:", error);
    return null;
  }
};

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const business = await fetchBusinessData(id);
  if (!business) {
    notFound();
  }

  console.log(business)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 w-full ">
        <Image src={business.image || "/placeholder.svg"} alt={business.name} fill className="object-cover" />
        <div className="absolute inset-0  from-slate-900/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="gap-2 bg-white/90 hover:bg-white">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Business Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg overflow-hidden bg-white ">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="mb-2">{business.category}</Badge>
                    <h1 className="text-3xl font-bold text-slate-900">{business.name}</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6 ">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="font-bold text-slate-900">{business.rating}</span>
                    <span>(120+ Ulasan)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{business.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className={business.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {business.isOpen ? "Buka Sekarang" : "Tutup"}
                    </span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Tentang Kami</h3>
                  <p className="text-slate-600 leading-relaxed">{business.longDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Products Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Menu / Produk Unggulan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.products?.map((product, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex h-24">
                      <div className="w-24 relative shrink-0 bg-slate-100">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 flex flex-col justify-center">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                        <p className="text-blue-600 font-medium mt-1">{product.price}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Location */}
          <div className="space-y-6 ">
            <Card className="shadow-md border-0 bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Alamat</p>
                      <p className="text-sm text-slate-600">{business.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Telepon / WA</p>
                      <p className="text-sm text-slate-600">{business.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Jam Operasional</p>
                      <p className="text-sm text-slate-600">{business.openingHours}</p>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full mt-6 bg-green-600 hover:bg-green-700">
                  <a
                    href={`https://wa.me/${business.phone.replace(/^0/, "62").replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hubungi via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
