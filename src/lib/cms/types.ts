import type { Timestamp } from 'firebase/firestore';

export const CMS_PAGE_IDS = [
  'home',
  'about',
  'services',
  'how-it-works',
  'service-dry-van',
  'service-reefer',
  'service-flatbed',
  'service-power-only',
  'faq',
  'contact',
  'carrier-signup',
  'privacy-policy',
  'terms',
  'cookie-policy',
  'disclaimer',
  'service-agreement',
  'refund-cancellation-policy',
  'accessibility-statement',
  'data-security',
  'report-security-issue',
] as const;

export type CmsPageId = (typeof CMS_PAGE_IDS)[number];

export interface CmsSeo {
  title: string;
  description: string;
  canonicalPath: string;
  socialImage?: CmsMediaReference;
}

export interface CmsMediaReference {
  assetId: string;
  storagePath: string;
  contentType: string;
  altText: string;
}

export interface CmsAction {
  label: string;
  href: string;
  style: 'primary' | 'secondary' | 'text';
}

interface CmsSectionBase {
  id: string;
  enabled: boolean;
}

export interface CmsHeroSection extends CmsSectionBase {
  type: 'hero';
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage?: CmsMediaReference;
  backgroundVideo?: CmsMediaReference;
  poster?: CmsMediaReference;
  actions: CmsAction[];
}

export interface CmsCopySection extends CmsSectionBase {
  type: 'copy';
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  image?: CmsMediaReference;
}

export interface CmsCardItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: CmsMediaReference;
  icon?: string;
  href?: string;
  features?: string[];
}

export interface CmsCardsSection extends CmsSectionBase {
  type: 'cards';
  eyebrow?: string;
  title: string;
  description?: string;
  cards: CmsCardItem[];
}

export interface CmsStepsSection extends CmsSectionBase {
  type: 'steps';
  eyebrow?: string;
  title: string;
  description?: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface CmsStatisticsSection extends CmsSectionBase {
  type: 'statistics';
  eyebrow?: string;
  title: string;
  statistics: Array<{ id: string; value: string; label: string }>;
}

export interface CmsTestimonialsSection extends CmsSectionBase {
  type: 'testimonials';
  eyebrow?: string;
  title: string;
  description?: string;
  testimonials: Array<{
    id: string;
    quote: string;
    author: string;
    role: string;
    location: string;
    rating: number;
  }>;
}

export interface CmsFaqSection extends CmsSectionBase {
  type: 'faq';
  eyebrow?: string;
  title: string;
  description?: string;
  questions: Array<{ id: string; question: string; answer: string }>;
}

export interface CmsContactSection extends CmsSectionBase {
  type: 'contact';
  eyebrow?: string;
  title: string;
  description: string;
  details: Array<{
    id: string;
    label: string;
    value: string;
    href?: string;
  }>;
}

export interface CmsFormIntroSection extends CmsSectionBase {
  type: 'form-intro';
  title: string;
  description: string;
}

export interface CmsCallToActionSection extends CmsSectionBase {
  type: 'call-to-action';
  eyebrow?: string;
  title: string;
  description?: string;
  actions: CmsAction[];
}

export interface CmsLegalSection extends CmsSectionBase {
  type: 'legal';
  title: string;
  blocks: Array<{ id: string; heading: string; paragraphs: string[] }>;
}

export type CmsSection =
  | CmsHeroSection
  | CmsCopySection
  | CmsCardsSection
  | CmsStepsSection
  | CmsStatisticsSection
  | CmsTestimonialsSection
  | CmsFaqSection
  | CmsContactSection
  | CmsFormIntroSection
  | CmsCallToActionSection
  | CmsLegalSection;

export interface CmsPageContent {
  schemaVersion: 1;
  pageId: CmsPageId;
  seo: CmsSeo;
  sections: CmsSection[];
}

export interface CmsDraftPage extends CmsPageContent {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface CmsPublishedPage extends CmsPageContent {
  version: number;
  publishedAt: Timestamp;
  publishedBy: string;
}

export interface CmsPageRevision extends CmsPageContent {
  version: number;
  publishedAt: Timestamp;
  publishedBy: string;
}

export interface CmsDesignSettings {
  colors: {
    primary: string;
    dark: string;
    light: string;
    gold: string;
  };
  backgrounds: {
    page: string;
    surface: string;
    alternate: string;
    heroOverlay: string;
  };
  buttons: {
    primaryBackground: string;
    primaryText: string;
    secondaryBackground: string;
    secondaryText: string;
    border: string;
    borderWidthPx: number;
  };
  typography: {
    bodyFont: 'DM Sans' | 'Arial' | 'system-ui';
    displayFont: 'Barlow Condensed' | 'DM Sans' | 'Arial';
    baseFontSizePx: number;
    headingScale: number;
  };
  layout: {
    contentWidthPx: number;
    sectionSpacingPx: number;
    cardRadiusPx: number;
    buttonRadiusPx: number;
  };
}

export interface CmsNavigationItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface CmsFooterLink {
  id: string;
  label: string;
  href: string;
}

export interface CmsSettingsContent {
  schemaVersion: 1;
  theme: CmsDesignSettings;
  navigation: CmsNavigationItem[];
  footer: {
    brandName: string;
    description: string;
    links: CmsFooterLink[];
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    supportHours: string;
  };
}

export interface CmsDraftSettings extends CmsSettingsContent {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface CmsPublishedSettings extends CmsSettingsContent {
  version: number;
  publishedAt: Timestamp;
  publishedBy: string;
}

export interface CmsMediaAsset {
  assetId: string;
  storagePath: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  altText: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
  width?: number;
  height?: number;
  durationMs?: number;
}

export interface CmsMediaDraft extends CmsMediaAsset {}

export interface CmsPublishedMedia extends CmsMediaAsset {
  version: number;
}
