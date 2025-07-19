'use client';

import { usePathname } from 'next/navigation';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase'; // must match your `lib/supabase.ts`
import { Shrikhand, Plus_Jakarta_Sans, DM_Serif_Display } from 'next/font/google';
import Navbar from '../components/Navbar';
import './globals.css';

const shrikhand = Shrikhand({
  variable: '--font-shrikhand',
  subsets: ['latin'],
  weight: '400',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = ['/signin', '/myspace', '/myspace/caltrack'].includes(pathname);

  return (
    <html lang="en" className={`${shrikhand.variable} ${plusJakarta.variable} ${dmSerif.variable}`}>
      <body className="bg-black text-white font-sans">
        <SessionContextProvider supabaseClient={supabase}>
          {!hideNavbar && <Navbar />}
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
