import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Truck } from "lucide-react";
import {
  subscribeToPublishedSiteSettings,
} from "@/lib/cms/service";
import { getCmsThemeStyle } from "@/lib/cms/publicTheme";
import type { CmsPublishedSettings } from "@/lib/cms/types";
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
import { CarrierSignupForm } from "./pages/CarrierSignup";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import PublishedCmsPage from "./components/cms/PublishedCmsPage";
import UnpublishedLegalPage from "./components/cms/UnpublishedLegalPage";
import HowItWorks from "./pages/HowItWorks";
import { ContactFormPanel } from "./components/sections/Contact";

gsap.registerPlugin(ScrollTrigger);

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const RequireAdmin = lazy(() => import("./components/auth/RequireAdmin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const Carriers = lazy(() => import("./pages/admin/Carriers"));
const ContactInquiries = lazy(() => import("./pages/admin/ContactInquiries"));
const CarrierApplications = lazy(
  () => import("./pages/admin/CarrierApplications"),
);
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminCms = lazy(() => import("./pages/admin/AdminCms"));
const CmsLayout = lazy(() => import("./pages/admin/cms/CmsWorkspace"));
const CmsHeroEditor = lazy(() => import("./pages/admin/cms/CmsHeroEditor"));
const CmsPageEditor = lazy(() => import("./pages/admin/cms/CmsPageEditor"));
const CmsDesignEditor = lazy(() => import("./pages/admin/cms/CmsDesignEditor"));
const CmsMediaLibrary = lazy(() => import("./pages/admin/cms/CmsMediaLibrary"));
const CmsContentEditor = lazy(() => import("./pages/admin/cms/CmsContentEditor"));
const CmsDraftPreview = lazy(() => import("./pages/admin/cms/CmsDraftPreview"));

function App() {
  const location = useLocation();
  const pageRef = useRef<HTMLElement>(null);
  const isPublicPage = !location.pathname.startsWith("/admin");
  const [publishedSettings, setPublishedSettings] =
    useState<CmsPublishedSettings | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [showIntro, setShowIntro] = useState(
    () =>
      !location.pathname.startsWith("/admin") &&
      !prefersReducedMotion,
  );
  const isAdminDashboard =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin/login";
  const activeCmsSettings = isPublicPage ? publishedSettings : null;

  useEffect(() => {
    if (!isPublicPage) {
      setPublishedSettings(null);
      return;
    }

    return subscribeToPublishedSiteSettings(
      setPublishedSettings,
      (error) => {
        setPublishedSettings(null);
        console.error("Could not load published TruckAxic settings; using site defaults.", error);
      },
    );
  }, [isPublicPage]);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateMotionPreference = () =>
      setPrefersReducedMotion(motionPreference.matches);

    motionPreference.addEventListener("change", updateMotionPreference);
    return () =>
      motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowIntro(false);
    }
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (
      !page ||
      location.pathname.startsWith("/admin") ||
      prefersReducedMotion
    ) {
      return;
    }

    const context = gsap.context(() => {
      const pageHeroContent = page.querySelector<HTMLElement>(".page-hero-content");
      if (pageHeroContent) {
        gsap.fromTo(
          pageHeroContent,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            delay: 0.12,
            ease: "power2.out",
          },
        );
      }

      const revealTargets = gsap.utils.toArray<HTMLElement>(
        ".hero-content > div, .section-header, .section-heading",
        page,
      );
      if (revealTargets.length > 0) {
        revealTargets.forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        });
      }

      const sections = gsap.utils.toArray<HTMLElement>(
        ".section:not(.hero-shell)",
        page,
      );
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    }, page);

    return () => context.revert();
  }, [location.pathname, prefersReducedMotion]);

  return (
    <div
      className="min-h-screen bg-black selection:bg-primary-red selection:text-white"
      data-cms-theme={activeCmsSettings ? "true" : undefined}
      style={
        activeCmsSettings
          ? getCmsThemeStyle(activeCmsSettings.theme)
          : undefined
      }
    >
      {showIntro && (
        <div
          className="site-intro"
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) {
              setShowIntro(false);
            }
          }}
        >
          <div className="site-intro-content">
            <span className="site-intro-mark">
              <Truck size={30} strokeWidth={1.8} />
            </span>
            <span className="site-intro-name">
              TRUCKAXIC<span>.</span>
            </span>
            <span className="site-intro-caption">Dispatch in motion</span>
            <span className="site-intro-track">
              <span />
            </span>
          </div>
        </div>
      )}
      {!isAdminDashboard && <Navbar cmsSettings={activeCmsSettings} />}
      <main ref={pageRef}>
        <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={<Home cmsSettings={activeCmsSettings} />}
            />
            <Route
              path="/about"
              element={
                <PublishedCmsPage
                  pageId="about"
                  cmsSettings={activeCmsSettings}
                  fallback={<About />}
                />
              }
            />
            <Route
              path="/services"
              element={
                <PublishedCmsPage
                  pageId="services"
                  cmsSettings={activeCmsSettings}
                  fallback={<Services />}
                />
              }
            />
            <Route
              path="/how-it-works"
              element={
                <PublishedCmsPage
                  pageId="how-it-works"
                  cmsSettings={activeCmsSettings}
                  fallback={<HowItWorks />}
                />
              }
            />
            <Route
              path="/services/dry-van"
              element={
                <PublishedCmsPage
                  pageId="service-dry-van"
                  cmsSettings={activeCmsSettings}
                  fallback={<DryVan />}
                />
              }
            />
            <Route
              path="/services/reefer"
              element={
                <PublishedCmsPage
                  pageId="service-reefer"
                  cmsSettings={activeCmsSettings}
                  fallback={<Reefer />}
                />
              }
            />
            <Route
              path="/services/flatbed"
              element={
                <PublishedCmsPage
                  pageId="service-flatbed"
                  cmsSettings={activeCmsSettings}
                  fallback={<Flatbed />}
                />
              }
            />
            <Route
              path="/services/power-only"
              element={
                <PublishedCmsPage
                  pageId="service-power-only"
                  cmsSettings={activeCmsSettings}
                  fallback={<PowerOnly />}
                />
              }
            />
            <Route
              path="/contact"
              element={
                <PublishedCmsPage
                  pageId="contact"
                  cmsSettings={activeCmsSettings}
                  fallback={<Contact />}
                  formSlot={<ContactFormPanel />}
                />
              }
            />
            <Route
              path="/carrier-signup"
              element={
                <PublishedCmsPage
                  pageId="carrier-signup"
                  cmsSettings={activeCmsSettings}
                  fallback={<CarrierSignup />}
                  formSlot={<CarrierSignupForm />}
                />
              }
            />
            <Route
              path="/faq"
              element={
                <PublishedCmsPage
                  pageId="faq"
                  cmsSettings={activeCmsSettings}
                  fallback={<FAQ />}
                />
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <PublishedCmsPage
                  pageId="privacy-policy"
                  cmsSettings={activeCmsSettings}
                  fallback={<PrivacyPolicy />}
                />
              }
            />
            <Route
              path="/terms"
              element={
                <PublishedCmsPage
                  pageId="terms"
                  cmsSettings={activeCmsSettings}
                  fallback={<Terms />}
                />
              }
            />
            <Route
              path="/cookie-policy"
              element={
                <PublishedCmsPage
                  pageId="cookie-policy"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Cookie Policy"
                      description="A reviewed description of cookies and similar technologies will be available here after the website technology inventory is confirmed."
                    />
                  }
                />
              }
            />
            <Route
              path="/disclaimer"
              element={
                <PublishedCmsPage
                  pageId="disclaimer"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Disclaimer"
                      description="Website information and service disclaimers are being prepared for review."
                    />
                  }
                />
              }
            />
            <Route
              path="/service-agreement"
              element={
                <PublishedCmsPage
                  pageId="service-agreement"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Service Agreement"
                      description="Service terms will be provided here only after the commercial details and legal review are complete."
                    />
                  }
                />
              }
            />
            <Route
              path="/refund-cancellation-policy"
              element={
                <PublishedCmsPage
                  pageId="refund-cancellation-policy"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Refund & Cancellation Policy"
                      description="Refund and cancellation terms are being prepared and are not yet in effect."
                    />
                  }
                />
              }
            />
            <Route
              path="/accessibility-statement"
              element={
                <PublishedCmsPage
                  pageId="accessibility-statement"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Accessibility Statement"
                      description="Accessibility status and contact details will be added after a documented review."
                    />
                  }
                />
              }
            />
            <Route
              path="/data-security"
              element={
                <PublishedCmsPage
                  pageId="data-security"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Data Security"
                      description="Verified information about data safeguards will be provided after the applicable systems and procedures are reviewed."
                    />
                  }
                />
              }
            />
            <Route
              path="/report-security-issue"
              element={
                <PublishedCmsPage
                  pageId="report-security-issue"
                  cmsSettings={activeCmsSettings}
                  fallback={
                    <UnpublishedLegalPage
                      title="Report a Security Issue"
                      description="A monitored security reporting channel has not yet been confirmed. This page does not authorize testing any system."
                    />
                  }
                />
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="carriers" element={<Carriers />} />
                <Route path="inquiries" element={<ContactInquiries />} />
                <Route path="applications" element={<CarrierApplications />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="cms" element={<CmsLayout />}>
                  <Route index element={<AdminCms />} />
                  <Route path="hero" element={<CmsHeroEditor />} />
                  <Route path="pages" element={<CmsPageEditor />} />
                  <Route path="design" element={<CmsDesignEditor />} />
                  <Route path="media" element={<CmsMediaLibrary />} />
                  <Route path="content" element={<CmsContentEditor />} />
                  <Route path="preview/:pageId" element={<CmsDraftPreview />} />
                </Route>
                <Route
                  path="*"
                  element={<Navigate to="/admin" replace />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminDashboard && <Footer cmsSettings={activeCmsSettings} />}
    </div>
  );
}

export default App;
