'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { path: '/', name: 'Home' },
    { path: '/workout', name: 'Work Out' },
    { path: '/tracker', name: 'Calorie Tracker' },
    { path: '/profile', name: 'Profile' },
  ];

  const activeColor = '#ff8a8a';

  return (
    <nav
      className={`navbar fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/85 py-2 backdrop-blur-md' : 'bg-transparent py-6'
      } md:bg-black/50 md:backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* Hamburger Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1 w-10 h-10 justify-center items-center z-50"
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex justify-center items-center w-full gap-x-6 sm:gap-x-8 md:gap-x-12 lg:gap-x-16 xl:gap-x-24">
  {navItems.map((item) => (
    <li key={item.path} className="overflow-hidden">
      <Link
        href={item.path}
        className="relative font-medium transition-colors duration-300 group"
        style={{
          fontFamily: 'var(--font-jakarta)',
          fontSize: '1.2rem',
          color: pathname === item.path ? activeColor : '#ffffff',
        }}
      >
        {item.name}
        <span
          className="absolute left-0 bottom-0 top-6 h-0.5 transition-all duration-300 group-hover:w-full"
          style={{
            backgroundColor: activeColor,
            width: pathname === item.path ? '100%' : '0%',
          }}
        ></span>
      </Link>
    </li>
  ))}
</ul>

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
              onClick={closeMenu}
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
              ></span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
