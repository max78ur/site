import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock3, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import type { CmsPublishedSettings } from '@/lib/cms/types';
import { CmsPublicLink } from '@/components/cms/CmsPublicLink';

const howItWorksCompanyLink = { label: 'How It Works', href: '/how-it-works' };

const companyLinks = [
  { label: 'About TruckAxic', href: '/about' },
  howItWorksCompanyLink,
  { label: 'Carrier signup', href: '/carrier-signup' },
  { label: 'Frequently asked questions', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const defaultLegalLinks = [
  { id: 'privacy-policy', label: 'Privacy Policy', href: '/privacy-policy' },
  { id: 'terms', label: 'Terms & Conditions', href: '/terms' },
  { id: 'cookie-policy', label: 'Cookie Policy', href: '/cookie-policy' },
  { id: 'disclaimer', label: 'Disclaimer', href: '/disclaimer' },
  { id: 'service-agreement', label: 'Service Agreement', href: '/service-agreement' },
  {
    id: 'refund-cancellation-policy',
    label: 'Refund & Cancellation Policy',
    href: '/refund-cancellation-policy',
  },
  {
    id: 'accessibility-statement',
    label: 'Accessibility Statement',
    href: '/accessibility-statement',
  },
  { id: 'data-security', label: 'Data Security', href: '/data-security' },
  {
    id: 'report-security-issue',
    label: 'Report a Security Issue',
    href: '/report-security-issue',
  },
];

const legalPaths = new Set(defaultLegalLinks.map((link) => link.href));

const serviceLinks = [
  { label: 'Dry Van', href: '/services/dry-van' },
  { label: 'Reefer', href: '/services/reefer' },
  { label: 'Flatbed', href: '/services/flatbed' },
  { label: 'Power Only', href: '/services/power-only' },
];

export default function Footer({
  cmsSettings = null,
}: {
  cmsSettings?: CmsPublishedSettings | null;
}) {
  const cmsLinks = cmsSettings?.footer.links;
  const configuredCompanyLinks = cmsLinks?.filter(
    (link) => !link.href.startsWith('/services/') && !legalPaths.has(link.href),
  );
  const currentCompanyLinks = configuredCompanyLinks
    ? [
        ...configuredCompanyLinks,
        ...(configuredCompanyLinks.some((link) => link.href === '/how-it-works')
          ? []
          : [howItWorksCompanyLink]),
      ]
    : companyLinks;
  const currentServiceLinks = cmsLinks
    ? cmsLinks.filter((link) => link.href.startsWith('/services/'))
    : serviceLinks;
  const configuredLegalLinks = cmsLinks?.filter((link) => legalPaths.has(link.href)) ?? [];
  const legalLinks = cmsLinks
    ? [
        ...configuredLegalLinks,
        ...defaultLegalLinks.filter(
          (defaultLink) =>
            !configuredLegalLinks.some((link) => link.href === defaultLink.href),
        ),
      ]
    : defaultLegalLinks;
  const brandName = cmsSettings?.footer.brandName || 'TruckAxic';
  const description =
    cmsSettings?.footer.description ||
    'Premium US truck dispatch and logistics services. Moving America forward, one load at a time.';
  const contact = cmsSettings?.contact;
  const address =
    contact?.address && contact.address !== '123 Logistics Way, Houston, TX 77002'
      ? contact.address
      : '[Add verified business address]';
  const phone =
    contact?.phone && contact.phone !== '+1 (800) 555-0199'
      ? contact.phone
      : '[Add verified business phone]';
  const email =
    contact?.email && contact.email !== 'support@truckaxic.com'
      ? contact.email
      : '[Add verified business email]';
  const supportHours =
    contact?.supportHours && contact.supportHours !== 'Open 24/7 / 365 Days'
      ? contact.supportHours
      : '[Add verified support hours]';
  const contactPhoneHref =
    phone && !phone.startsWith('[')
      ? phone.replace(/[^\d+]/g, '')
      : null;

  return (
    <footer className="site-footer bg-[#08090b] text-white">
      <div className="footer-cta">
        <Container>
          <div className="footer-cta-inner">
            <div>
              <span className="eyebrow">Ready for your next load?</span>
              <h2>
                Let’s keep your business moving.
              </h2>
            </div>
            <Link to="/carrier-signup" className="btn-primary shrink-0">
              Become a carrier <ArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-link">
              <span className="site-brand-icon">
                <Truck size={21} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="site-brand-name">
                {brandName}<span className="text-primary-red">.</span>
              </span>
            </Link>
            <p className="footer-brand-description">{description}</p>
            <div className="footer-socials">
              <a
                href="https://linkedin.com/company/truckaxic"
                aria-label="TruckAxic on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <span className="text-xs font-extrabold">in</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://twitter.com/truckaxic"
                aria-label="TruckAxic on Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <span className="text-xs font-extrabold">X</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://instagram.com/truckaxic"
                aria-label="TruckAxic on Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <span className="text-[10px] font-extrabold">IG</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-column-title">
              Company
            </h3>
            <ul className="footer-links">
              {currentCompanyLinks.map((link) => (
                <li key={link.href}>
                  <CmsPublicLink
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </CmsPublicLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-column-title">
              Dispatch services
            </h3>
            <ul className="footer-links">
              {currentServiceLinks.map((link) => (
                <li key={link.href}>
                  <CmsPublicLink
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </CmsPublicLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-column-title">
              Reach our team
            </h3>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={17} />
                <span>{address}</span>
              </li>
              <li>
                <Phone size={17} />
                {contactPhoneHref ? (
                  <a href={`tel:${contactPhoneHref}`}>{phone}</a>
                ) : (
                  <span>{phone}</span>
                )}
              </li>
              <li>
                <Mail size={17} />
                {!email.startsWith('[') ? (
                  <a href={`mailto:${email}`}>{email}</a>
                ) : (
                  <span>{email}</span>
                )}
              </li>
              <li>
                <Clock3 size={17} />
                <span>{supportHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <span>
            © {new Date().getFullYear()} {brandName}.
          </span>
          <div>
            {legalLinks.map((link) => (
              <CmsPublicLink key={link.href} href={link.href}>
                {link.label}
              </CmsPublicLink>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
