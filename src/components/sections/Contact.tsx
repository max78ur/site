import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Link } from 'react-router-dom';
import type { CmsContactSection, CmsSettingsContent } from '@/lib/cms/types';
import { CmsPublicLink } from '@/components/cms/CmsPublicLink';

export default function ContactSection({
  cmsSection,
  siteContact,
  showForm = true,
}: {
  cmsSection?: CmsContactSection;
  siteContact?: CmsSettingsContent['contact'];
  showForm?: boolean;
} = {}) {
  const details = cmsSection?.details ?? [
    {
      id: 'address',
      label: 'Visit Us',
      value: siteContact?.address || '123 Logistics Way, Houston, TX 77002',
    },
    {
      id: 'phone',
      label: 'Call Us',
      value: siteContact?.phone || '+1 (800) 555-0199',
      href: `tel:${(siteContact?.phone || '+1 (800) 555-0199').replace(/[^\d+]/g, '')}`,
    },
    {
      id: 'email',
      label: 'Email Us',
      value: siteContact?.email || 'support@truckaxic.com',
      href: `mailto:${siteContact?.email || 'support@truckaxic.com'}`,
    },
  ];

  return (
    <section className="section contact-section">
      <Container>
        <div className="section-heading contact-heading">
          <span className="section-kicker">{cmsSection?.eyebrow || '09 / Get in touch'}</span>
          <h2 className="section-title">{cmsSection?.title || 'Ready to Move Freight?'}</h2>
          <p className="section-lede">
            {cmsSection?.description ||
              'Whether you are a carrier looking for dispatch or a shipper with freight to move, we would love to hear from you.'}
          </p>
        </div>
        <div className={`contact-layout${showForm ? '' : ' contact-details-only'}`}>
          <aside className="contact-details">
            <span className="contact-details-label">{cmsSection ? 'Contact details' : 'Talk to our team'}</span>
            {details.map((detail) => {
              const Icon = detail.href?.startsWith('tel:')
                ? Phone
                : detail.href?.startsWith('mailto:')
                  ? Mail
                  : MapPin;
              const content = (
                <>
                  <span><Icon size={19} /></span>
                  <div>
                    <h3>{detail.label}</h3>
                    <p>{detail.value}</p>
                  </div>
                </>
              );
              return detail.href ? (
                <CmsPublicLink key={detail.id} href={detail.href} className="contact-detail">
                  {content}
                </CmsPublicLink>
              ) : (
                <div key={detail.id} className="contact-detail">{content}</div>
              );
            })}
            <Link to="/carrier-signup" className="contact-carrier-link">
              Carrier looking for dispatch? Get started
              <ArrowRight size={17} />
            </Link>
          </aside>

          {showForm && <ContactFormPanel />}
        </div>
      </Container>
    </section>
  );
}

export function ContactFormPanel() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | null>(
    null,
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setStatus('success');
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="contact-form-panel"
    >
      <div className="contact-form-heading">
        <h3>Send a message</h3>
        <p>Tell us a little about what you need.</p>
      </div>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all"
              placeholder="john@trucking.com"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company / Carrier Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all"
              placeholder="ABC Trucking LLC"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How can we help?
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-truckaxic-red focus:border-transparent outline-none transition-all"
            placeholder="Tell us about your dispatch needs..."
          />
        </div>
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            required
            className="w-4 h-4 rounded border-gray-200 text-truckaxic-red focus:ring-truckaxic-red"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
            I agree to the{' '}
            <a href="/terms" className="text-truckaxic-red hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-truckaxic-red hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={status === 'success'}
        >
          {status === 'success' ? 'Message Sent!' : 'Send Message'}
          <ArrowRight size={18} className="ml-2" />
        </button>
      </form>
      {status === 'success' && (
        <div className="mt-4 p-4 rounded-xl bg-green-50 text-green-800 text-sm flex items-center gap-3">
          <span>✓</span>
          <span>
            Your message has been sent. This is a frontend demo — backend
            submission is not yet connected.
          </span>
        </div>
      )}
    </motion.div>
  );
}

