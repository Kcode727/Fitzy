'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import FitnessCarousel from '../components/FitnessCarousel';

export default function HomePage() {
  const [boxWidth, setBoxWidth] = useState('50vw');

  useEffect(() => {
    const updateBoxWidth = () => {
      const width = window.innerWidth;
      if (width >= 1200) setBoxWidth('25vw');
      else if (width >= 768) setBoxWidth('33.33vw');
      else setBoxWidth('50vw');
    };

    updateBoxWidth();
    window.addEventListener('resize', updateBoxWidth);
    return () => window.removeEventListener('resize', updateBoxWidth);
  }, []);

  useEffect(() => {
    const isFirstLoad = sessionStorage.getItem('fitzy_first_load') !== 'false';

    document.querySelectorAll('.container1 .box').forEach((box) => {
      const el = box as HTMLElement;
      el.style.opacity = '0.4';
      el.style.transform = 'translateY(0)';
    });

    if (isFirstLoad) {
      const tl = gsap.timeline();

      tl.from(".container1 .b1", { y: 50, opacity: 0, duration: 0.6 });
      tl.from(".container1 .b2", { y: 50, opacity: 0, duration: 0.6 });
      tl.from(".container1 .b3", { y: 50, opacity: 0, duration: 0.6 });
      tl.from(".container1 .b4", { y: 50, opacity: 0, duration: 0.6 });

      tl.to(".container1", { opacity: 0.5, duration: 1 });
      tl.fromTo(".overlay", { opacity: 0 }, { opacity: 1, duration: 1 });
      tl.fromTo(".navbar", { opacity: 0 }, { opacity: 1, duration: 1 });
      tl.fromTo(".overlay .title", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 });

      sessionStorage.setItem('fitzy_first_load', 'false');
    }
  }, []);

  const imageUrls = [
    '/images/1.jpg',
    '/images/2.jpeg',
    '/images/3.jpeg',
    '/images/4.jpeg',
  ];

  // --- Static styles ---
  const pageStyle: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    margin: 0,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    height: '100vh',
    width: '100vw',
    maxWidth: '100vw',
    zIndex: 0,
    overflow: 'hidden',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  };

  const titleStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const h1Style: React.CSSProperties = {
    fontFamily: 'var(--font-shrikhand)',
    fontSize: 'clamp(3rem, 10vw, 10rem)',
    color: 'white',
    fontWeight: 'lighter',
    position: 'relative',
    zIndex: 2,
    margin: 0,
  };

  const h2Style: React.CSSProperties = {
    fontFamily: 'var(--font-dm-serif)',
    fontSize: 'clamp(1rem, 2vw, 2rem)',
    color: '#444',
    textAlign: 'center',
    lineHeight: 1.4,
    fontWeight: 'normal',
    marginTop: '0.5rem',
    marginInline: '1rem',
  };

  // --- Dynamic style functions ---
  const boxStyle = (imgUrl: string): React.CSSProperties => ({
    flex: `0 0 ${boxWidth}`,
    height: '100vh',
    backgroundImage: `url(${imgUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.4,
    transform: 'translateY(50px)',
    transition: 'opacity 0.3s ease',
  });

  const h1BeforeAfter = (offset: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    top: `${offset}px`,
    left: `${offset + 5}px`,
    color,
    zIndex: -1,
  });

  return (
    <div>
      <div style={pageStyle}>
        <div className="container1" style={containerStyle}>
          {imageUrls.map((url, index) => (
            <div key={index} className={`box b${index + 1}`} style={boxStyle(url)} />
          ))}
        </div>

        <div className="overlay" style={overlayStyle}>
          <div className="title" style={titleStyle}>
            <h1 style={h1Style}>
              Fitzy
              <span style={h1BeforeAfter(10, '#666')}>Fitzy</span>
              <span style={h1BeforeAfter(5, '#333')}>Fitzy</span>
            </h1>
            <h2 style={h2Style}>
              Small steps, big results!
              <br />
              Show up for yourself every day
            </h2>
          </div>
        </div>
      </div>

      <FitnessCarousel />
    </div>
  );
}
