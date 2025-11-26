import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BusinessData {
  id: number
  name: string
  description: string
  category: string
  rating: number
  location: string
  image: string
  isOpen: boolean
}

export default function BusinessCard({ data }: { data: BusinessData }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group border-slate-200 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <Image
          src={data.image || "/placeholder.svg"}
          alt={data.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant={data.isOpen ? "default" : "destructive"}
            className={data.isOpen ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {data.isOpen ? "Buka" : "Tutup"}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur text-slate-800 hover:bg-white">
            {data.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{data.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Star className="h-4 w-4 fill-current" />
            <span>{data.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{data.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{data.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>10 mnt lalu</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/usaha/${data.id}`} className="w-full">
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-transparent">
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
