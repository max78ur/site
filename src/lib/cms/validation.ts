import { Timestamp } from 'firebase/firestore';
import { CMS_PAGE_IDS } from './types';
import type {
  CmsAction,
  CmsCardItem,
  CmsDraftPage,
  CmsDraftSettings,
  CmsMediaReference,
  CmsMediaAsset,
  CmsPublishedMedia,
  CmsPageContent,
  CmsPageId,
  CmsPublishedPage,
  CmsPublishedSettings,
  CmsSection,
  CmsSettingsContent,
} from './types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isText = (value: unknown, maxLength = 4000): value is string =>
  typeof value === 'string' && value.length <= maxLength;

const isTextList = (value: unknown, maxLength = 4000): value is string[] =>
  Array.isArray(value) && value.length <= 100 && value.every((item) => isText(item, maxLength));

const isSafeHref = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 500 &&
  ((value.startsWith('/') && !value.startsWith('//')) ||
    value.startsWith('#') ||
    /^https:\/\//i.test(value) ||
    /^mailto:/i.test(value) ||
    /^tel:/i.test(value));

const isMediaReference = (value: unknown): value is CmsMediaReference => {
  if (!isRecord(value)) return false;
  return (
    isText(value.assetId, 120) &&
    isText(value.storagePath, 500) &&
    (value.storagePath.startsWith('cms-drafts/') ||
      value.storagePath.startsWith('cms-published/')) &&
    isText(value.contentType, 100) &&
    isText(value.altText, 500)
  );
};

const isAction = (value: unknown): value is CmsAction => {
  if (!isRecord(value)) return false;
  return (
    isText(value.label, 120) &&
    isSafeHref(value.href) &&
    (value.style === 'primary' ||
      value.style === 'secondary' ||
      value.style === 'text')
  );
};

const isCard = (value: unknown): value is CmsCardItem => {
  if (!isRecord(value)) return false;
  return (
    isText(value.id, 120) &&
    isText(value.title, 240) &&
    (value.subtitle === undefined || isText(value.subtitle, 240)) &&
    isText(value.description) &&
    (value.image === undefined || isMediaReference(value.image)) &&
    (value.icon === undefined || isText(value.icon, 80)) &&
    (value.href === undefined || isSafeHref(value.href)) &&
    (value.features === undefined || isTextList(value.features, 300))
  );
};

const isSectionBase = (value: UnknownRecord) =>
  isText(value.id, 120) && typeof value.enabled === 'boolean';

const isSection = (value: unknown): value is CmsSection => {
  if (!isRecord(value) || !isSectionBase(value)) return false;

  switch (value.type) {
    case 'hero':
      return (
        isText(value.eyebrow, 240) &&
        isText(value.title, 500) &&
        isText(value.description) &&
        (value.backgroundImage === undefined || isMediaReference(value.backgroundImage)) &&
        (value.backgroundVideo === undefined || isMediaReference(value.backgroundVideo)) &&
        (value.poster === undefined || isMediaReference(value.poster)) &&
        Array.isArray(value.actions) &&
        value.actions.length <= 2 &&
        value.actions.every(isAction)
      );
    case 'copy':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        isTextList(value.paragraphs) &&
        (value.image === undefined || isMediaReference(value.image))
      );
    case 'cards':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        (value.description === undefined || isText(value.description)) &&
        Array.isArray(value.cards) &&
        value.cards.length <= 40 &&
        value.cards.every(isCard)
      );
    case 'steps':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        (value.description === undefined || isText(value.description)) &&
        Array.isArray(value.steps) &&
        value.steps.length <= 40 &&
        value.steps.every(
          (step) =>
            isRecord(step) &&
            isText(step.id, 120) &&
            isText(step.title, 240) &&
            isText(step.description) &&
            (step.icon === undefined || isText(step.icon, 80)),
        )
      );
    case 'statistics':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        Array.isArray(value.statistics) &&
        value.statistics.length <= 40 &&
        value.statistics.every(
          (item) =>
            isRecord(item) &&
            isText(item.id, 120) &&
            isText(item.value, 120) &&
            isText(item.label, 240),
        )
      );
    case 'testimonials':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        (value.description === undefined || isText(value.description)) &&
        Array.isArray(value.testimonials) &&
        value.testimonials.length <= 40 &&
        value.testimonials.every(
          (item) =>
            isRecord(item) &&
            isText(item.id, 120) &&
            isText(item.quote) &&
            isText(item.author, 240) &&
            isText(item.role, 240) &&
            isText(item.location, 240) &&
            typeof item.rating === 'number' &&
            item.rating >= 1 &&
            item.rating <= 5,
        )
      );
    case 'faq':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        (value.description === undefined || isText(value.description)) &&
        Array.isArray(value.questions) &&
        value.questions.length <= 80 &&
        value.questions.every(
          (item) =>
            isRecord(item) &&
            isText(item.id, 120) &&
            isText(item.question, 500) &&
            isText(item.answer),
        )
      );
    case 'contact':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        isText(value.description) &&
        Array.isArray(value.details) &&
        value.details.length <= 20 &&
        value.details.every(
          (item) =>
            isRecord(item) &&
            isText(item.id, 120) &&
            isText(item.label, 240) &&
            isText(item.value, 500) &&
            (item.href === undefined || isSafeHref(item.href)),
        )
      );
    case 'form-intro':
      return isText(value.title, 500) && isText(value.description);
    case 'call-to-action':
      return (
        (value.eyebrow === undefined || isText(value.eyebrow, 240)) &&
        isText(value.title, 500) &&
        (value.description === undefined || isText(value.description)) &&
        Array.isArray(value.actions) &&
        value.actions.length <= 2 &&
        value.actions.every(isAction)
      );
    case 'legal':
      return (
        isText(value.title, 500) &&
        Array.isArray(value.blocks) &&
        value.blocks.length <= 100 &&
        value.blocks.every(
          (block) =>
            isRecord(block) &&
            isText(block.id, 120) &&
            isText(block.heading, 500) &&
            isTextList(block.paragraphs),
        )
      );
    default:
      return false;
  }
};

export function isCmsPageId(value: unknown): value is CmsPageId {
  return typeof value === 'string' && CMS_PAGE_IDS.some((pageId) => pageId === value);
}

export function isCmsPageContent(value: unknown): value is CmsPageContent {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    isCmsPageId(value.pageId) &&
    isCmsSeo(value.seo) &&
    Array.isArray(value.sections) &&
    value.sections.length <= 40 &&
    value.sections.every(isSection) &&
    new Set(value.sections.map((section) => section.id)).size === value.sections.length
  );
}

export function assertCmsPageContent(
  value: unknown,
  expectedPageId?: CmsPageId,
): asserts value is CmsPageContent {
  if (
    !isCmsPageContent(value) ||
    (expectedPageId !== undefined && value.pageId !== expectedPageId)
  ) {
    throw new Error('CMS page content is invalid or does not match the requested page.');
  }
}

export function isCmsDraftPage(value: unknown): value is CmsDraftPage {
  return (
    isCmsPageContent(value) &&
    isRecord(value) &&
    value.createdAt instanceof Timestamp &&
    value.updatedAt instanceof Timestamp &&
    isText(value.updatedBy, 128)
  );
}

export function isCmsPublishedPage(value: unknown): value is CmsPublishedPage {
  return (
    isCmsPageContent(value) &&
    isRecord(value) &&
    getCmsPageMediaReferences(value).every((media) =>
      media.storagePath.startsWith('cms-published/'),
    ) &&
    value.publishedAt instanceof Timestamp &&
    isText(value.publishedBy, 128) &&
    Number.isInteger(value.version) &&
    Number(value.version) > 0
  );
}

export function isCmsSettingsContent(value: unknown): value is CmsSettingsContent {
  if (!isRecord(value) || value.schemaVersion !== 1) return false;
  const { theme, navigation, footer, contact } = value;
  if (!isRecord(theme) || !isRecord(theme.colors) ||
      !isRecord(theme.backgrounds) || !isRecord(theme.buttons) ||
      !isRecord(theme.typography) || !isRecord(theme.layout) ||
      !Array.isArray(navigation) || !isRecord(footer) || !Array.isArray(footer.links) ||
      !isRecord(contact)) return false;

  const color = (candidate: unknown) =>
    typeof candidate === 'string' && /^#[\da-f]{6}$/i.test(candidate);
  const typography = theme.typography;
  const layout = theme.layout;
  return (
    color(theme.colors.primary) &&
    color(theme.colors.dark) &&
    color(theme.colors.light) &&
    color(theme.colors.gold) &&
    color(theme.backgrounds.page) &&
    color(theme.backgrounds.surface) &&
    color(theme.backgrounds.alternate) &&
    color(theme.backgrounds.heroOverlay) &&
    color(theme.buttons.primaryBackground) &&
    color(theme.buttons.primaryText) &&
    color(theme.buttons.secondaryBackground) &&
    color(theme.buttons.secondaryText) &&
    color(theme.buttons.border) &&
    isBoundedNumber(theme.buttons.borderWidthPx, 0, 4) &&
    (typography.bodyFont === 'DM Sans' ||
      typography.bodyFont === 'Arial' ||
      typography.bodyFont === 'system-ui') &&
    (typography.displayFont === 'Barlow Condensed' ||
      typography.displayFont === 'DM Sans' ||
      typography.displayFont === 'Arial') &&
    isBoundedNumber(typography.baseFontSizePx, 14, 20) &&
    isBoundedNumber(typography.headingScale, 1, 1.8) &&
    isBoundedNumber(layout.contentWidthPx, 960, 1600) &&
    isBoundedNumber(layout.sectionSpacingPx, 48, 160) &&
    isBoundedNumber(layout.cardRadiusPx, 0, 32) &&
    isBoundedNumber(layout.buttonRadiusPx, 0, 24) &&
    navigation.length <= 20 &&
    navigation.every(
      (item) =>
        isRecord(item) &&
        isText(item.id, 120) &&
        isText(item.label, 120) &&
        isSafeHref(item.href) &&
        typeof item.visible === 'boolean',
    ) &&
    isText(footer.brandName, 120) &&
    isText(footer.description, 1000) &&
    footer.links.length <= 40 &&
    footer.links.every(
      (item) =>
        isRecord(item) &&
        isText(item.id, 120) &&
        isText(item.label, 120) &&
        isSafeHref(item.href),
    ) &&
    isText(contact.address, 500) &&
    isText(contact.phone, 100) &&
    isText(contact.email, 200) &&
    isText(contact.supportHours, 200)
  );
}

export function assertCmsSettingsContent(
  value: unknown,
): asserts value is CmsSettingsContent {
  if (!isCmsSettingsContent(value)) {
    throw new Error('CMS global settings are invalid.');
  }
}

export function isCmsDraftSettings(value: unknown): value is CmsDraftSettings {
  return (
    isCmsSettingsContent(value) &&
    isRecord(value) &&
    value.createdAt instanceof Timestamp &&
    value.updatedAt instanceof Timestamp &&
    isText(value.updatedBy, 128)
  );
}

export function isCmsPublishedSettings(
  value: unknown,
): value is CmsPublishedSettings {
  return (
    isCmsSettingsContent(value) &&
    isRecord(value) &&
    value.publishedAt instanceof Timestamp &&
    isText(value.publishedBy, 128) &&
    Number.isInteger(value.version) &&
    Number(value.version) > 0
  );
}

export function isCmsMediaAsset(value: unknown): value is CmsMediaAsset {
  return (
    isRecord(value) &&
    isText(value.assetId, 120) &&
    isText(value.storagePath, 500) &&
    value.storagePath.startsWith('cms-drafts/') &&
    isText(value.fileName, 240) &&
    (value.contentType === 'image/jpeg' ||
      value.contentType === 'image/png' ||
      value.contentType === 'image/webp' ||
      value.contentType === 'image/avif' ||
      value.contentType === 'video/mp4' ||
      value.contentType === 'video/webm') &&
    isBoundedNumber(value.sizeBytes, 1, 104857600) &&
    isText(value.altText, 500) &&
    isText(value.uploadedBy, 128) &&
    value.uploadedAt instanceof Timestamp &&
    (value.width === undefined || isBoundedNumber(value.width, 1, 100000)) &&
    (value.height === undefined || isBoundedNumber(value.height, 1, 100000)) &&
    (value.durationMs === undefined ||
      isBoundedNumber(value.durationMs, 0, 86400000))
  );
}

export function isCmsPublishedMedia(value: unknown): value is CmsPublishedMedia {
  return (
    isRecord(value) &&
    isText(value.assetId, 120) &&
    isText(value.storagePath, 500) &&
    Number.isInteger(value.version) &&
    Number(value.version) > 0 &&
    value.storagePath.startsWith(
      `cms-published/${value.assetId}/${value.version}/`,
    ) &&
    isText(value.fileName, 240) &&
    (value.contentType === 'image/jpeg' ||
      value.contentType === 'image/png' ||
      value.contentType === 'image/webp' ||
      value.contentType === 'image/avif' ||
      value.contentType === 'video/mp4' ||
      value.contentType === 'video/webm') &&
    isBoundedNumber(value.sizeBytes, 1, 104857600) &&
    isText(value.altText, 500) &&
    isText(value.uploadedBy, 128) &&
    value.uploadedAt instanceof Timestamp &&
    Number.isInteger(value.version)
  );
}

export function getCmsPageMediaReferences(
  page: CmsPageContent,
): CmsMediaReference[] {
  const media: CmsMediaReference[] = [];
  if (page.seo.socialImage) media.push(page.seo.socialImage);

  for (const section of page.sections) {
    switch (section.type) {
      case 'hero':
        if (section.backgroundImage) media.push(section.backgroundImage);
        if (section.backgroundVideo) media.push(section.backgroundVideo);
        if (section.poster) media.push(section.poster);
        break;
      case 'copy':
        if (section.image) media.push(section.image);
        break;
      case 'cards':
        section.cards.forEach((card) => {
          if (card.image) media.push(card.image);
        });
        break;
    }
  }
  return media;
}

function isCmsSeo(value: unknown): value is CmsPageContent['seo'] {
  return (
    isRecord(value) &&
    isText(value.title, 120) &&
    isText(value.description, 320) &&
    isText(value.canonicalPath, 200) &&
    (value.socialImage === undefined || isMediaReference(value.socialImage))
  );
}

function isBoundedNumber(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
