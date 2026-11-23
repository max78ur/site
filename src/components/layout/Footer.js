import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Link as ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Dry Van', href: '/services/dry-van' },
    { label: 'Reefer', href: '/services/reefer' },
    { label: 'Flatbed', href: '/services/flatbed' },
    { label: 'Power Only', href: '/services/power-only' },
    { label: 'Carrier Signup', href: '/carrier-signup' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms' },
];
const contactInfo = [
    { icon: <MapPin size={20}/>, label: '123 Logistics Way, Houston, TX 77002' },
    { icon: <Phone size={20}/>, label: '+1 (800) 555-0199' },
    { icon: <Mail size={20}/>, label: 'support@truckaxic.com' },
    { icon: <Clock size={20}/>, label: 'Open 24/7 / 365 Days' },
];
export default function Footer() {
    return (<footer className="bg-black text-white border-t border-white/10">
      <div className="bg-black/80 backdrop-blur border-y border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 lg:py-24">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-truckaxic-red flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M21 12V7a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4h13a4 4 0 0 0 4-4Z"/>
                    <path d="M9 20h6"/>
                    <path d="M12 18V20"/>
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tighter">TruckAxic</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Premium US truck dispatch and logistics services. Moving America
                forward, one load at a time.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://linkedin.com/company/truckaxic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={20}/>
                </a>
                <a href="https://twitter.com/truckaxic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={20}/>
                </a>
                <a href="https://instagram.com/truckaxic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={20}/>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {navLinks.slice(0, 4).map((link) => (<li key={link.label}>
                    <Link to={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Services</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {navLinks.slice(4, 8).map((link) => (<li key={link.label}>
                    <Link to={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4 text-sm">
                {contactInfo.map((item, i) => (<li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="text-truckaxic-red mt-0.5 shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </li>))}
              </ul>
              <p className="mt-6 text-xs text-gray-500">
                Â© {new Date().getFullYear()} TruckAxic Logistics Inc. All
                rights reserved.
              </p>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-black border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <span>TruckAxic Logistics Inc. USDOT Compliant</span>
            <div className="flex gap-6">
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>);
}
