import Hero from '@/components/hero/Hero';
import CompanyIntro from '@/components/sections/CompanyIntro';
import ServicesSection from '@/components/sections/Services';
import WhyChoose from '@/components/sections/WhyChoose';
import HowItWorks from '@/components/sections/HowItWorks';
import CarrierBenefits from '@/components/sections/CarrierBenefits';
import Statistics from '@/components/sections/Statistics';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import ContactSection from '@/components/sections/Contact';
import PublishedCmsPage from '@/components/cms/PublishedCmsPage';
import type { CmsPublishedSettings } from '@/lib/cms/types';

export default function Home({
  cmsSettings = null,
}: {
  cmsSettings?: CmsPublishedSettings | null;
}) {
  return (
    <PublishedCmsPage
      pageId="home"
      cmsSettings={cmsSettings}
      homeFallbacks
      fallback={
        <div>
          <Hero />
          <CompanyIntro />
          <div id="home-services">
            <ServicesSection />
          </div>
          <WhyChoose />
          <HowItWorks />
          <CarrierBenefits />
          <Statistics />
          <Testimonials />
          <FAQ />
          <ContactSection />
        </div>
      }
    />
  );
}
