import { createEmptyCmsPage } from './cmsEditorUtils';
import type {
  CmsAction,
  CmsPageContent,
  CmsPageId,
  CmsSection,
} from '@/lib/cms/types';

const CANONICAL_PATHS: Record<CmsPageId, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  'how-it-works': '/how-it-works',
  'service-dry-van': '/services/dry-van',
  'service-reefer': '/services/reefer',
  'service-flatbed': '/services/flatbed',
  'service-power-only': '/services/power-only',
  faq: '/faq',
  contact: '/contact',
  'carrier-signup': '/carrier-signup',
  'privacy-policy': '/privacy-policy',
  terms: '/terms',
  'cookie-policy': '/cookie-policy',
  disclaimer: '/disclaimer',
  'service-agreement': '/service-agreement',
  'refund-cancellation-policy': '/refund-cancellation-policy',
  'accessibility-statement': '/accessibility-statement',
  'data-security': '/data-security',
  'report-security-issue': '/report-security-issue',
};

function makePage(
  pageId: CmsPageId,
  title: string,
  description: string,
  sections: CmsSection[],
): CmsPageContent {
  return {
    schemaVersion: 1,
    pageId,
    seo: {
      title,
      description,
      canonicalPath: CANONICAL_PATHS[pageId],
    },
    sections,
  };
}

function hero(
  id: string,
  eyebrow: string,
  title: string,
  description: string,
  actions: CmsAction[] = [],
): CmsSection {
  return {
    id,
    type: 'hero',
    enabled: true,
    eyebrow,
    title,
    description,
    actions,
  };
}

function cards(
  id: string,
  title: string,
  description: string,
  items: Array<{
    id: string;
    title: string;
    description: string;
    href?: string;
    features?: string[];
  }>,
): CmsSection {
  return {
    id,
    type: 'cards',
    enabled: true,
    title,
    description,
    cards: items,
  };
}

function callToAction(
  id: string,
  title: string,
  description: string,
  actions: Array<{
    label: string;
    href: string;
    style: 'primary' | 'secondary' | 'text';
  }>,
): CmsSection {
  return {
    id,
    type: 'call-to-action',
    enabled: true,
    title,
    description,
    actions,
  };
}

function legalPage(pageId: CmsPageId): CmsPageContent {
  const template = createEmptyCmsPage(pageId);
  const legalSection = template.sections.find(
    (section) => section.type === 'legal',
  );
  if (!legalSection || legalSection.type !== 'legal') {
    throw new Error(`Missing attorney-review template for "${pageId}".`);
  }

  return {
    ...template,
    sections: [
      hero(
        'legal-page-hero',
        'Attorney review draft',
        legalSection.title,
        'Working draft only. Verify business details and obtain qualified U.S. attorney review before publication or use.',
        [{ label: 'Contact us', href: '/contact', style: 'secondary' }],
      ),
      ...template.sections,
    ],
  };
}

const existingFaqQuestions = [
  {
    id: 'freight-types',
    question: 'What types of freight do you dispatch?',
    answer:
      'We dispatch dry van, refrigerated (reefer), flatbed, and power-only loads across all 48 states. Whether you haul general freight, temperature-sensitive goods, or oversized equipment, we have you covered.',
  },
  {
    id: 'load-sourcing',
    question: 'How does TruckAxic find loads for my truck?',
    answer:
      'Our dispatch team works directly with brokers and shippers to source the best-paying loads for your equipment type and preferred lanes. We handle booking, rate confirmation, and paperwork.',
  },
  {
    id: 'rate-negotiation',
    question: 'Do you negotiate rates on my behalf?',
    answer:
      'Yes. Rate negotiation is a core part of our service. Our experienced dispatchers negotiate aggressively to maximize your revenue per loaded mile.',
  },
  {
    id: 'support-hours',
    question: 'Is there 24/7 support?',
    answer:
      'Absolutely. Our dispatch desk is staffed around the clock, 365 days a year, to help with breakdowns, detentions, reroutes, and check calls.',
  },
  {
    id: 'carrier-authority',
    question: 'Do I need my own authority to join?',
    answer:
      'Yes, carriers must have their own active MC authority and insurance. We help with compliance questions but require valid operating authority to dispatch loads.',
  },
  {
    id: 'getting-started',
    question: 'How do I get started?',
    answer:
      'Fill out our carrier signup form or contact us directly. A dispatch specialist will review your equipment and get you moving with your first load.',
  },
];

const faqDraft = makePage(
  'faq',
  'Frequently Asked Questions | TruckAxic',
  'Answers to common questions about TruckAxic dispatch services, supported equipment, and getting started.',
  [
    hero(
      'faq-hero',
      'Straight answers, no runaround',
      'Questions about dispatch?',
      'Find out how TruckAxic works, what equipment is listed on the site, and how to get started.',
      [{ label: 'Contact us', href: '/contact', style: 'secondary' }],
    ),
    {
      id: 'existing-faq',
      type: 'faq',
      enabled: true,
      title: 'TruckAxic Dispatch FAQs',
      questions: existingFaqQuestions,
    },
    callToAction(
      'faq-contact',
      'Still have questions?',
      'Contact the team to discuss your equipment and dispatch needs.',
      [
        { label: 'Contact us', href: '/contact', style: 'primary' },
        { label: 'Carrier signup', href: '/carrier-signup', style: 'secondary' },
      ],
    ),
  ],
);

function equipmentPage(
  pageId:
    | 'service-dry-van'
    | 'service-reefer'
    | 'service-flatbed'
    | 'service-power-only',
  seoTitle: string,
  pageTitle: string,
  heroTitle: string,
  heroDescription: string,
  overviewTitle: string,
  overviewParagraphs: string[],
  considerations: Array<{ id: string; title: string; description: string }>,
): CmsPageContent {
  return makePage(pageId, seoTitle, heroDescription, [
    hero(
      `${pageId}-hero`,
      'TruckAxic dispatch services',
      heroTitle,
      heroDescription,
      [
        { label: 'Discuss your operation', href: '/contact', style: 'primary' },
        { label: 'Carrier signup', href: '/carrier-signup', style: 'secondary' },
      ],
    ),
    {
      id: `${pageId}-overview`,
      type: 'copy',
      enabled: true,
      eyebrow: pageTitle,
      title: overviewTitle,
      paragraphs: overviewParagraphs,
    },
    cards(
      `${pageId}-considerations`,
      'Details to confirm before dispatch',
      'Load availability, rates, requirements, and responsibilities are confirmed for each specific shipment.',
      considerations,
    ),
    callToAction(
      `${pageId}-next-step`,
      'Talk through your equipment and lanes',
      'Share your operating preferences so the team can discuss whether the service is a fit.',
      [
        { label: 'Contact us', href: '/contact', style: 'primary' },
        { label: 'Apply to discuss dispatch', href: '/carrier-signup', style: 'secondary' },
      ],
    ),
  ]);
}

const preparedDrafts: Record<CmsPageId, CmsPageContent> = {
  home: makePage(
    'home',
    'TruckAxic | Truck Dispatch & Logistics',
    'Explore TruckAxic dispatch information, supported equipment, and resources for carriers.',
    [
      hero(
        'home-hero',
        'Dispatch support for carriers',
        'Move freight with a dispatch plan built around your operation.',
        'Tell TruckAxic about your equipment, preferred lanes, and priorities to discuss dispatch support.',
        [
          { label: 'Discuss dispatch', href: '/contact', style: 'primary' },
          { label: 'Explore services', href: '/services', style: 'secondary' },
        ],
      ),
      cards(
        'home-equipment',
        'Dispatch for your equipment',
        'Review the equipment categories covered on this website and contact the team to discuss your operation.',
        [
          {
            id: 'home-dry-van',
            title: 'Dry Van',
            description: 'Dispatch information for carriers hauling enclosed trailers and general freight.',
            href: '/services/dry-van',
          },
          {
            id: 'home-reefer',
            title: 'Refrigerated',
            description: 'Discuss temperature-controlled equipment and shipment requirements.',
            href: '/services/reefer',
          },
          {
            id: 'home-flatbed',
            title: 'Flatbed',
            description: 'Review dispatch considerations for open-deck and step-deck equipment.',
            href: '/services/flatbed',
          },
          {
            id: 'home-power-only',
            title: 'Power Only',
            description: 'Discuss tractor-only operations and the details of each trailer arrangement.',
            href: '/services/power-only',
          },
        ],
      ),
      {
        id: 'home-process',
        type: 'steps',
        enabled: true,
        title: 'A clear process, from the first conversation',
        description: 'Each load and service arrangement is discussed and confirmed before dispatch.',
        steps: [
          {
            id: 'home-step-equipment',
            title: 'Share your operation',
            description: 'Describe your equipment, preferred lanes, schedule, and priorities.',
          },
          {
            id: 'home-step-options',
            title: 'Review available options',
            description: 'Discuss load details, rate, timing, and responsibilities before making a decision.',
          },
          {
            id: 'home-step-confirm',
            title: 'Confirm the shipment',
            description: 'Proceed only after the relevant shipment terms are understood and confirmed.',
          },
          {
            id: 'home-step-coordinate',
            title: 'Coordinate updates',
            description: 'Agree how dispatch communications and shipment updates will be handled.',
          },
        ],
      },
      callToAction(
        'home-contact',
        'Start with a conversation',
        'Contact TruckAxic to discuss your equipment and dispatch needs.',
        [
          { label: 'Contact us', href: '/contact', style: 'primary' },
          { label: 'Carrier signup', href: '/carrier-signup', style: 'secondary' },
        ],
      ),
    ],
  ),
  about: makePage(
    'about',
    'About TruckAxic',
    'Learn about TruckAxic and its focus on carrier dispatch coordination and communication.',
    [
      hero(
        'about-hero',
        'About TruckAxic',
        'Dispatch support centered on the carrier.',
        'TruckAxic helps carriers discuss load coordination, equipment needs, and dispatch communication.',
        [
          { label: 'Explore services', href: '/services', style: 'primary' },
          { label: 'Contact us', href: '/contact', style: 'secondary' },
        ],
      ),
      {
        id: 'about-approach',
        type: 'copy',
        enabled: true,
        eyebrow: 'Our approach',
        title: 'Clear information. Informed decisions.',
        paragraphs: [
          'Every carrier has different equipment, lanes, schedules, and business priorities. TruckAxic’s dispatch conversations begin with those details rather than a one-size-fits-all promise.',
          'Before a shipment is accepted, carriers should review the load information, rate, timing, and responsibilities that apply to that specific shipment.',
          'Service availability, operating responsibilities, and commercial terms should be confirmed directly before work begins.',
        ],
      },
      cards(
        'about-principles',
        'What guides the conversation',
        'Practical considerations for a dispatch relationship.',
        [
          {
            id: 'about-equipment',
            title: 'Equipment fit',
            description: 'Discuss trailer type, capabilities, and the requirements of each shipment.',
          },
          {
            id: 'about-communication',
            title: 'Clear communication',
            description: 'Agree on points of contact, updates, documents, and issue escalation.',
          },
          {
            id: 'about-transparency',
            title: 'Informed decisions',
            description: 'Review shipment details and terms before deciding whether to proceed.',
          },
        ],
      ),
      callToAction(
        'about-next-step',
        'Tell us about your operation',
        'Contact the team to discuss your equipment and the dispatch support you are looking for.',
        [{ label: 'Contact TruckAxic', href: '/contact', style: 'primary' }],
      ),
    ],
  ),
  services: makePage(
    'services',
    'Truck Dispatch Services | TruckAxic',
    'Explore dispatch information for dry van, refrigerated, flatbed, and power-only equipment.',
    [
      hero(
        'services-hero',
        'TruckAxic dispatch services',
        'Dispatch options for different equipment and freight needs.',
        'Review equipment-specific information and discuss service availability, responsibilities, and terms with the team.',
        [
          { label: 'Talk to the team', href: '/contact', style: 'primary' },
          { label: 'Carrier signup', href: '/carrier-signup', style: 'secondary' },
        ],
      ),
      cards(
        'services-equipment',
        'Choose an equipment category',
        'Learn what details to consider for each equipment type.',
        [
          {
            id: 'services-dry-van',
            title: 'Dry Van',
            description: 'Enclosed-trailer freight and equipment details.',
            href: '/services/dry-van',
          },
          {
            id: 'services-reefer',
            title: 'Refrigerated / Reefer',
            description: 'Temperature-controlled equipment and shipment requirements.',
            href: '/services/reefer',
          },
          {
            id: 'services-flatbed',
            title: 'Flatbed',
            description: 'Open-deck equipment, securement, and route considerations.',
            href: '/services/flatbed',
          },
          {
            id: 'services-power-only',
            title: 'Power Only',
            description: 'Tractor-only arrangements and trailer responsibilities.',
            href: '/services/power-only',
          },
        ],
      ),
      cards(
        'services-coordination',
        'Dispatch coordination topics',
        'Confirm which tasks are included in a proposed service before work begins.',
        [
          {
            id: 'services-load-review',
            title: 'Load review',
            description: 'Discuss equipment fit, shipment details, schedule, and rate.',
          },
          {
            id: 'services-communications',
            title: 'Communication',
            description: 'Agree on broker or shipper contacts, check calls, and updates.',
          },
          {
            id: 'services-documents',
            title: 'Documents',
            description: 'Clarify required paperwork and who is responsible for each item.',
          },
          {
            id: 'services-issues',
            title: 'Issue coordination',
            description: 'Define how delays, changes, and other shipment issues should be raised.',
          },
        ],
      ),
      callToAction(
        'services-next-step',
        'Discuss the right fit for your operation',
        'Contact TruckAxic before relying on any assumed availability, rate, or service scope.',
        [{ label: 'Contact us', href: '/contact', style: 'primary' }],
      ),
    ],
  ),
  'how-it-works': makePage(
    'how-it-works',
    'How TruckAxic Dispatch Works',
    'Review the TruckAxic dispatch process, from sharing equipment details to coordinating shipment updates.',
    [
      hero(
        'how-it-works-hero',
        'A straightforward process',
        'Know the details before the truck moves.',
        'Discuss your operation, review shipment terms, and agree on responsibilities before dispatch.',
        [
          { label: 'Discuss your operation', href: '/contact', style: 'primary' },
          { label: 'Carrier signup', href: '/carrier-signup', style: 'secondary' },
        ],
      ),
      {
        id: 'how-it-works-steps',
        type: 'steps',
        enabled: true,
        title: 'From first conversation to shipment updates',
        description: 'The exact workflow and responsibilities should be confirmed for each carrier and load.',
        steps: [
          {
            id: 'process-equipment',
            title: 'Share your equipment and preferences',
            description: 'Discuss trailer type, capabilities, lanes, schedule, and priorities.',
          },
          {
            id: 'process-load',
            title: 'Review load options',
            description: 'Consider shipment requirements, pickup and delivery timing, and offered rate.',
          },
          {
            id: 'process-confirm',
            title: 'Confirm terms and responsibilities',
            description: 'Clarify who handles booking, documents, broker communication, and shipment decisions.',
          },
          {
            id: 'process-updates',
            title: 'Coordinate the shipment',
            description: 'Use the agreed communication process for status updates and issues.',
          },
        ],
      },
      callToAction(
        'how-it-works-contact',
        'Have a question about the process?',
        'Ask the team to explain service scope and responsibilities before you proceed.',
        [{ label: 'Contact TruckAxic', href: '/contact', style: 'primary' }],
      ),
    ],
  ),
  'service-dry-van': equipmentPage(
    'service-dry-van',
    'Dry Van Dispatch | TruckAxic',
    'Dry Van Dispatch',
    'Discuss dry van dispatch support for enclosed-trailer freight, including equipment fit, lane preferences, shipment details, and terms.',
    'Dry van dispatch, with the details in view.',
    'Share your trailer specifications and preferred lanes to discuss whether a load is a fit.',
    [
      'Start with equipment and shipment requirements.',
      'Dry van operations may involve general, boxed, or palletized freight. Requirements vary by shipment and should be confirmed before acceptance.',
      'Discuss trailer dimensions and condition, cargo details, pickup and delivery windows, route, offered rate, and any handling or documentation requirements.',
      'No load availability, rate, or revenue outcome is guaranteed by this page. Confirm the terms for each shipment before proceeding.',
    ],
    [
      {
        id: 'dry-equipment',
        title: 'Equipment details',
        description: 'Confirm trailer specifications, condition, and any shipper requirements.',
      },
      {
        id: 'dry-lane',
        title: 'Lane and schedule',
        description: 'Share preferred areas, timing, and operating constraints.',
      },
      {
        id: 'dry-terms',
        title: 'Shipment terms',
        description: 'Review rate, cargo, pickup, delivery, and document details before acceptance.',
      },
    ],
  ),
  'service-reefer': equipmentPage(
    'service-reefer',
    'Refrigerated Freight Dispatch | TruckAxic',
    'Refrigerated / Reefer Dispatch',
    'Discuss refrigerated freight dispatch, temperature requirements, equipment readiness, shipment timing, and responsibilities.',
    'Refrigerated freight requires clear coordination.',
    'Confirm temperature, equipment, handling, and documentation requirements for each shipment.',
    [
      'Confirm the cold-chain details before acceptance.',
      'Refrigerated shipments can have specific temperature, handling, timing, and documentation requirements. Requirements depend on the commodity and shipment instructions.',
      'Before accepting a load, the carrier and relevant shipment parties should confirm the required set point, reefer operation, monitoring responsibility, fuel expectations, and escalation process.',
      'This page does not claim that TruckAxic monitors equipment or guarantees temperature compliance. Confirm who performs each task for the specific shipment.',
    ],
    [
      {
        id: 'reefer-temperature',
        title: 'Temperature instructions',
        description: 'Confirm the required range or set point and where instructions are documented.',
      },
      {
        id: 'reefer-equipment',
        title: 'Equipment readiness',
        description: 'Verify equipment condition and assigned operating responsibilities.',
      },
      {
        id: 'reefer-communication',
        title: 'Shipment updates',
        description: 'Agree how temperature-related issues, delays, and status changes are communicated.',
      },
    ],
  ),
  'service-flatbed': equipmentPage(
    'service-flatbed',
    'Flatbed Dispatch | TruckAxic',
    'Flatbed Dispatch',
    'Discuss flatbed and step-deck dispatch, cargo dimensions, securement, permits, routing, and shipment responsibilities.',
    'Plan the details of an open-deck haul.',
    'Review equipment, cargo dimensions, securement instructions, and route requirements before accepting a shipment.',
    [
      'Confirm equipment and load requirements.',
      'Open-deck shipments may require specific trailer configurations, cargo dimensions, securement plans, permits, and route restrictions.',
      'The carrier and responsible shipment parties should identify who supplies securement materials, obtains permits, verifies dimensions, and confirms safe loading before dispatch.',
      'Do not assume permits, securement services, or regulatory approvals are included. Confirm responsibilities and requirements for each load.',
    ],
    [
      {
        id: 'flatbed-equipment',
        title: 'Trailer configuration',
        description: 'Confirm deck type, dimensions, capacity, and compatibility with the cargo.',
      },
      {
        id: 'flatbed-securement',
        title: 'Securement plan',
        description: 'Review loading instructions, securement materials, and assigned responsibilities.',
      },
      {
        id: 'flatbed-route',
        title: 'Permits and routing',
        description: 'Identify applicable dimensions, restrictions, permits, and route approvals.',
      },
    ],
  ),
  'service-power-only': equipmentPage(
    'service-power-only',
    'Power Only Dispatch | TruckAxic',
    'Power Only Dispatch',
    'Discuss power-only arrangements, tractor requirements, trailer interchange, pickup and return details, and shipment terms.',
    'Power-only dispatch starts with clear equipment terms.',
    'Review the tractor requirements and trailer responsibilities for each proposed move.',
    [
      'Confirm who supplies and controls the trailer.',
      'Power-only moves use a tractor to move a trailer supplied or designated by another party. Trailer availability, interchange, condition, and responsibility vary by arrangement.',
      'Before acceptance, clarify pickup and return locations, trailer identification and condition, detention or waiting terms, drop-and-hook instructions, and who handles trailer issues.',
      'No reduction in deadhead, waiting time, or operating costs is guaranteed. Confirm the details of each load and trailer arrangement.',
    ],
    [
      {
        id: 'power-trailer',
        title: 'Trailer arrangement',
        description: 'Identify the trailer provider, interchange process, condition checks, and return obligations.',
      },
      {
        id: 'power-timing',
        title: 'Pickup and return',
        description: 'Confirm locations, appointment windows, waiting terms, and required check-ins.',
      },
      {
        id: 'power-responsibility',
        title: 'Responsibilities',
        description: 'Clarify who handles trailer defects, documents, and shipment communication.',
      },
    ],
  ),
  faq: faqDraft,
  contact: makePage(
    'contact',
    'Contact TruckAxic',
    'Contact TruckAxic to discuss carrier dispatch, equipment, preferred lanes, or freight questions.',
    [
      hero(
        'contact-hero',
        'Contact TruckAxic',
        'Let’s discuss your dispatch needs.',
        'Tell us about your equipment, operating preferences, or freight question.',
        [{ label: 'Contact us', href: '/contact', style: 'primary' }],
      ),
      {
        id: 'contact-intro',
        type: 'copy',
        enabled: true,
        title: 'What to include in your message',
        paragraphs: [
          'Share only the information needed to understand your inquiry, such as equipment type, preferred lanes, and the kind of dispatch support you want to discuss.',
          'Do not include passwords, payment-card information, or other sensitive information in the message form.',
          'Contact details and response availability should be confirmed using verified business contact information.',
        ],
      },
      {
        id: 'contact-form-intro',
        type: 'form-intro',
        enabled: true,
        title: 'Send a message',
        description: 'Use the contact form below. Review the privacy notice and terms linked beside the form before submitting.',
      },
    ],
  ),
  'carrier-signup': makePage(
    'carrier-signup',
    'Carrier Signup | TruckAxic',
    'Start a conversation with TruckAxic about your carrier operation and dispatch needs.',
    [
      hero(
        'carrier-signup-hero',
        'For carriers and owner-operators',
        'Tell us about your operation.',
        'Share your equipment type and operating preferences to begin a dispatch conversation.',
        [{ label: 'Carrier signup', href: '/carrier-signup', style: 'primary' }],
      ),
      {
        id: 'carrier-signup-info',
        type: 'copy',
        enabled: true,
        title: 'Details to have ready',
        paragraphs: [
          'The signup form asks for basic contact, carrier, and equipment information so the team can understand your inquiry.',
          'Review each requested field and share only information appropriate for an initial inquiry. Do not submit passwords, payment-card details, or unrelated sensitive information.',
          'Service availability, eligibility, and any commercial terms must be discussed and confirmed before a service relationship begins.',
        ],
      },
      {
        id: 'carrier-signup-form-intro',
        type: 'form-intro',
        enabled: true,
        title: 'Carrier inquiry',
        description: 'Complete the form to start the conversation. Form submission does not itself establish a dispatch agreement.',
      },
      callToAction(
        'carrier-signup-questions',
        'Questions before submitting?',
        'Contact TruckAxic to discuss the information requested and the next steps.',
        [{ label: 'Contact us', href: '/contact', style: 'secondary' }],
      ),
    ],
  ),
  'privacy-policy': legalPage('privacy-policy'),
  terms: legalPage('terms'),
  'cookie-policy': legalPage('cookie-policy'),
  disclaimer: legalPage('disclaimer'),
  'service-agreement': legalPage('service-agreement'),
  'refund-cancellation-policy': legalPage('refund-cancellation-policy'),
  'accessibility-statement': legalPage('accessibility-statement'),
  'data-security': legalPage('data-security'),
  'report-security-issue': legalPage('report-security-issue'),
};

export const PREPARED_CMS_PAGE_DRAFTS: Readonly<
  Record<CmsPageId, CmsPageContent>
> = preparedDrafts;

export const EXISTING_FAQ_MUST_BE_COMPARED_BEFORE_SAVE = true;
