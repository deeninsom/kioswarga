'use client'
import { useBusiness } from "@/lib/business-context";
import React, { useState, useEffect, useCallback } from "react";

// ====================================================================
// --- MOCK Imports (Dibiarkan untuk kompatibilitas UI) ---
// ====================================================================
const Button = ({ children, className = "", variant = "default", type = "button", onClick, disabled }) => (
  <button className={`p-2 rounded-lg text-sm font-medium transition-colors ${className} ${variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : variant === 'outline' ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`} type={type} onClick={onClick} disabled={disabled}>{children}</button>
);
const Input = ({ id, name, value, onChange, placeholder, maxLength, required, type = "text", className = "" }) => (
  <input id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} required={required} type={type} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 ${className}`} />
);
const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>
);
const Textarea = ({ id, name, value, onChange, placeholder, className = "" }) => (
  <textarea id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 ${className}`}></textarea>
);
const Card = ({ children, className = "" }) => <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-xl font-semibold leading-none tracking-tight text-gray-800">{children}</h3>;
const CardDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>;
const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardFooter = ({ children, className = "" }) => <div className={`flex items-center p-6 pt-0 border-t bg-gray-50/50 rounded-b-xl ${className}`}>{children}</div>;
const Link = ({ href, target, children, className = "" }) => <a href={href} target={target} className={`text-blue-600 hover:text-blue-700 ${className}`}>{children}</a>;

// Icons
const Save = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const ExternalLink = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14L21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>;
const Store = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.5 2h-11a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" /><path d="M14 9h3" /><path d="M14 13h3" /><path d="M14 17h3" /><path d="M7 9h3" /><path d="M7 13h3" /><path d="M7 17h3" /></svg>;
const MapPin = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const Clock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const Phone = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-5.6-5.6A19.79 19.79 0 0 1 2 4.18V2.36a2 2 0 0 1 2-2c1.37.1 2.76.57 4 1.34l.2 1.39a2 2 0 0 1-.37 2.13l-1.39 1.39A1.7 1.7 0 0 0 6 9.87a1 1 0 0 0 .15.68l.49.49c3.15 3.14 5.7 5.7 8.85 8.85l.49.49a1 1 0 0 0 .68.15 1.7 1.7 0 0 0 1.25-.56l1.39-1.39a2 2 0 0 1 2.13-.37l1.39.2c.77 1.24 1.24 2.63 1.34 4z" /></svg>;
const AlertTriangle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;


const LoadingSpinner = ({ className = "" }) => (
  <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

// Tipe Data Bisnis untuk inisialisasi state yang lebih rapi
const INITIAL_BUSINESS_STATE = {
  id: null,
  name: "",
  category: "",
  description: "",
  longDescription: "",
  address: "",
  phone: "",
  openingHours: "",
  location: "",
  image: "/placeholder-business.jpg", // Default placeholder
  isOpen: false,
};

// ====================================================================
// FUNGSI API RIIL (Sama seperti sebelumnya)
// ====================================================================
const fetchBusinessData = async (businessId) => {
  if (!businessId) return null;
  const response = await fetch(`/api/business/${businessId}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || `Gagal memuat data (Status: ${response.status})`);
  }
  return response.json();
};

const saveBusinessData = async (data) => {
  if (!data.id) throw new Error("Business ID is required for saving.");
  // Perbaikan: Hapus field owner dari data sebelum kirim ke API untuk menghindari Prisma Validation Error
  const { owner, createdAt, updatedAt, ...cleanData } = data;

  const response = await fetch(`/api/business/${cleanData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || `Gagal menyimpan data (Status: ${response.status})`);
  }

  const updatedData = await response.json();
  return { success: true, updatedData };
};

// ====================================================================
// KOMPONEN UTAMA
// ====================================================================

export default function SettingsPage() {
  const {
    businesses,
    currentUserBusinessId,
    isContextLoading,
    // refetchBusinessData, // Dihapus dari destructuring jika tidak digunakan
  } = useBusiness();

  const businessFromContext = businesses.find((b) => b.id === currentUserBusinessId);

  const [formData, setFormData] = useState(INITIAL_BUSINESS_STATE);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchError, setFetchError] = useState("");

  // 1. Mengambil data awal
  useEffect(() => {
    if (isContextLoading) return;

    const loadData = async () => {
      if (!businessFromContext?.id) {
        setIsFetching(false);
        setFetchError("Anda belum terhubung dengan bisnis mana pun.");
        return;
      }

      setIsFetching(true);
      setFetchError("");
      try {
        const data = await fetchBusinessData(businessFromContext.id);

        if (!data) {
          setFetchError("Data Usaha tidak ditemukan di server.");
          return;
        }

        // Pastikan setFormData menggunakan data yang dimuat, dengan fallback untuk field yang mungkin null
        setFormData({ ...INITIAL_BUSINESS_STATE, ...data });

      } catch (error) {
        console.error("Fetch Data Error:", error);
        setFetchError(error.message);
      } finally {
        setIsFetching(false);
      }
    };

    loadData();
  }, [businessFromContext, isContextLoading]);


  // Kunci perbaikan: Gunakan useEffect untuk menghapus pesan status setelah beberapa detik
  useEffect(() => {
    let successTimer, errorTimer;
    if (successMessage) {
      successTimer = setTimeout(() => setSuccessMessage(""), 3000);
    }
    if (errorMessage) {
      errorTimer = setTimeout(() => setErrorMessage(""), 5000);
    }
    return () => {
      clearTimeout(successTimer);
      clearTimeout(errorTimer);
    };
  }, [successMessage, errorMessage]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleToggleOpen = () => {
    setFormData((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  // 2. Mengirim data ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // PENTING: saveBusinessData sekarang bertanggung jawab membersihkan field (seperti owner)
      const response = await saveBusinessData(formData);

      if (response.success) {
        // Optional: refetchBusinessData (jika ada)

        setFormData(response.updatedData);
        setSuccessMessage("Perubahan berhasil disimpan! ✅");
      } else {
        throw new Error("Penyimpanan gagal, respons tidak sukses.");
      }

    } catch (error) {
      console.error("Save API Error:", error);
      setErrorMessage(error.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Tampilan Loading dan Error Awal ---
  if (isContextLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-lg font-semibold text-gray-500 bg-gray-50/50 rounded-xl p-8">
        <LoadingSpinner className="h-8 w-8 text-blue-500 mb-4" /> Memuat data pengguna...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-lg font-semibold text-red-500 bg-red-50/10 border border-red-200 rounded-xl p-8">
        <Store className="h-8 w-8 mr-2" />
        <p className="mt-4">{fetchError}</p>
        <p className="text-sm text-gray-500 mt-2">Coba refresh halaman atau pastikan akun Anda memiliki bisnis yang terdaftar.</p>
      </div>
    );
  }

  if (isFetching || formData.id === null) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-lg font-semibold text-gray-500 bg-gray-50/50 rounded-xl p-8">
        <LoadingSpinner className="h-8 w-8 text-blue-500 mb-4" /> Memuat detail usaha...
      </div>
    );
  }

  const descriptionLength = formData.description?.length ?? 0;
  const businessIdForLink = businessFromContext?.id || '#';
  const displayImage = formData.image || INITIAL_BUSINESS_STATE.image; // Fallback jika image null

  return (
    <div className="flex flex-col gap-8 pb-10  mx-auto p-4 sm:p-6 bg-white w-full rounded-xl shadow-lg">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Pengaturan Usaha</h1>
          <p className="text-md text-gray-600">
            Kelola informasi profil usaha Anda yang tampil di publik.
          </p>
        </div>
        <Link
          href={`/usaha/${businessIdForLink}`}
          target="_blank"
          className="w-full md:w-auto flex-shrink-0"
        >
          <Button variant="outline" className="gap-2 w-full bg-white hover:bg-gray-100 border-gray-300 text-gray-700">
            <ExternalLink className="h-4 w-4" />
            Lihat Halaman Publik
          </Button>
        </Link>
      </div>

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">

          {/* Status Card */}
          <Card className="shadow-lg">
            <CardHeader className="p-4 bg-gray-50/50 border-b rounded-t-xl">
              <CardTitle>Status Operasional</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full flex-shrink-0 ${formData.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Status Toko:{" "}
                    <span className={formData.isOpen ? "text-green-600" : "text-red-600"}>
                      {formData.isOpen ? "BUKA" : "TUTUP"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.isOpen
                      ? "Toko Anda terlihat 'Buka' oleh pelanggan."
                      : "Toko Anda terlihat 'Tutup' oleh pelanggan."}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant={formData.isOpen ? "destructive" : "default"}
                onClick={handleToggleOpen}
                disabled={isLoading}
                className={`w-full sm:w-auto mt-2 sm:mt-0 px-6 ${formData.isOpen ? "" : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {formData.isOpen ? "Tutup Toko Sekarang" : "Buka Toko Sekarang"}
              </Button>
            </CardContent>
          </Card>

          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Informasi utama yang akan dilihat pelanggan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Usaha <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Contoh: Warung makan prasmanan dengan harga terjangkau"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 text-right">
                  <span className={descriptionLength > 90 ? "text-red-500" : ""}>{descriptionLength}</span>/100 karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Tentang Usaha (Deskripsi Lengkap)</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  className="min-h-[150px]"
                  placeholder="Ceritakan sejarah, keunggulan, dan detail usaha Anda..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Lokasi & Kontak</CardTitle>
              <CardDescription>Bagaimana pelanggan dapat menemukan dan menghubungi Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Contoh Seeding No. 123, Kelurahan, Kecamatan..." />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Kota / Area</Label>
                  <div className="relative">
                    <MapPin className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Contoh: Jakarta Selatan"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon / WhatsApp</Label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="0812..." type="tel" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours">Jam Operasional</Label>
                <div className="relative">
                  <Clock className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    placeholder="Contoh: Senin - Jumat, 09:00 - 17:00"
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Foto sampul utama untuk halaman usaha Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">URL Foto Sampul</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Masukkan URL Gambar Anda (mis: https://...)"
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <Label>Preview Foto Sampul</Label>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
                  <img
                    src={displayImage}
                    alt="Preview Foto Sampul Usaha"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/333333?text=Foto+Tidak+Valid";
                      e.currentTarget.onerror = null; // Prevent infinite loop
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>

            {/* Save Button & Status Footer */}
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center sm:items-center px-6  py-4 mt-4">
              <div className="mb-2 sm:mb-0 w-full sm:w-auto ">
                {successMessage && (
                  <span className="flex items-center gap-2 text-green-600 font-medium animate-in fade-in">
                    <Save className="h-4 w-4" /> {successMessage}
                  </span>
                )}
                {errorMessage && (
                  <span className="flex items-center gap-2 text-red-600 font-medium animate-in fade-in">
                    <AlertTriangle className="h-4 w-4" /> {errorMessage}
                  </span>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="cursor-pointer bg-blue-600 hover:bg-blue-700 w-full my-2.5 sm:w-auto">
                {isLoading ? (
                  <span className="flex items-center">
                    <LoadingSpinner />
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 ">
                    <Save className="h-4 w-4" /> Simpan Perubahan
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}