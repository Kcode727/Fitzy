import { useState } from 'react';
import ImageContainer from './components/ImgContainer.jsx';
import Navbar from './components/Navbar.jsx';  
import './App.css';

function App() {
  return (
    <>
      <Navbar />             
      <ImageContainer />
    </>
  );
}

export default App;
