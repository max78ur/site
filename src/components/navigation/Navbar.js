import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/components/ui/cn';
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
];
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const scrollY = useScroll({ offset: ['start 0', 'start 200'] }).scrollY;
    const opacity = useTransform(scrollY, [0, 100], [1, 0.9]);
    const blur = useTransform(scrollY, [0, 100], [0, 10]);
    const bgSpring = useSpring(opacity, { damping: 25, stiffness: 300 });
    const blurSpring = useSpring(blur, { damping: 25, stiffness: 300 });
    const borderOpacity = useTransform(opacity, [0, 1], [0, 0.1]);
    const isActive = (href) => location.pathname === href ||
        (href !== '/' && location.pathname.startsWith(href));
    return (<nav className="fixed top-0 w-full z-50 transition-colors duration-300" style={{
            background: `rgba(255, 255, 255, ${bgSpring})`,
            backdropFilter: `blur(${blurSpring}px)`,
            borderBottom: `1px solid rgba(0,0,0,${borderOpacity})`,
        }}>
      <div className="container-premium">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded bg-truckaxic-red flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21 12V7a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4h13a4 4 0 0 0 4-4Z"/>
                <path d="M9 20h6"/>
                <path d="M12 18V20"/>
              </svg>
            </div>
            <span>TruckAxic</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (<Link key={link.label} to={link.href} className={cn('text-sm font-medium transition-colors hover:text-truckaxic-red', isActive(link.href)
                ? 'text-truckaxic-red'
                : 'text-gray-700')} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>))}
            <Link to="/contact" className="btn-secondary hidden sm:flex" onClick={() => setIsOpen(false)}>
              Contact Us <ArrowRight size={18} className="ml-2"/>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-ghost hidden sm:flex" onClick={() => setIsOpen(false)} onMouseEnter={() => setIsOpen(false)}>
              Get Started <ArrowRight size={18} className="ml-2"/>
            </button>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700" onClick={() => setIsOpen((prev) => !prev)}>
              {isOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>

        {isOpen && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 w-full bg-white border-t border-gray-100 py-6 md:hidden z-50 shadow-premium">
            <div className="flex flex-col gap-2 px-6 pb-6">
              {navLinks.map((link) => (<Link key={link.label} to={link.href} className={cn('block px-4 py-3 text-sm font-medium rounded-xl transition-colors', isActive(link.href)
                    ? 'bg-red-50 text-truckaxic-red'
                    : 'text-gray-700 hover:bg-gray-50')} onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>))}
              <div className="pt-4 border-t border-gray-100">
                <Link to="/contact" className="btn-primary w-full" onClick={() => setIsOpen(false)}>
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>)}
      </div>
    </nav>);
}
