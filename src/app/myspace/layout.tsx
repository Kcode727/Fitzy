'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export default function MySpaceLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();
  const router = useRouter();
  const activeColor = '#ff4a4a';

  // Scroll navbar effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check user in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/signin');
    } else {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    router.push('/signin');
  };

  if (loading) {
    return <Loader />;
  }

  const navItems = [
    { path: '/myspace/myworkouts', name: 'Work Outs' },
    { path: '/myspace/myrecipes', name: 'Recipes' },
    { path: '/myspace/myblogs', name: 'Blogs' },
    { path: '/myspace/caltrack', name: 'Calorie Tracker' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/10 py-2 backdrop-blur-md' : 'bg-transparent py-6'
        } md:bg-white/10 md:backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-[#ff4a4a] text-2xl font-shrikhand">
            Fitzy
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1 w-10 h-10 justify-center items-center z-50"
          >
            <span className={`h-0.5 w-6 bg-black transition-all duration-300 ${isOpen ? 'bg-white rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 w-6 bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-black transition-all duration-300 ${isOpen ? 'bg-white -rotate-45 -translate-y-1.5' : ''}`} />
          </button>

          <ul className="hidden md:flex items-center gap-x-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="relative font-medium transition-colors duration-300 group"
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: '1.2rem',
                    color: pathname === item.path ? activeColor : 'text-gray-900',
                  }}
                >
                  {item.name}
                  <span
                    className="absolute left-0 bottom-0 top-6 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{
                      backgroundColor: activeColor,
                      width: pathname === item.path ? '100%' : '0%',
                    }}
                  />
                </Link>
              </li>
            ))}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignOut();
                }}
                className="text-gray-900 font-medium hover:text-[#ff8a8a] transition"
              >
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 flex flex-col items-center justify-center gap-8 text-white text-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden z-40`}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className="relative group font-semibold transition text-center"
            style={{
              color: pathname === item.path ? activeColor : '#ffffff',
            }}
          >
            {item.name}
            <span
              className="absolute left-0 bottom-0 h-0.5 transition-all duration-300"
              style={{
                backgroundColor: activeColor,
                width: pathname === item.path ? '100%' : '0',
              }}
            />
          </Link>
        ))}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
            handleSignOut();
          }}
          className="text-white font-medium hover:text-[#ff8a8a] transition"
        >
          Sign Out
        </a>
      </div>

      {/* Page Content */}
      <div className="pt-36 px-6 pb-10">{children}</div>
    </div>
  );
}
