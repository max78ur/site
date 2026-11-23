import type { ReactNode } from 'react';
import { Star } from 'lucide-react';
import type {
  CmsAction,
  CmsPageContent as CmsPageData,
  CmsPublishedSettings,
  CmsSection,
} from '@/lib/cms/types';
import { CmsPublicLink } from './CmsPublicLink';
import { usePublishedPageMedia } from './usePublishedPageMedia';
import { Container } from '@/components/layout/Container';
import Hero from '@/components/hero/Hero';
import FAQ from '@/components/sections/FAQ';
import ContactSection from '@/components/sections/Contact';

export default function CmsPageContent({
  page,
  cmsSettings,
  homeFallbacks = false,
  formSlot,
}: {
  page: CmsPageData;
  cmsSettings: CmsPublishedSettings | null;
  homeFallbacks?: boolean;
  formSlot?: ReactNode;
}) {
  const mediaUrls = usePublishedPageMedia(page);
  const enabledSections = page.sections.filter((section) => section.enabled);
  const hasHeroSection = page.sections.some((section) => section.type === 'hero');
  const hasContactSection = page.sections.some(
    (section) => section.type === 'contact',
  );
  const formIntroId = enabledSections.find(
    (section) => section.type === 'form-intro',
  )?.id;

  return (
    <div className={homeFallbacks ? 'cms-home-content' : 'cms-public-page-content'}>
      {homeFallbacks && !hasHeroSection && <Hero mediaUrls={mediaUrls} />}
      {enabledSections.map((section, index) => (
        <CmsPageSection
          key={section.id}
          section={section}
          index={index}
          mediaUrls={mediaUrls}
          cmsSettings={cmsSettings}
          homeFallbacks={homeFallbacks}
          formSlot={section.id === formIntroId ? formSlot : undefined}
          hasFormSlot={formSlot !== undefined && formSlot !== null}
        />
      ))}
      {homeFallbacks && !hasContactSection && (
        <ContactSection siteContact={cmsSettings?.contact} />
      )}
      {formSlot && !formIntroId && (
        <section className="section cms-content-section cms-form-section">
          <Container>{formSlot}</Container>
        </section>
      )}
    </div>
  );
}

function CmsPageSection({
  section,
  index,
  mediaUrls,
  cmsSettings,
  homeFallbacks,
  formSlot,
  hasFormSlot,
}: {
  section: CmsSection;
  index: number;
  mediaUrls: Record<string, string>;
  cmsSettings: CmsPublishedSettings | null;
  homeFallbacks: boolean;
  formSlot?: ReactNode;
  hasFormSlot: boolean;
}) {
  if (section.type === 'hero') {
    return (
      <Hero
        cmsSection={section}
        mediaUrls={mediaUrls}
        showScrollLink={homeFallbacks}
      />
    );
  }
  if (section.type === 'faq') {
    return <FAQ cmsSection={section} />;
  }
  if (section.type === 'contact') {
    return (
      <ContactSection
        cmsSection={section}
        siteContact={cmsSettings?.contact}
        showForm={!hasFormSlot}
      />
    );
  }

  return (
    <section
      className={`section cms-content-section${index % 2 === 1 ? ' is-alternate' : ''}`}
      style={
        cmsSettings
          ? {
              backgroundColor:
                index % 2 === 1
                  ? cmsSettings.theme.backgrounds.alternate
                  : cmsSettings.theme.backgrounds.page,
            }
          : undefined
      }
    >
      <Container>
        {'eyebrow' in section && section.eyebrow && (
          <span className="section-kicker">{section.eyebrow}</span>
        )}
        {'title' in section && <h2 className="section-title">{section.title}</h2>}
        {'description' in section && section.description && (
          <p className="section-lede cms-content-lede">{section.description}</p>
        )}

        {section.type === 'copy' && (
          <div className="cms-copy-grid">
            <div className="cms-copy-paragraphs">
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${paragraphIndex}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
            {section.image && mediaUrls[section.image.storagePath] && (
              <img
                className="cms-content-image"
                src={mediaUrls[section.image.storagePath]}
                alt={section.image.altText}
                loading="lazy"
              />
            )}
          </div>
        )}

        {section.type === 'cards' && (
          <div className="cms-content-grid">
            {section.cards.map((card, cardIndex) => (
              <article className="cms-content-card" key={card.id}>
                {card.image && mediaUrls[card.image.storagePath] && (
                  <img
                    className="cms-content-card-image"
                    src={mediaUrls[card.image.storagePath]}
                    alt={card.image.altText}
                    loading="lazy"
                  />
                )}
                {card.subtitle && <p className="cms-content-card-subtitle">{card.subtitle}</p>}
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {card.features && card.features.length > 0 && (
                  <ul>
                    {card.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                )}
                {card.href && (
                  <CmsPublicLink href={card.href} className="cms-content-link">
                    Explore <span aria-hidden="true">→</span>
                  </CmsPublicLink>
                )}
                <span className="cms-content-index">{String(cardIndex + 1).padStart(2, '0')}</span>
              </article>
            ))}
          </div>
        )}

        {section.type === 'steps' && (
          <div className="cms-content-grid cms-content-steps">
            {section.steps.map((step, stepIndex) => (
              <article className="cms-content-card" key={step.id}>
                <span className="cms-content-index">{String(stepIndex + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        )}

        {section.type === 'statistics' && (
          <div className="cms-statistics-grid">
            {section.statistics.map((statistic) => (
              <div className="cms-statistic" key={statistic.id}>
                <strong>{statistic.value}</strong>
                <span>{statistic.label}</span>
              </div>
            ))}
          </div>
        )}

        {section.type === 'testimonials' && (
          <div className="cms-content-grid cms-testimonials-grid">
            {section.testimonials.map((testimonial) => (
              <blockquote className="cms-content-card" key={testimonial.id}>
                <div className="cms-rating" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={15}
                      aria-hidden="true"
                      fill={starIndex < testimonial.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p>“{testimonial.quote}”</p>
                <footer>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}{testimonial.location ? ` · ${testimonial.location}` : ''}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        )}

        {section.type === 'call-to-action' && (
          <CmsActions actions={section.actions} />
        )}

        {section.type === 'form-intro' && formSlot}

        {section.type === 'legal' && (
          <div className="cms-legal-content">
            {section.blocks.map((block) => (
              <div key={block.id}>
                <h3>{block.heading}</h3>
                {block.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${paragraphIndex}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function CmsActions({ actions }: { actions: CmsAction[] }) {
  return (
    <div className="cms-content-actions">
      {actions.map((action, index) => (
        <CmsPublicLink
          key={`${action.href}-${index}`}
          href={action.href}
          className={
            action.style === 'primary'
              ? 'btn-primary'
              : action.style === 'secondary'
                ? 'btn-secondary'
                : 'cms-content-link'
          }
        >
          {action.label}
        </CmsPublicLink>
      ))}
    </div>
  );
}

