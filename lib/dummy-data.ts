import { Store, Coffee, Utensils, Shirt, Zap } from "lucide-react"

// export const businesses = [
//   {
//     id: 1,
//     name: "Es Teh Jumbo Mas Budi",
//     description: "Es teh manis segar dengan porsi jumbo, cocok untuk melepas dahaga di siang hari.",
//     longDescription:
//       "Es Teh Jumbo Mas Budi telah menjadi favorit warga sekitar sejak 2018. Kami menggunakan teh pilihan berkualitas tinggi dan gula asli tanpa pemanis buatan. Tersedia berbagai varian rasa mulai dari original, lemon, hingga susu. Cocok dinikmati saat cuaca panas atau sebagai teman makan siang Anda.",
//     address: "Jl. Fatmawati Raya No. 45, Cilandak, Jakarta Selatan",
//     phone: "0812-3456-7890",
//     openingHours: "09:00 - 21:00",
//     products: [
//       { name: "Es Teh Original Jumbo", price: "Rp 5.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Es Teh Lemon Jumbo", price: "Rp 7.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Es Teh Susu Jumbo", price: "Rp 8.000", image: "/placeholder.svg?height=100&width=100" },
//     ],
//     category: "Minuman",
//     rating: 4.8,
//     location: "Jakarta Selatan",
//     image: "/ice-tea.jpg",
//     isOpen: true,
//   },
//   {
//     id: 2,
//     name: "Keripik Pedas Maicih KW",
//     description: "Camilan keripik singkong dengan tingkat kepedasan yang bisa disesuaikan.",
//     longDescription:
//       "Keripik singkong renyah dengan bumbu rahasia yang bikin nagih. Tersedia dalam level kepedasan 1 sampai 10. Dibuat dari singkong pilihan yang digoreng dengan minyak berkualitas. Tanpa bahan pengawet dan aman dikonsumsi setiap hari.",
//     address: "Jl. Dago Atas No. 12, Bandung",
//     phone: "0813-4567-8901",
//     openingHours: "08:00 - 20:00",
//     products: [
//       { name: "Keripik Level 3", price: "Rp 15.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Keripik Level 5", price: "Rp 15.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Keripik Level 10", price: "Rp 18.000", image: "/placeholder.svg?height=100&width=100" },
//     ],
//     category: "Makanan Ringan",
//     rating: 4.5,
//     location: "Bandung",
//     image: "/spicy-chips.jpg",
//     isOpen: true,
//   },
//   {
//     id: 3,
//     name: "Laundry Kilat 24 Jam",
//     description: "Jasa cuci pakaian ekspres, bersih, wangi, dan siap dalam 24 jam.",
//     longDescription:
//       "Solusi cucian menumpuk Anda! Kami melayani cuci kiloan, satuan, bed cover, hingga sepatu. Menggunakan deterjen ramah lingkungan dan pewangi premium yang tahan lama. Layanan antar jemput gratis untuk area Surabaya radius 3km.",
//     address: "Jl. Dharmawangsa No. 88, Surabaya",
//     phone: "0811-2345-6789",
//     openingHours: "24 Jam",
//     products: [
//       { name: "Cuci Komplit (per kg)", price: "Rp 7.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Cuci Setrika (per kg)", price: "Rp 5.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Cuci Bed Cover", price: "Rp 25.000", image: "/placeholder.svg?height=100&width=100" },
//     ],
//     category: "Jasa",
//     rating: 4.9,
//     location: "Surabaya",
//     image: "/laundry-service.jpg",
//     isOpen: true,
//   },
//   {
//     id: 4,
//     name: "Seblak Prasmanan Teteh",
//     description: "Seblak dengan topping bebas pilih sesuka hati. Pedas nampol!",
//     longDescription:
//       "Surga bagi pecinta seblak! Konsep prasmanan membebaskan Anda memilih isian mulai dari kerupuk, makaroni, ceker, bakso, sosis, hingga sayuran. Kuah kencur khas kami dijamin bikin melek dan ketagihan.",
//     address: "Jl. Pajajaran No. 21, Bogor",
//     phone: "0856-7890-1234",
//     openingHours: "11:00 - 22:00",
//     products: [
//       { name: "Paket Hemat", price: "Rp 10.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Paket Kenyang", price: "Rp 15.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Topping Ceker", price: "Rp 3.000", image: "/placeholder.svg?height=100&width=100" },
//     ],
//     category: "Makanan",
//     rating: 4.7,
//     location: "Bogor",
//     image: "/spicy-soup.jpg",
//     isOpen: false,
//   },
//   {
//     id: 5,
//     name: "Kopi Senja Indie",
//     description: "Tempat nongkrong asik dengan kopi arabika pilihan dan live music.",
//     longDescription:
//       "Tempat yang pas untuk merenung atau berdiskusi tentang senja. Menyajikan kopi single origin dari berbagai daerah di Indonesia. Dilengkapi dengan WiFi kencang dan suasana yang cozy untuk bekerja atau sekadar bersantai.",
//     address: "Jl. Malioboro No. 10, Yogyakarta",
//     phone: "0819-8765-4321",
//     openingHours: "16:00 - 24:00",
//     products: [
//       { name: "Kopi Susu Senja", price: "Rp 18.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "V60 Gayo", price: "Rp 22.000", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Roti Bakar", price: "Rp 15.000", image: "/placeholder.svg?height=100&width=100" },
//     ],
//     category: "Minuman",
//     rating: 4.6,
//     location: "Yogyakarta",
//     image: "/coffee-shop.jpg",
//     isOpen: true,
//   },
//   {
//     id: 6,
//     name: "Service HP Panggilan",
//     description: "Perbaikan HP bisa ditunggu dan dipanggil ke rumah.",
//     longDescription:
//       "HP rusak tapi malas keluar rumah? Kami solusinya! Teknisi berpengalaman kami siap datang ke lokasi Anda. Melayani ganti LCD, baterai, konektor cas, hingga mati total. Bergaransi dan transparan.",
//     address: "Jl. Panjang No. 55, Kebon Jeruk, Jakarta Barat",
//     phone: "0877-6543-2109",
//     openingHours: "09:00 - 18:00",
//     products: [
//       { name: "Ganti Baterai", price: "Mulai Rp 100rb", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Ganti LCD", price: "Mulai Rp 250rb", image: "/placeholder.svg?height=100&width=100" },
//       { name: "Service Software", price: "Mulai Rp 50rb", image: "/placeholder.svg?height=100&width=100" },
//     ],
//     category: "Jasa",
//     rating: 4.4,
//     location: "Jakarta Barat",
//     image: "/phone-repair.jpg",
//     isOpen: true,
//   },
// ]

export const categories = [
  { name: "Semua", icon: Store },
  { name: "Makanan", icon: Utensils },
  { name: "Minuman", icon: Coffee },
  { name: "Fashion", icon: Shirt },
  { name: "Jasa", icon: Zap },
]

// export const dashboardStats = {
//   revenue: {
//     total: "Rp 4.500.000",
//     change: "+20.1%",
//     trend: "up",
//   },
//   visitors: {
//     total: "+2350",
//     change: "+180.1%",
//     trend: "up",
//   },
//   orders: {
//     total: "+12,234",
//     change: "+19%",
//     trend: "up",
//   },
//   activeNow: {
//     total: "+573",
//     change: "+201",
//     trend: "up",
//   },
// }

export const salesData = [
  { name: "Sen", total: 1500000 },
  { name: "Sel", total: 2300000 },
  { name: "Rab", total: 3200000 },
  { name: "Kam", total: 2800000 },
  { name: "Jum", total: 4100000 },
  { name: "Sab", total: 5600000 },
  { name: "Min", total: 4800000 },
]

// export const recentSales = [
//   {
//     id: 1,
//     name: "Budi Santoso",
//     email: "budi.santoso@email.com",
//     amount: "Rp 250.000",
//     avatar: "/avatars/01.png",
//     initials: "BS",
//   },
//   {
//     id: 2,
//     name: "Siti Aminah",
//     email: "siti.aminah@email.com",
//     amount: "Rp 39.000",
//     avatar: "/avatars/02.png",
//     initials: "SA",
//   },
//   {
//     id: 3,
//     name: "Rina Wati",
//     email: "rina.wati@email.com",
//     amount: "Rp 299.000",
//     avatar: "/avatars/03.png",
//     initials: "RW",
//   },
//   {
//     id: 4,
//     name: "Joko Widodo",
//     email: "joko.widodo@email.com",
//     amount: "Rp 99.000",
//     avatar: "/avatars/04.png",
//     initials: "JW",
//   },
//   {
//     id: 5,
//     name: "Dewi Lestari",
//     email: "dewi.lestari@email.com",
//     amount: "Rp 39.000",
//     avatar: "/avatars/05.png",
//     initials: "DL",
//   },
// ]

export function getBusinessById(id: number) {
  // return businesses.find((b) => b.id === id)
}
