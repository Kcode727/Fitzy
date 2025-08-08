import { useState } from 'react';
import ImageContainer from './components/ImgContainer.jsx';
import Navbar from './components/Navbar.jsx';  
import ImageCarousel from './components/ImageCarousel.jsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar />             
      <ImageContainer />
      <ImageCarousel />
    </>
  );
}

export default App;
