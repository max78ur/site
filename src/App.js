import { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import DryVan from "./pages/services/DryVan";
import Reefer from "./pages/services/Reefer";
import Flatbed from "./pages/services/Flatbed";
import PowerOnly from "./pages/services/PowerOnly";
import Contact from "./pages/Contact";
import CarrierSignup from "./pages/CarrierSignup";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
// Removed: import "./components/hero/CinematicHero.css";
// Removed: import "./app/globals.css";
let didInitialize = false;
function App() {
    useEffect(() => {
        if (didInitialize)
            return;
        didInitialize = true;
        const { gsap } = window;
        document.documentElement.style.scrollBehavior = "smooth";
    }, []);
    return (<div className="min-h-screen bg-black selection:bg-primary-red selection:text-white">
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/services" element={<Services />}/>
          <Route path="/services/dry-van" element={<DryVan />}/>
          <Route path="/services/reefer" element={<Reefer />}/>
          <Route path="/services/flatbed" element={<Flatbed />}/>
          <Route path="/services/power-only" element={<PowerOnly />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/carrier-signup" element={<CarrierSignup />}/>
          <Route path="/faq" element={<FAQ />}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
          <Route path="/terms" element={<Terms />}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </Suspense>
      <Footer />
    </div>);
}
export default App;
