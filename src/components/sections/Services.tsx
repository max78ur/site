import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Snowflake, Truck, Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { services } from '@/data/services';

const icons: Record<string, React.ReactNode> = {
  'dry-van': <Package size={32} className="text-truckaxic-red" />,
  reefer: <Snowflake size={32} className="text-truckaxic-red" />,
  flatbed: <Truck size={32} className="text-truckaxic-red" />,
  'power-only': <Zap size={32} className="text-truckaxic-red" />,
};

export default function ServicesSection() {
  return (
    <section className="section services-section">
      <Container>
        <div className="section-heading services-heading">
          <div>
            <span className="section-kicker">02 / Our capabilities</span>
            <h2 className="section-title">
              Dispatch for every mile of the journey.
            </h2>
          </div>
          <p className="section-lede">
            We handle every aspect of your dispatch operation — from sourcing
            loads to negotiating rates and managing broker communication.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="service-card group"
            >
              <div className="service-card-image">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  loading="lazy"
                />
                <span className="service-card-number">0{index + 1}</span>
                <span className="service-card-subtitle">
                  {service.subtitle}
                </span>
              </div>
              <div className="service-card-body">
                <div className="service-card-icon">
                  {icons[service.id]}
                </div>
                <h3>{service.title}</h3>
                <p className="service-card-description">
                  {service.description}
                </p>
                <ul className="service-card-features">
                  {service.features.slice(0, 3).map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={service.route}
                  className="service-card-link"
                >
                  Explore service <ArrowRight size={17} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
