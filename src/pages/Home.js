import { useEffect, useState } from "react";
import Hero from "@/components/hero/Hero";
import CompanyIntro from "@/components/sections/CompanyIntro";
import ServicesSection from "@/components/sections/Services";
import WhyChoose from "@/components/sections/WhyChoose";
import HowItWorks from "@/components/sections/HowItWorks";
import CarrierBenefits from "@/components/sections/CarrierBenefits";
import Statistics from "@/components/sections/Statistics";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/Contact";
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);
    return (<div className="relative min-h-screen bg-black overflow-hidden">
      {isLoading ? (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="flex flex-col items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-red flex items-center justify-center">
              <svg className="text-white text-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12V7a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4h13a4 4 0 0 0 4-4Z"/>
                <path d="M9 20h6"/>
                <path d="M12 18V20"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tighter">TruckAxic</h1>
            <p className="mt-4 text-lg text-gray-300">Premium Truck Dispatch Solutions</p>
            <div className="w-12 h-12 rounded-full border-2 border-gray-600 flex items-center justify-center mt-8 animate-spin">
              <svg className="text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-none stroke-current stroke-8" cx="12" cy="12" r="10"/>
              </svg>
            </div>
          </div>
        </div>) : (<div>
          <Hero />
          <CompanyIntro />
          <ServicesSection />
          <WhyChoose />
          <HowItWorks />
          <CarrierBenefits />
          <Statistics />
          <Testimonials />
          <FAQ />
          <ContactSection />
        </div>)}
    </div>);
}
