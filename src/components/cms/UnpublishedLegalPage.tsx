import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/layout/PageHero';

const LEGAL_PAGE_IMAGE =
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2200&q=85';

export default function UnpublishedLegalPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <PageHero
        eyebrow="TruckAxic"
        title={title}
        description="This page is in preparation and is not an effective policy or agreement."
        image={LEGAL_PAGE_IMAGE}
      />
      <section className="section bg-white">
        <Container className="max-w-3xl">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-red">
              Not yet published
            </p>
            <h2 className="text-3xl font-bold text-gray-950">{title}</h2>
            <p className="leading-relaxed text-gray-600">{description}</p>
            <p className="leading-relaxed text-gray-600">
              Attorney review required: any legal content prepared for this page
              remains a draft until reviewed by qualified U.S. counsel and
              explicitly published.
            </p>
            <p className="leading-relaxed text-gray-600">
              No legal terms are provided on this page. Contact TruckAxic if you
              need information before a reviewed version is published.
            </p>
            <Link to="/contact" className="btn-primary inline-flex">
              Contact us <ArrowRight size={17} />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
