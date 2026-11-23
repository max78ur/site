import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import type { Service } from '@/data/services';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/layout/Container';

interface ServiceDetailPageProps {
  service: Service;
  icon: ReactNode;
  headline: string;
  paragraphs: string[];
  features: string[];
  equipment: string;
}

export function ServiceDetailPage({
  service,
  icon,
  headline,
  paragraphs,
  features,
  equipment,
}: ServiceDetailPageProps) {
  return (
    <div>
      <PageHero
        eyebrow={service.subtitle}
        title={service.title}
        description={service.description}
        image={service.image}
        action={{ label: 'Talk to dispatch', to: '/contact' }}
      />

      <section className="section bg-white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <div>
              <span className="eyebrow !text-truckaxic-red">Dispatch, done right</span>
              <h2 className="mb-6">{headline}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-5 text-base leading-8 text-gray-600">
                  {paragraph}
                </p>
              ))}
              <ul className="mt-8 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-truckaxic-red">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative min-h-[25rem] overflow-hidden rounded-2xl bg-[#111316] md:min-h-[32rem]">
              <img
                src={service.image}
                alt={service.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-red text-white">
                  {icon}
                </div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                  Equipment
                </p>
                <h3 className="text-2xl font-bold text-white">{equipment}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/70">
                  Nationwide dispatch coordination, rate negotiation, and
                  around-the-clock support for your operation.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-xl border border-gray-200 md:grid-cols-3">
            {[
              { label: 'Equipment', value: equipment },
              { label: 'Coverage', value: 'All 48 States' },
              { label: 'Support', value: '24/7 Dispatch' },
            ].map((fact) => (
              <div
                key={fact.label}
                className="border-b border-gray-200 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {fact.label}
                </p>
                <p className="font-bold text-gray-900">{fact.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#0d0e10] py-12 text-white md:py-16">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Move with confidence</span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Your next load starts here.
            </h2>
          </div>
          <Link to="/carrier-signup" className="btn-primary shrink-0">
            Apply to become a carrier <ArrowRight size={18} />
          </Link>
        </Container>
      </section>
    </div>
  );
}
