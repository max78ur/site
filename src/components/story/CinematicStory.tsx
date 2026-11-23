import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

export default function CinematicStory() {
  useEffect(() => {
    // Scene 1: Headlights illuminate the dark environment
    const headlights = document.querySelectorAll(".headlight");
    if (headlights.length > 0) {
      headlights.forEach((h) => {
        gsap.fromTo(
          h,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out" }
        );
      });
    }

    // Scene 2: Camera moves around the truck to reveal front and side
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scene-2",
        start: "top center",
        end: "bottom center",
        toggleActions: "play reverse play reverse",
      },
    })
      .from(".truck-front", { x: -100, duration: 1, ease: "power2.out" })
      .from(".truck-side", { x: 100, duration: 1, ease: "power2.out" }, "+=0.5");

    // Scene 3: Truck starts moving along highway
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scene-3",
        start: "top center",
        end: "bottom center",
        toggleActions: "play reverse play reverse",
      },
    })
      .from(".truck-group", { y: 50, duration: 1, ease: "power2.out" });

    // Scene 4: Environment transitions to bright highway
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scene-4",
        start: "top center",
        end: "bottom center",
        toggleActions: "play reverse play reverse",
      },
    })
      .to(".bg-dark", { opacity: 0, duration: 1 })
      .to(".bg-light", { opacity: 1, duration: 1 }, "+=0.5");

    // Scene 5: Logistics and dispatch visualization
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scene-5",
        start: "top center",
        end: "bottom center",
        toggleActions: "play reverse play reverse",
      },
    })
      .from(".dispatch-elements", { opacity: 0, y: 50, duration: 1, ease: "power2.out" });

    // Scene 6: Services and company sections reveal
    gsap.timeline({
      scrollTrigger: {
        trigger: ".scene-6",
        start: "top center",
        end: "bottom center",
        toggleActions: "play reverse play reverse",
      },
    })
      .from(".service-card, .company-intro", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
  }, []);

  return null;
}
