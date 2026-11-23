import type { CSSProperties } from 'react';
import type { CmsDesignSettings } from './types';

type CmsThemeStyle = CSSProperties & {
  [key: `--${string}`]: string | number;
};

const bodyFonts: Record<CmsDesignSettings['typography']['bodyFont'], string> = {
  'DM Sans': '"DM Sans", "Segoe UI", Arial, sans-serif',
  Arial: 'Arial, sans-serif',
  'system-ui': 'system-ui, sans-serif',
};

const displayFonts: Record<CmsDesignSettings['typography']['displayFont'], string> = {
  'Barlow Condensed': '"Barlow Condensed", "Arial Narrow", sans-serif',
  'DM Sans': '"DM Sans", "Segoe UI", Arial, sans-serif',
  Arial: 'Arial, sans-serif',
};

export function getCmsThemeStyle(theme: CmsDesignSettings): CmsThemeStyle {
  return {
    backgroundColor: theme.backgrounds.page,
    '--primary-red': theme.colors.primary,
    '--deep-red': theme.colors.primary,
    '--black': theme.colors.dark,
    '--white': theme.colors.light,
    '--surface': theme.backgrounds.surface,
    '--metallic-gold': theme.colors.gold,
    '--cms-text-color': theme.colors.dark,
    '--cms-accent-color': theme.colors.primary,
    '--cms-premium-accent-color': theme.colors.gold,
    '--cms-page-background': theme.backgrounds.page,
    '--cms-alternate-background': theme.backgrounds.alternate,
    '--cms-hero-overlay': theme.backgrounds.heroOverlay,
    '--cms-button-primary': theme.buttons.primaryBackground,
    '--cms-button-hover': theme.colors.primary,
    '--cms-button-secondary': theme.buttons.secondaryBackground,
    '--cms-primary-button-text': theme.buttons.primaryText,
    '--cms-secondary-button-text': theme.buttons.secondaryText,
    '--cms-button-border': theme.buttons.border,
    '--cms-button-border-width': `${theme.buttons.borderWidthPx}px`,
    '--cms-primary-button-background': theme.buttons.primaryBackground,
    '--cms-secondary-button-background': theme.buttons.secondaryBackground,
    '--cms-body-font': bodyFonts[theme.typography.bodyFont],
    '--cms-heading-font': displayFonts[theme.typography.displayFont],
    '--cms-display-font': displayFonts[theme.typography.displayFont],
    '--cms-base-font-size': `${theme.typography.baseFontSizePx}px`,
    '--cms-heading-scale': theme.typography.headingScale,
    '--cms-content-width': `${theme.layout.contentWidthPx}px`,
    '--cms-section-spacing': `${theme.layout.sectionSpacingPx}px`,
    '--cms-card-radius': `${theme.layout.cardRadiusPx}px`,
    '--cms-button-radius': `${theme.layout.buttonRadiusPx}px`,
  };
}

