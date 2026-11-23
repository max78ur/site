import type { CmsPageId } from './types';

export const CMS_PAGE_SEO_DEFAULTS: Record<
  CmsPageId,
  { title: string; description: string }
> = {
  home: {
    title: 'TruckAxic | Truck Dispatch & Logistics',
    description:
      'Explore TruckAxic truck dispatch and logistics information, services, and carrier resources.',
  },
  about: {
    title: 'About Us | TruckAxic',
    description:
      'Learn about TruckAxic and its truck dispatch and logistics services.',
  },
  services: {
    title: 'Dispatch Services | TruckAxic',
    description:
      'Explore TruckAxic dispatch service information for owner-operators and carriers.',
  },
  'how-it-works': {
    title: 'How It Works | TruckAxic',
    description:
      'Review the TruckAxic dispatch process, from sharing equipment details to coordinating loads.',
  },
  'service-dry-van': {
    title: 'Dry Van Dispatch | TruckAxic',
    description:
      'Learn about TruckAxic dispatch services for dry van carriers.',
  },
  'service-reefer': {
    title: 'Refrigerated Freight Dispatch | TruckAxic',
    description:
      'Learn about TruckAxic dispatch services for refrigerated freight carriers.',
  },
  'service-flatbed': {
    title: 'Flatbed Dispatch | TruckAxic',
    description:
      'Learn about TruckAxic dispatch services for flatbed carriers.',
  },
  'service-power-only': {
    title: 'Power Only Dispatch | TruckAxic',
    description:
      'Learn about TruckAxic dispatch services for power-only carriers.',
  },
  faq: {
    title: 'Frequently Asked Questions | TruckAxic',
    description:
      'Find answers to common questions about TruckAxic dispatch and carrier services.',
  },
  contact: {
    title: 'Contact TruckAxic',
    description:
      'Contact TruckAxic with questions about dispatch and logistics services.',
  },
  'carrier-signup': {
    title: 'Carrier Signup | TruckAxic',
    description:
      'Contact TruckAxic about carrier signup and dispatch services.',
  },
  'privacy-policy': {
    title: 'Privacy Policy | TruckAxic',
    description:
      'Read the TruckAxic privacy information published on this website.',
  },
  terms: {
    title: 'Terms & Conditions | TruckAxic',
    description:
      'Read the terms and conditions published for the TruckAxic website.',
  },
  'cookie-policy': {
    title: 'Cookie Policy | TruckAxic',
    description:
      'View TruckAxic information about cookies and similar website technologies.',
  },
  disclaimer: {
    title: 'Disclaimer | TruckAxic',
    description:
      'View the disclaimer published for the TruckAxic website.',
  },
  'service-agreement': {
    title: 'Service Agreement | TruckAxic',
    description:
      'View the TruckAxic service agreement if and when a reviewed version is published.',
  },
  'refund-cancellation-policy': {
    title: 'Refund & Cancellation Policy | TruckAxic',
    description:
      'View the TruckAxic refund and cancellation information if and when published.',
  },
  'accessibility-statement': {
    title: 'Accessibility Statement | TruckAxic',
    description:
      'View TruckAxic accessibility information and published contact details.',
  },
  'data-security': {
    title: 'Data Security | TruckAxic',
    description:
      'View verified information about TruckAxic data security practices when published.',
  },
  'report-security-issue': {
    title: 'Report a Security Issue | TruckAxic',
    description:
      'Find TruckAxic security issue reporting information if a verified channel is published.',
  },
};
