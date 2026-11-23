import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { testimonials } from '@/data/testimonials';

export default function Testimonials() {
  return (
    <section className="section testimonials-section">
      <Container>
        <div className="section-heading testimonials-heading">
          <div>
            <span className="section-kicker">07 / Carrier stories</span>
            <h2 className="section-title">Trusted by Carriers Nationwide</h2>
          </div>
          <p className="section-lede">
            Hear from owner-operators and fleet owners who dispatch with
            TruckAxic.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`testimonial-card${index === 0 ? ' testimonial-feature' : ''}`}
            >
              <div className="testimonial-stars" aria-label={`${t.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    aria-hidden="true"
                    className={i <= t.rating ? 'is-filled' : ''}
                  />
                ))}
              </div>
              <blockquote>{t.content}</blockquote>
              <div className="testimonial-author">
                <span aria-hidden="true">
                  {t.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">
                    {t.title} — {t.location}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
