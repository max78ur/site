import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, Mail } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import type { CmsFaqSection } from '@/lib/cms/types';

const faqs = [
  {
    q: 'What types of freight do you dispatch?',
    a:
      'We dispatch dry van, refrigerated (reefer), flatbed, and power-only loads across all 48 states. Whether you haul general freight, temperature-sensitive goods, or oversized equipment, we have you covered.',
  },
  {
    q: 'How does TruckAxic find loads for my truck?',
    a:
      'Our dispatch team works directly with brokers and shippers to source the best-paying loads for your equipment type and preferred lanes. We handle booking, rate confirmation, and paperwork.',
  },
  {
    q: 'Do you negotiate rates on my behalf?',
    a:
      'Yes. Rate negotiation is a core part of our service. Our experienced dispatchers negotiate aggressively to maximize your revenue per loaded mile.',
  },
  {
    q: 'Is there 24/7 support?',
    a:
      'Absolutely. Our dispatch desk is staffed around the clock, 365 days a year, to help with breakdowns, detentions, reroutes, and check calls.',
  },
  {
    q: 'Do I need my own authority to join?',
    a:
      'Yes, carriers must have their own active MC authority and insurance. We help with compliance questions but require valid operating authority to dispatch loads.',
  },
  {
    q: 'How do I get started?',
    a:
      'Fill out our carrier signup form or contact us directly. A dispatch specialist will review your equipment and get you moving with your first load.',
  },
];

export default function FAQ({
  cmsSection,
}: {
  cmsSection?: CmsFaqSection;
} = {}) {
  const [open, setOpen] = useState<number | null>(0);
  const questions = cmsSection
    ? cmsSection.questions.map((item) => ({ q: item.question, a: item.answer }))
    : faqs;

  return (
    <section className="section faq-section">
      <Container>
        <div className="faq-layout">
          <div className="faq-intro">
            <span className="section-kicker">{cmsSection?.eyebrow || '08 / Frequently asked'}</span>
            <h2 className="section-title">{cmsSection?.title || 'Questions & Answers'}</h2>
            <p className="section-lede">
              {cmsSection?.description || 'Everything you need to know about dispatching with TruckAxic.'}
            </p>
            <div className="faq-contact">
              <span>Need a direct answer?</span>
              <a href="tel:+18005550199">
                <Phone size={17} />
                +1 (800) 555-0199
              </a>
              <a href="mailto:support@truckaxic.com">
                <Mail size={17} />
                support@truckaxic.com
              </a>
              <LinkButton to="/contact">Contact Us</LinkButton>
            </div>
          </div>

          <div className="faq-list">
            {questions.map((item, i) => {
              const answerId = `homepage-faq-answer-${i}`;
              const isOpen = open === i;

              return (
                <motion.article
                  key={item.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  className={`faq-item${isOpen ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? answerId : undefined}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="faq-question"
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="faq-answer"
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function LinkButton({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="btn-primary">{children}</Link>
  );
}
