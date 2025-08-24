import { Routes, Route } from "react-router-dom";
import ImageContainer from "./components/ImgContainer.jsx";
import Navbar from "./components/Navbar.jsx";
import ImageCarousel from "./components/ImageCarousel.jsx";
import SignIn from "./components/signin.jsx";
import Register from "./components/register.jsx";
import Dashboard from './components/mySpace/main.jsx';
import "./App.css";

function Home() {
  return (
    <>
      <ImageContainer />
      <ImageCarousel />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mySpace" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
