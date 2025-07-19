'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const confirmEmail = async () => {
      // Forces Supabase to parse the URL hash and establish session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Email confirmation failed:', error.message);
      } else if (data.session) {
        localStorage.setItem('user', JSON.stringify(data.session.user));
        router.push('/myspace');
      } else {
        console.warn('No session found — email confirmed, but not logged in.');
      }
    };

    confirmEmail();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Verifying your email...
    </div>
  );
}
