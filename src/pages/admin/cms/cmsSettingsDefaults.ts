import type { CmsSettingsContent } from '@/lib/cms/types';

export function createCurrentSiteSettingsDraft(): CmsSettingsContent {
  return {
    schemaVersion: 1,
    theme: {
      colors: {
        primary: '#d71920',
        dark: '#08090b',
        light: '#ffffff',
        gold: '#c4a66a',
      },
      backgrounds: {
        page: '#ffffff',
        surface: '#f4f4f2',
        alternate: '#ffffff',
        heroOverlay: '#08090b',
      },
      buttons: {
        primaryBackground: '#d71920',
        primaryText: '#ffffff',
        secondaryBackground: '#08090b',
        secondaryText: '#ffffff',
        border: '#ffffff',
        borderWidthPx: 1,
      },
      typography: {
        bodyFont: 'DM Sans',
        displayFont: 'Barlow Condensed',
        baseFontSizePx: 16,
        headingScale: 1.15,
      },
      layout: {
        contentWidthPx: 1280,
        sectionSpacingPx: 96,
        cardRadiusPx: 8,
        buttonRadiusPx: 6,
      },
    },
    navigation: [
      { id: 'home', label: 'Home', href: '/', visible: true },
      { id: 'about', label: 'About Us', href: '/about', visible: true },
      { id: 'how-it-works', label: 'How It Works', href: '/how-it-works', visible: true },
      { id: 'services', label: 'Services', href: '/services', visible: true },
      { id: 'faq', label: 'FAQ', href: '/faq', visible: true },
      { id: 'contact', label: 'Talk to dispatch', href: '/contact', visible: true },
      { id: 'carrier-signup', label: 'Carrier signup', href: '/carrier-signup', visible: true },
    ],
    footer: {
      brandName: 'TruckAxic',
      description:
        'Premium US truck dispatch and logistics services. Moving America forward, one load at a time.',
      links: [
        { id: 'about', label: 'About TruckAxic', href: '/about' },
        { id: 'how-it-works', label: 'How It Works', href: '/how-it-works' },
        { id: 'carrier-signup', label: 'Carrier signup', href: '/carrier-signup' },
        { id: 'faq', label: 'Frequently asked questions', href: '/faq' },
        { id: 'contact', label: 'Contact', href: '/contact' },
        { id: 'dry-van', label: 'Dry Van', href: '/services/dry-van' },
        { id: 'reefer', label: 'Reefer', href: '/services/reefer' },
        { id: 'flatbed', label: 'Flatbed', href: '/services/flatbed' },
        { id: 'power-only', label: 'Power Only', href: '/services/power-only' },
        { id: 'privacy-policy', label: 'Privacy Policy', href: '/privacy-policy' },
        { id: 'terms', label: 'Terms & Conditions', href: '/terms' },
        { id: 'cookie-policy', label: 'Cookie Policy', href: '/cookie-policy' },
        { id: 'disclaimer', label: 'Disclaimer', href: '/disclaimer' },
        { id: 'service-agreement', label: 'Service Agreement', href: '/service-agreement' },
        {
          id: 'refund-cancellation-policy',
          label: 'Refund & Cancellation Policy',
          href: '/refund-cancellation-policy',
        },
        {
          id: 'accessibility-statement',
          label: 'Accessibility Statement',
          href: '/accessibility-statement',
        },
        { id: 'data-security', label: 'Data Security', href: '/data-security' },
        {
          id: 'report-security-issue',
          label: 'Report a Security Issue',
          href: '/report-security-issue',
        },
      ],
    },
    contact: {
      address: '[Add verified business address]',
      phone: '[Add verified business phone]',
      email: '[Add verified business email]',
      supportHours: '[Add verified support hours]',
    },
  };
}

