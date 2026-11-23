import { CMS_PAGE_IDS } from '@/lib/cms/types';
import type {
  CmsCallToActionSection,
  CmsCardsSection,
  CmsContactSection,
  CmsCopySection,
  CmsFaqSection,
  CmsFormIntroSection,
  CmsHeroSection,
  CmsLegalSection,
  CmsPageContent,
  CmsPageId,
  CmsSection,
  CmsStatisticsSection,
  CmsStepsSection,
  CmsTestimonialsSection,
} from '@/lib/cms/types';

export const CMS_PAGE_LABELS: Record<CmsPageId, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  'how-it-works': 'How It Works',
  'service-dry-van': 'Dry Van',
  'service-reefer': 'Refrigerated',
  'service-flatbed': 'Flatbed',
  'service-power-only': 'Power Only',
  faq: 'FAQs',
  contact: 'Contact',
  'carrier-signup': 'Carrier Signup',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  'cookie-policy': 'Cookie Policy',
  disclaimer: 'Disclaimer',
  'service-agreement': 'Service Agreement',
  'refund-cancellation-policy': 'Refund & Cancellation Policy',
  'accessibility-statement': 'Accessibility Statement',
  'data-security': 'Data Security',
  'report-security-issue': 'Report a Security Issue',
};

export const CMS_PAGES = CMS_PAGE_IDS.map((id) => ({
  id,
  label: CMS_PAGE_LABELS[id],
}));

const CMS_CANONICAL_PATHS: Record<CmsPageId, string> = {
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

export function createEmptyCmsPage(pageId: CmsPageId): CmsPageContent {
  const legalDraft = LEGAL_DRAFT_TEMPLATES[pageId];
  if (legalDraft) {
    return {
      schemaVersion: 1,
      pageId,
      seo: {
        title: legalDraft.title,
        description: legalDraft.description,
        canonicalPath: CMS_CANONICAL_PATHS[pageId],
      },
      sections: [
        {
          id: 'legal-draft-content',
          type: 'legal',
          enabled: true,
          title: legalDraft.title,
          blocks: legalDraft.blocks.map((block, index) => ({
            id: `legal-block-${index + 1}`,
            heading: block.heading,
            paragraphs: block.paragraphs,
          })),
        },
      ],
    };
  }

  if (pageId === 'how-it-works') {
    return {
      schemaVersion: 1,
      pageId,
      seo: {
        title: 'How TruckAxic Dispatch Works',
        description:
          'From signup to your first load, see the existing TruckAxic dispatch process.',
        canonicalPath: CMS_CANONICAL_PATHS[pageId],
      },
      sections: [
        {
          id: 'how-it-works-hero',
          type: 'hero',
          enabled: true,
          eyebrow: '04 / Simple process',
          title: 'How TruckAxic Dispatch Works',
          description:
            'From signup to your first load, we make getting dispatched simple and profitable.',
          actions: [
            { label: 'Become a carrier', href: '/carrier-signup', style: 'primary' },
            { label: 'Explore services', href: '/services', style: 'secondary' },
          ],
        },
        {
          id: 'how-it-works-steps',
          type: 'steps',
          enabled: true,
          eyebrow: 'A simple four-step process',
          title: 'From signup to your next load',
          description: '',
          steps: [
            {
              id: 'tell-us-equipment',
              title: 'Tell Us Your Equipment',
              description: 'Share your trailer type, lanes, and rate expectations.',
            },
            {
              id: 'book-loads',
              title: 'We Book the Loads',
              description:
                'Our dispatchers source and secure the best-paying freight for you.',
            },
            {
              id: 'handle-brokers',
              title: 'We Handle Brokers',
              description:
                'We negotiate rates and manage all broker communication.',
            },
            {
              id: 'get-paid',
              title: 'Get Paid Fast',
              description: 'Haul, deliver, and get paid — we handle the paperwork.',
            },
          ],
        },
      ],
    };
  }

  return {
    schemaVersion: 1,
    pageId,
    seo: { title: '', description: '', canonicalPath: CMS_CANONICAL_PATHS[pageId] },
    sections: [],
  };
}

const LEGAL_DRAFT_NOTICE =
  'ATTORNEY REVIEW DRAFT — This is a working outline, not an effective policy or agreement and not legal advice. Replace bracketed items with verified business information and obtain review by qualified U.S. business counsel before publication or use.';

const LEGAL_DRAFT_TEMPLATES: Partial<
  Record<
    CmsPageId,
    {
      title: string;
      description: string;
      blocks: Array<{ heading: string; paragraphs: string[] }>;
    }
  >
> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description:
      'Attorney-review draft privacy notice. Confirm all data practices and business details before publication.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Business identity and scope',
        paragraphs: [
          'This notice is intended to describe the privacy practices of TruckAxic LLC for truckaxic.com and the dispatch services offered through it. Confirm the entity, locations, audiences, and services covered before use.',
        ],
      },
      {
        heading: 'Information and collection methods',
        paragraphs: [
          'We collect personal information such as name, email address, phone number, company name, and MC/DOT numbers through our website contact and carrier signup forms. This information is collected directly from individuals when they submit forms on our website. We do not collect bank login credentials or credit card details.',
        ],
      },
      {
        heading: 'Purposes and use of information',
        paragraphs: [
          'We use the information collected through our website forms to respond to inquiries, evaluate carrier applications, and provide dispatch and logistics services. We do not sell personal information to third parties.',
        ],
      },
      {
        heading: 'Sharing with service partners',
        paragraphs: [
          'We may share information with brokers, load-boards, or service partners for the purpose of arranging dispatch services. Such sharing is limited to what is necessary for dispatch coordination and requires business confirmation. We do not sell personal information.',
        ],
      },
      {
        heading: 'Cookies and similar technologies',
        paragraphs: [
          'Insert a verified inventory of cookies, local storage, SDKs, analytics, and other tracking technologies, including provider, purpose, duration, and available controls. Do not claim that a technology is or is not used without verification.',
        ],
      },
      {
        heading: 'Retention and security',
        paragraphs: [
          'State the actual retention criteria, security practices at an appropriate level of detail, and any privacy choices or rights that apply. Confirm applicable jurisdictions and operational procedures with counsel before describing them. Dispatch fees are generally collected after the driver receives payment. Payment methods include mostly Zelle and bank transfer. We do not directly collect customers\' bank login or card details.',
        ],
      },
      {
        heading: 'Contact and updates',
        paragraphs: [
          'Privacy questions and requests: [VERIFIED PRIVACY CONTACT METHOD]. Effective date: [DATE APPROVED BY COUNSEL]. Explain how material updates will be communicated after the business process is confirmed.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    description:
      'Attorney-review draft website terms. Service, fee, dispute, and liability provisions require verified business decisions and counsel review.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Parties, scope, and acceptance',
        paragraphs: [
          'Identify [VERIFIED LEGAL ENTITY NAME], the website, covered services, intended users, and the event that forms an agreement. Counsel should confirm applicable electronic-consent and notice requirements.',
        ],
      },
      {
        heading: 'Service description and separate agreements',
        paragraphs: [
          'Describe only services the business actually provides. Identify any separate carrier, dispatch, broker, shipper, or other agreement that governs a transaction. Confirm the business role and regulatory characterization with counsel; do not rely on this draft to define them.',
        ],
      },
      {
        heading: 'User responsibilities and acceptable use',
        paragraphs: [
          'Specify accurate-information, authority, equipment, safety, and website-use responsibilities that the business intends to require. Replace this outline with operationally verified terms.',
        ],
      },
      {
        heading: 'Fees, cancellation, and changes',
        paragraphs: [
          'Insert the approved fee schedule, payment timing, renewal, cancellation, refund, and service-change terms. These business terms are currently unspecified and must be completed before publication.',
        ],
      },
      {
        heading: 'Disputes, warranties, and liability',
        paragraphs: [
          'Insert provisions selected by the business and reviewed by counsel, including governing law, venue or dispute process, warranty language, liability limitations, and any required consumer notices. No jurisdiction or legal outcome is assumed in this draft.',
        ],
      },
      {
        heading: 'Notices and effective date',
        paragraphs: [
          'Use [VERIFIED NOTICE ADDRESS OR ELECTRONIC CONTACT] and [COUNSEL-APPROVED EFFECTIVE DATE]. Describe how updates will be delivered and when they take effect.',
        ],
      },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description:
      'Attorney-review draft describing website cookies and similar technologies; complete only after technical verification.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Technologies used',
        paragraphs: [
          'Complete a technical inventory of cookies, browser storage, pixels, SDKs, and other technologies used on each page. For each item, record its provider, purpose, duration, and whether it is required for a requested function.',
          'No inventory has been verified for this draft. Do not publish a list, claim that tracking is absent, or characterize a technology as essential until it has been checked against the production site and its dependencies.',
        ],
      },
      {
        heading: 'Choices and consent',
        paragraphs: [
          'Describe the controls actually available to visitors and any consent mechanism required for the verified technologies and jurisdictions. State how a visitor can change or withdraw a choice only after that process has been implemented and tested.',
        ],
      },
      {
        heading: 'Contact and updates',
        paragraphs: [
          'Cookie questions: [VERIFIED PRIVACY CONTACT METHOD]. Effective date: [DATE APPROVED BY COUNSEL].',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    description:
      'Attorney-review draft identifying the intended limits of website information; confirm the business position before publication.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Website information',
        paragraphs: [
          'Describe the intended nature, update process, and limitations of information shown on the website. Identify any information that is illustrative or subject to confirmation. Do not make a blanket accuracy, completeness, availability, or legal-compliance claim.',
        ],
      },
      {
        heading: 'Service availability and outcomes',
        paragraphs: [
          'The business must decide and counsel must review whether and how to address service availability, load or rate outcomes, delivery timing, third-party information, and external links. Do not promise or disclaim a specific outcome unless supported by the business model and approved terms.',
        ],
      },
      {
        heading: 'Contact and effective date',
        paragraphs: [
          'Questions: [VERIFIED BUSINESS CONTACT METHOD]. Effective date: [DATE APPROVED BY COUNSEL].',
        ],
      },
    ],
  },
  'service-agreement': {
    title: 'Service Agreement',
    description:
      'Attorney-review draft service agreement outline. Complete commercial terms and regulatory roles before any use.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Parties and service scope',
        paragraphs: [
          'Provider: [VERIFIED LEGAL ENTITY NAME]. Customer: [CUSTOMER LEGAL NAME]. Effective date: [DATE]. Precisely describe the services, equipment, lanes, deliverables, exclusions, and any separate transaction documents.',
          'The business role in each transportation transaction is not established by this draft. Counsel must verify the parties, authority, regulatory status, and contract structure before use.',
        ],
      },
      {
        heading: 'Responsibilities and authorization',
        paragraphs: [
          'Set out each party’s verified responsibilities, required documents, decision authority, communication process, and procedures for changes or exceptions. Do not imply authority to bind another party unless expressly authorized in the final agreement.',
        ],
      },
      {
        heading: 'Fees, invoicing, and term',
        paragraphs: [
          'Insert the approved fees, payment method and deadlines, taxes, disputed-invoice process, term, renewal, and termination rights. These commercial terms require business approval.',
        ],
      },
      {
        heading: 'Risk allocation and notices',
        paragraphs: [
          'Counsel must draft and approve insurance, cargo, indemnity, confidentiality, data, dispute, governing-law, liability, and notice provisions based on verified operations and applicable law.',
        ],
      },
    ],
  },
  'refund-cancellation-policy': {
    title: 'Refund & Cancellation Policy',
    description:
      'Attorney-review draft for service cancellations and refunds; fee rules and timelines require business approval.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Services and charges covered',
        paragraphs: [
          'Identify which services, fees, deposits, subscriptions, or other charges are covered. Insert the actual fee schedule and any non-refundable charge only after the business has approved it and counsel has reviewed it.',
        ],
      },
      {
        heading: 'Cancellation process and timing',
        paragraphs: [
          'Specify how a customer may cancel, when cancellation takes effect, any required notice period, and how in-progress work is handled. Provide a verified contact method: [CANCELLATION CONTACT METHOD].',
        ],
      },
      {
        heading: 'Refund eligibility and timing',
        paragraphs: [
          'State the business-approved circumstances for refunds, any calculation method, processing timeline, and exceptions required by applicable law. These terms are not yet established; do not publish until completed and reviewed.',
        ],
      },
      {
        heading: 'Questions and effective date',
        paragraphs: [
          'Questions: [VERIFIED BILLING CONTACT METHOD]. Effective date: [DATE APPROVED BY COUNSEL].',
        ],
      },
    ],
  },
  'accessibility-statement': {
    title: 'Accessibility Statement',
    description:
      'Draft accessibility information. Verify current accessibility features and contact process before publication; no conformance level is claimed.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Accessibility commitment and current status',
        paragraphs: [
          'Describe the organization’s approved accessibility goals and the results of a documented review. The website’s conformance status has not been independently verified; this draft makes no conformance or certification claim.',
        ],
      },
      {
        heading: 'Known limitations and remediation',
        paragraphs: [
          'List known barriers, affected experiences, alternatives if available, and a verified remediation process. Do not state that all content or functionality is accessible without testing.',
        ],
      },
      {
        heading: 'Request assistance or report a barrier',
        paragraphs: [
          'Provide [VERIFIED ACCESSIBILITY CONTACT METHOD] and explain the information needed to respond. Set a response target only after it has been approved and operationally supported.',
        ],
      },
    ],
  },
  'data-security': {
    title: 'Data Security',
    description:
      'Attorney-review draft about information security. Describe only verified controls and incident procedures.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Verified safeguards',
        paragraphs: [
          'Document the administrative, technical, and physical safeguards actually approved for the relevant systems. Security controls have not been independently verified for this draft; do not claim encryption, certification, monitoring, or a particular security level unless substantiated.',
        ],
      },
      {
        heading: 'Access, retention, and service providers',
        paragraphs: [
          'Describe verified access-management practices, retention and deletion procedures, service-provider responsibilities, and how security reviews are performed. Confirm that these statements match production configuration and contracts.',
        ],
      },
      {
        heading: 'Incident response and contact',
        paragraphs: [
          'Insert the approved incident-response and notification process, including applicable legal review and [VERIFIED SECURITY CONTACT METHOD]. Do not publish response timelines or guarantees until they are operationally supported.',
        ],
      },
    ],
  },
  'report-security-issue': {
    title: 'Report a Security Issue',
    description:
      'Draft instructions for reporting a security concern. Verify a monitored reporting channel and counsel-approved disclosure terms before publication.',
    blocks: [
      { heading: 'Draft status', paragraphs: [LEGAL_DRAFT_NOTICE] },
      {
        heading: 'Reporting channel',
        paragraphs: [
          'A dedicated security reporting channel has not been verified. Insert a monitored contact method and intake owner before publication. Until then, this page is not an active vulnerability-reporting channel.',
        ],
      },
      {
        heading: 'Information to include',
        paragraphs: [
          'After a channel is established, describe the information needed to reproduce and assess a report while instructing reporters not to include unrelated personal information, credentials, or data belonging to other people.',
        ],
      },
      {
        heading: 'Research expectations',
        paragraphs: [
          'Have counsel and security staff approve the scope, testing limits, disclosure coordination, and any safe-harbor language before stating expectations or protections. This draft grants no authorization to test systems.',
        ],
      },
    ],
  },
};

export function createCmsSection(type: 'hero'): CmsHeroSection;
export function createCmsSection(type: 'copy'): CmsCopySection;
export function createCmsSection(type: 'cards'): CmsCardsSection;
export function createCmsSection(type: 'steps'): CmsStepsSection;
export function createCmsSection(type: 'statistics'): CmsStatisticsSection;
export function createCmsSection(type: 'testimonials'): CmsTestimonialsSection;
export function createCmsSection(type: 'faq'): CmsFaqSection;
export function createCmsSection(type: 'contact'): CmsContactSection;
export function createCmsSection(type: 'form-intro'): CmsFormIntroSection;
export function createCmsSection(type: 'call-to-action'): CmsCallToActionSection;
export function createCmsSection(type: 'legal'): CmsLegalSection;
export function createCmsSection(type: CmsSection['type']): CmsSection;
export function createCmsSection(type: CmsSection['type']): CmsSection {
  const base = { id: crypto.randomUUID(), enabled: true };
  switch (type) {
    case 'hero':
      return { ...base, type, eyebrow: '', title: '', description: '', actions: [] };
    case 'copy':
      return { ...base, type, eyebrow: '', title: '', paragraphs: [] };
    case 'cards':
      return { ...base, type, eyebrow: '', title: '', description: '', cards: [] };
    case 'steps':
      return { ...base, type, eyebrow: '', title: '', description: '', steps: [] };
    case 'statistics':
      return { ...base, type, eyebrow: '', title: '', statistics: [] };
    case 'testimonials':
      return { ...base, type, eyebrow: '', title: '', description: '', testimonials: [] };
    case 'faq':
      return { ...base, type, eyebrow: '', title: '', description: '', questions: [] };
    case 'contact':
      return { ...base, type, eyebrow: '', title: '', description: '', details: [] };
    case 'form-intro':
      return { ...base, type, title: '', description: '' };
    case 'call-to-action':
      return { ...base, type, eyebrow: '', title: '', description: '', actions: [] };
    case 'legal':
      return { ...base, type, title: '', blocks: [] };
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const moved = [...items];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}

