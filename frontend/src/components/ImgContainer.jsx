import { useEffect } from 'react';
import gsap from 'gsap';
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpeg';
import img3 from '../assets/3.jpeg';
import img4 from '../assets/4.jpeg';
import Navbar from '../components/Navbar.jsx';

export default function ImageContainer() {
  useEffect(() => {
    const isFirstLoad = sessionStorage.getItem('fitzy_first_load') !== 'false';

    if (isFirstLoad) {
      const tl = gsap.timeline();

      tl.from(".container1 .b1", { y: 50, opacity: 0, duration: 0.6 });
      tl.from(".container1 .b2", { y: 50, opacity: 0, duration: 0.6 });
      tl.from(".container1 .b3", { y: 50, opacity: 0, duration: 0.6 });
      tl.from(".container1 .b4", { y: 50, opacity: 0, duration: 0.6 });

      tl.to(".container1", { opacity: 0.3, duration: 1 });
      tl.fromTo(".overlay", { opacity: 0 }, { opacity: 1, duration: 1 });
      tl.fromTo(".navbar", { opacity: 0 }, { opacity: 1, duration: 1 });
      tl.fromTo(".overlay .title", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 });

      sessionStorage.setItem('fitzy_first_load', 'false');
    }
  }, []);

  return (
    <>
      <div className="container1 w-screen h-screen bg-gray-300 flex relative">
        <img src={img1} className="box b1 w-1/4 h-full object-cover" alt="Image 1" />
        <img src={img2} className="box b2 w-1/4 h-full object-cover" alt="Image 2" />
        <img src={img3} className="box b3 w-1/4 h-full object-cover" alt="Image 3" />
        <img src={img4} className="box b4 w-1/4 h-full object-cover" alt="Image 4" />
      </div>
        {/* Overlay Title Section */}
        <div className="overlay absolute inset-0 opacity-0 flex items-center justify-center bg-white bg-opacity-40">
        <div className="flex flex-col items-center title relative">
          <h1 className="fitzy-text text-6xl">Fitzy</h1>
          <h2 className="font-dmserif text-[#525252] text-center mt-6 text-3xl leading-relaxed font-normal mt-2 mx-4 text-clamp-h2">
            Small steps, big results!
            <br />
            Show up for yourself every day
          </h2>
        </div>
      </div>
      <Navbar />
    </>

  );
}
