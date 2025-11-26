// lib/auth-context.tsx

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// *ASUMSI TIPE DATA USER*
interface CurrentUser {
  id: string;
  name: string;
  email: string;
  businessId: string | null;
  businessName: string | null;
}

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 1. Definisikan Context dengan nilai default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Definisikan Hook useAuth kustom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Definisikan Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Efek untuk memuat user dari localStorage/cookie saat aplikasi dimuat
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // *TODO: Di sini Anda harus memanggil API /api/auth/me untuk memverifikasi token
        // dan mendapatkan data user yang terbarukan.
        // Untuk sementara, kita hanya melakukan simulasi:
        try {
          // Mengambil data user dari token (hanya untuk simulasi cepat)
          // Di aplikasi nyata, pastikan Anda memanggil API
          const dummyUser: CurrentUser = {
            id: 'dummy-id',
            name: 'Guest User',
            email: 'guest@example.com',
            businessId: 'dummy-business-id',
            businessName: 'Dummy Store'
          };
          setUser(dummyUser);
        } catch (error) {
          console.error("Token verification failed", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Fungsi Login (Menyimpan token)
  const login = (token: string) => {
    localStorage.setItem('token', token);
    // *TODO: Ambil dan set data user yang sebenarnya setelah login berhasil
    setIsLoading(true);
    // Contoh: router.push('/dashboard');
  };

  // Fungsi Logout (Menghapus token)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};