'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    title: 'Gyming',
    text: 'Build power and endurance through high-intensity strength and cardio workouts. Whether you are lifting weights or smashing circuits, each session brings you closer to your best self.',
    bgColor: 'bg-gradient-to-br from-neutral-600 to-neutral-800',
    image: '/images/5.jpg',
  },
  {
    title: 'Running',
    text: 'Fuel your passion for movement with structured running plans. From beginners to marathoners, find your pace, boost stamina, and enjoy the runner high with every stride.',
    bgColor: 'bg-gradient-to-br from-orange-200 to-stone-500',
    image: '/images/6.jpg',
  },
  {
    title: 'Yoga',
    text: 'Stretch, breathe, and strengthen with yoga flows designed to center your mind and body. Improve flexibility, reduce stress, and feel grounded from the inside out.',
    bgColor: 'bg-gradient-to-br from-gray-300 to-sky-300',
    image: '/images/7.jpg',
  },
  {
    title: 'Dancing',
    text: 'Let loose and feel the rhythm with fun, high-energy dance workouts. Burn calories, boost your mood, and express yourself with every move on the floor.',
    bgColor: 'bg-gradient-to-br from-[#d1ae90] to-[#936a56]',
    image: '/images/8.jpg',
  },
  {
    title: 'Sports',
    text: 'Sharpen your speed, agility, and endurance with sport-inspired training. From dynamic drills to athletic challenges, unlock your full potential in motion.',
    bgColor: 'bg-gradient-to-br from-slate-300 to-cyan-600',
    image: '/images/9.jpg',
  },
  {
    title: 'Other Activities',
    text: 'Stay active with low-impact, joyful exercises that fit into your daily life. Stretch, flow, and move with intention—wherever you are, whenever you can.',
    bgColor: 'bg-gradient-to-br from-[#b6c1ba] to-[#667b76]',
    image: '/images/10.jpg',
  },
];

export default function FitnessCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const resetAutoRotate = () => {
    if (autoRotate) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(nextSlide, 5000);
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (leftRef.current) {
      leftRef.current.classList.remove('opacity-100');
      leftRef.current.classList.add('opacity-0');
      setTimeout(() => {
        leftRef.current?.classList.remove('opacity-0');
        leftRef.current?.classList.add('opacity-100');
      }, 50);
    }
  }, [current]);

   useEffect(() => {
  if (!overlayRef.current) return;

  gsap.set(overlayRef.current, { opacity: 0 });

  const section = document.getElementById('carousel-section');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  // Skip scroll trigger if already in view on mount
  if (isInView) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    onEnter: () => {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0,
            delay: 1,
          });
        },
      });
    },
    onLeaveBack: () => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    },
  });
}, []);


  const slide = slides[current];

  return (
    <section id="carousel-section" className="relative w-full">
      {/* Overlay Heading */}
<div
  ref={overlayRef}
  className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 z-50 pointer-events-none"
>
  <div className="relative text-center px-8 w-full max-w-4xl"> 
    {/* Animated background elements */}
    <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-orange-500/10 blur-xl -z-10" />
    <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-blue-500/10 blur-xl -z-10" />
    
    {/* Main heading */}
    <h1
      className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 px-4"
      style={{ fontFamily: 'var(--font-shrikhand)', letterSpacing: '0.05em' }}
    >
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 pr-1">
        What
      </span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 px-1">
        moves
      </span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500 pl-1 ml-4">
        you?
      </span>
    </h1>

    {/* Subtitle */}
    <p
      className="text-gray-200 text-lg md:text-xl mx-auto px-4"
      style={{ fontFamily: 'var(--font-dm-serif)', maxWidth: '32rem' }}
    >
      Discover your rhythm, energy, and purpose in motion.
    </p>
  </div>
    {/* Floating animated dots */}
    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-orange-400/40 animate-float" />
    <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-400/40 animate-float" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-emerald-400/40 animate-float" style={{ animationDelay: '2s' }} />
  </div>


      {/* Carousel */}
      <section className="flex flex-col md:flex-row h-screen w-full relative z-10">
        {/* Left Text */}
        <div
          ref={leftRef}
          className="transition-all duration-700 ease-in-out text-white relative flex flex-col justify-center px-8 md:px-20 py-10 md:py-0 w-full md:w-1/2"
          onMouseEnter={() => {
            setAutoRotate(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }}
          onMouseLeave={() => {
            setAutoRotate(true);
            resetAutoRotate();
          }}
        >
          <div className={`absolute inset-0 ${slide.bgColor} z-0`} />
          <div className="relative z-10 text-center">
            <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'var(--font-shrikhand)'}}>{slide.title}</h2>
            <p className="text-base md:text-xl mb-6 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-jakarta)'}}>{slide.text}</p>
            <button className="bg-white text-black py-2 px-6 rounded-full font-semibold hover:scale-105 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-full">
          {slides.map((s, i) => (
            <Image
              key={i}
              src={s.image}
              alt={s.title}
              fill
              className={`object-cover absolute inset-0 transition-opacity duration-1000 ease-out ${
                i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-20"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-20"
          >
            &#10095;
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  i === current ? 'bg-white scale-110' : 'bg-white/40'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
