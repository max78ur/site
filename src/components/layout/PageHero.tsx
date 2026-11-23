import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PageHeroProps {
  title: string;
  description?: string;
  image: string;
  eyebrow?: string;
  action?: {
    label: string;
    to: string;
  };
}

export function PageHero({
  title,
  description,
  image,
  eyebrow = 'TruckAxic Logistics',
  action,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <img src={image} alt="" aria-hidden="true" fetchPriority="high" />
      <div className="page-hero-content">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {action && (
          <Link to={action.to} className="btn-primary mt-8">
            {action.label}
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}
