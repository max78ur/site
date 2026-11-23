import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, Truck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CmsPublishedSettings } from '@/lib/cms/types';
import { CmsPublicLink } from '@/components/cms/CmsPublicLink';

const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'FAQ', href: '/faq' },
];

const serviceLinks = [
  { label: 'Dry Van', href: '/services/dry-van' },
  { label: 'Reefer', href: '/services/reefer' },
  { label: 'Flatbed', href: '/services/flatbed' },
  { label: 'Power Only', href: '/services/power-only' },
];

export default function Navbar({
  cmsSettings = null,
}: {
  cmsSettings?: CmsPublishedSettings | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) =>
    location.pathname === href ||
    (href !== '/' && location.pathname.startsWith(href));

  const closeMenu = () => setIsOpen(false);
  const cmsNavigation = cmsSettings
    ? cmsSettings.navigation.filter((item) => item.visible)
    : null;
  const hasHowItWorksSetting = Boolean(
    cmsSettings?.navigation.some((item) => item.href === '/how-it-works'),
  );
  if (cmsNavigation && !hasHowItWorksSetting) {
    const howItWorksLink = {
      id: 'how-it-works',
      label: 'How It Works',
      href: '/how-it-works',
      visible: true,
    };
    const aboutIndex = cmsNavigation.findIndex((item) => item.href === '/about');
    cmsNavigation.splice(aboutIndex >= 0 ? aboutIndex + 1 : 0, 0, howItWorksLink);
  }
  const mobileLinks = cmsNavigation
    ? [
        ...cmsNavigation,
        ...(cmsNavigation.some((item) => item.href === '/services') ? serviceLinks.map((item) => ({
          id: item.href,
          label: item.label,
          href: item.href,
          visible: true,
        })) : []),
      ]
    : [...mainLinks, ...serviceLinks];

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <nav
        className="site-nav container-premium"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-3 text-white"
          onClick={closeMenu}
          aria-label="TruckAxic home"
        >
          <span className="site-brand-icon">
            <Truck size={21} strokeWidth={1.9} aria-hidden="true" />
          </span>
          <span className="site-brand-name">
            {cmsSettings?.footer.brandName || 'TruckAxic'}<span className="text-primary-red">.</span>
          </span>
        </Link>

        <div className="primary-nav">
          {cmsNavigation ? (
            cmsNavigation.map((item, index) =>
              item.href === '/services' ? (
                <div className="group relative" key={item.id}>
                  <CmsPublicLink
                    href={item.href}
                    className="primary-nav-link flex items-center gap-1.5"
                    onClick={closeMenu}
                    active={isActive(item.href)}
                  >
                    {item.label}
                    <ChevronDown size={15} className="transition-transform group-hover:rotate-180" />
                  </CmsPublicLink>
                  <div className="services-dropdown">
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                        className="services-dropdown-link"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <CmsPublicLink
                  key={item.id}
                  href={item.href}
                  onClick={closeMenu}
                  active={isActive(item.href)}
                  className={
                    index === cmsNavigation.length - 1 ||
                    item.href === '/contact' ||
                    item.href === '/carrier-signup'
                      ? 'btn-primary nav-cta'
                      : 'primary-nav-link'
                  }
                >
                  {item.label}
                  {(index === cmsNavigation.length - 1 ||
                    item.href === '/contact' ||
                    item.href === '/carrier-signup') && <ArrowRight size={16} />}
                </CmsPublicLink>
              ),
            )
          ) : (
            <>
              {mainLinks
                .filter((link) => link.href !== '/services' && link.href !== '/faq')
                .map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className="primary-nav-link"
                  >
                    {link.label}
                  </Link>
                ))}
              <div className="group relative">
                <Link
                  to="/services"
                  aria-current={isActive('/services') ? 'page' : undefined}
                  className="primary-nav-link flex items-center gap-1.5"
                >
                  Services
                  <ChevronDown size={15} className="transition-transform group-hover:rotate-180" />
                </Link>
                <div className="services-dropdown">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className="services-dropdown-link"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/faq"
                aria-current={isActive('/faq') ? 'page' : undefined}
                className="primary-nav-link"
              >
                FAQ
              </Link>
              <Link to="/contact" className="btn-primary nav-cta">
                Talk to dispatch <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-nav-panel"
          >
            <div className="container-premium mobile-nav-content">
              {mobileLinks.map((link) => (
                <CmsPublicLink
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={closeMenu}
                  active={isActive(link.href)}
                >
                  {link.label}
                </CmsPublicLink>
              ))}
              {!cmsNavigation && (
                <div className="mobile-nav-actions">
                  <Link to="/carrier-signup" className="btn-secondary" onClick={closeMenu}>
                    Carrier signup
                  </Link>
                  <Link to="/contact" className="btn-primary" onClick={closeMenu}>
                    Contact us <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
