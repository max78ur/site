import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Globe, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';

const features = [
  {
    icon: <Truck size={32} className="text-truckaxic-red" />,
    title: 'Nationwide Coverage',
    desc: 'We operate across all 48 contiguous states, keeping your fleet moving coast to coast.',
  },
  {
    icon: <ShieldCheck size={32} className="text-truckaxic-red" />,
    title: 'Fully Compliant',
    text: 'FMCSA registered and USDOT compliant. Your authority is in safe hands.',
    desc: 'FMCSA registered and USDOT compliant. Your authority is in safe hands.',
  },
  {
    icon: <Globe size={32} className="text-truckaxic-red" />,
    title: '24/7 Support',
    desc: "Round-the-clock dispatch support so you're never alone on the road.",
  },
  {
    icon: <Headset size={32} className="text-truckaxic-red" />,
    title: 'Dedicated Dispatcher',
    desc: 'A single point of contact who knows your operation and your goals.',
  },
];

export default function CompanyIntro() {
  return (
    <section className="section company-section">
      <Container>
        <div className="company-layout">
          <motion.div
            className="company-copy"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-kicker">01 / About TruckAxic</span>
            <h2 className="section-title">Built for American Carriers</h2>
            <p>
              TruckAxic was founded on a simple idea: dispatching should make
              carriers more money, not less. We combine industry-leading rate
              negotiation with hands-on load booking so owner-operators and
              fleet owners can focus on driving while we handle the rest.
            </p>
            <p>
              From our base in Houston, Texas, we coordinate freight movement
              across the entire United States. Whether you run one truck or a
              hundred, our dispatch team treats your business like our own.
            </p>
            <Link to="/about" className="btn-ghost">
              Learn more about us
            </Link>
          </motion.div>

          <motion.div
            className="company-features"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {features.map((feature, index) => (
              <article key={feature.title} className="company-feature">
                <span className="company-feature-number">
                  0{index + 1}
                </span>
                <div className="company-feature-icon">
                  {feature.icon}
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>
                  {feature.desc}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
