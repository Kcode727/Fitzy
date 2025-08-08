import React, { useEffect, useRef, useState } from 'react';
import './ImageCarousel.css'; // move styles here or use CSS-in-JS
// ✅ Import images correctly
import img6 from "../assets/6.jpg";
import img9 from "../assets/9.jpg";
import img8 from "../assets/8.jpg";
import img10 from "../assets/10.jpg";
import img12 from "../assets/12.jpg";
import img7 from "../assets/7.jpg";

const slides = [
  {
    title: "Gyming",
    text: "Achieve your fitness goals with tailored strength and cardio training. Our expert-led programs help you build muscle, burn fat, and feel empowered every day.",
    bgColor: "linear-gradient(135deg,rgb(80, 80, 80) 0%,rgb(43, 43, 43) 100%)",
    image: img6
  },
  {
    title: "Dancing",
    text: "Turn up the music and move your body with high-energy dance workouts. Improve coordination, boost your mood, and get fit in the most fun way possible.",
    bgColor: "linear-gradient(135deg,rgb(255, 216, 193) 0%,rgb(223, 128, 84) 100%)",
    image: img9
  },
  {
    title: "Yoga",
    text: "Find balance between body and mind through guided yoga sessions. Increase flexibility, reduce stress, and reconnect with yourself through mindful movement.",
    bgColor: "linear-gradient(135deg,rgb(219, 255, 255) 0%,rgb(111, 255, 236) 100%)",
    image: img8
  },
  {
    title: "Other Activities",
    text: "Incorporate joyful movement into your daily routine. From stretching to low-impact exercises, stay active and energized every day—no matter your schedule.",
    bgColor: "linear-gradient(135deg,rgb(194, 218, 218) 0%,rgb(125, 129, 129) 100%)",
    image: img10
  },
  {
    title: "Sports",
    text: "Train like a pro with dynamic sports workouts focused on speed, agility, and strength. Perfect for athletes looking to elevate performance and stay in peak shape.",
    bgColor: "linear-gradient(135deg,rgb(193, 239, 253) 0%,rgb(98, 210, 255) 100%)",
    image: img12
  },
  {
    title: "Running",
    text: "Boost your stamina and cardiovascular health with structured running plans. Whether you're a beginner or marathoner, take each stride with confidence.",
    bgColor: "linear-gradient(135deg,rgb(194, 193, 193) 0%,rgb(240, 185, 153) 100%)",
    image: img7
  }
];

const FitnessCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const rotateInterval = useRef(null);
  const leftPanelRef = useRef(null);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoRotate();
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    resetAutoRotate();
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    resetAutoRotate();
  };

  const resetAutoRotate = () => {
    if (autoRotate) {
      clearInterval(rotateInterval.current);
      rotateInterval.current = setInterval(goToNextSlide, 5000);
    }
  };

  useEffect(() => {
    rotateInterval.current = setInterval(goToNextSlide, 5000);

    return () => clearInterval(rotateInterval.current);
  }, []);

  useEffect(() => {
    // Trigger animation class
    const panel = leftPanelRef.current;
    if (panel) {
      panel.classList.remove('active-animate');
      setTimeout(() => panel.classList.add('active-animate'), 50);
    }
  }, [currentSlide]);

  const { title, text, bgColor, image } = slides[currentSlide];

  const [fadeOut, setFadeOut] = useState(false);

useEffect(() => {
  const timeout = setTimeout(() => {
    setFadeOut(true);
  }, 3000); 

  return () => clearTimeout(timeout);
}, []);

  return (
    <section id="hero">
      <div
        className="left"
        id="left-panel"
        ref={leftPanelRef}
        style={{ background: bgColor }}
        onMouseEnter={() => {
          setAutoRotate(false);
          clearInterval(rotateInterval.current);
        }}
        onMouseLeave={() => {
          setAutoRotate(true);
          resetAutoRotate();
        }}
      >
        <h1>What moves you?</h1>
        <h2>{title}</h2>
        <p>{text}</p>
        <button className="primary">Get Started</button>
      </div>

      <div className="right">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.title}
            className={index === currentSlide ? 'active' : ''}
          />
        ))}

        <button className="carousel-arrow" id="prevBtn" onClick={goToPrevSlide}>
          &#10094;
        </button>
        <button className="carousel-arrow" id="nextBtn" onClick={goToNextSlide}>
          &#10095;
        </button>

        <div className="carousel-indicators" id="indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FitnessCarousel;
