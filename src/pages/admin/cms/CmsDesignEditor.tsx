import { Brush, Save, Send } from 'lucide-react';
import type { CmsDesignSettings } from '@/lib/cms/types';
import { CmsButton, CmsFeedback, CmsField, CmsLoading, CmsPageTitle, CmsPanel } from './CmsUi';
import { useCmsSettingsDraft } from './useCmsSettingsDraft';

export default function CmsDesignEditor() {
  const draft = useCmsSettingsDraft();
  if (draft.loading) return <CmsLoading />;
  if (!draft.content) return <CmsFeedback message={`Global settings draft could not be loaded: ${draft.error}`} />;

  const theme = draft.content.theme;
  const updateTheme = (next: CmsDesignSettings) =>
    draft.setContent({ ...draft.content!, theme: next });
  const updateColor = (key: keyof CmsDesignSettings['colors'], value: string) =>
    updateTheme({ ...theme, colors: { ...theme.colors, [key]: value } });
  const updateBackground = (
    key: keyof CmsDesignSettings['backgrounds'],
    value: string,
  ) => updateTheme({ ...theme, backgrounds: { ...theme.backgrounds, [key]: value } });
  const updateButtonColor = (
    key: Exclude<keyof CmsDesignSettings['buttons'], 'borderWidthPx'>,
    value: string,
  ) => updateTheme({ ...theme, buttons: { ...theme.buttons, [key]: value } });
  const updateButtonBorderWidth = (borderWidthPx: number) =>
    updateTheme({ ...theme, buttons: { ...theme.buttons, borderWidthPx } });
  const updateBodyFont = (bodyFont: CmsDesignSettings['typography']['bodyFont']) =>
    updateTheme({ ...theme, typography: { ...theme.typography, bodyFont } });
  const updateDisplayFont = (displayFont: CmsDesignSettings['typography']['displayFont']) =>
    updateTheme({ ...theme, typography: { ...theme.typography, displayFont } });
  const updateTypographyNumber = (
    key: 'baseFontSizePx' | 'headingScale',
    value: number,
  ) => updateTheme({ ...theme, typography: { ...theme.typography, [key]: value } });
  const updateLayout = (
    key: keyof CmsDesignSettings['layout'],
    value: number,
  ) => updateTheme({ ...theme, layout: { ...theme.layout, [key]: value } });

  return (
    <div>
      <CmsPageTitle
        title="Design editor"
        description="Set the next CMS theme draft. These settings are stored separately and do not alter public-site styling in this phase."
        actions={
          <div className="flex flex-wrap gap-2">
            <CmsButton variant="secondary" onClick={() => void draft.save()} disabled={draft.busy}><Save size={16} /> Save draft</CmsButton>
            <CmsButton onClick={() => void draft.publish()} disabled={draft.busy}><Send size={16} /> Publish</CmsButton>
          </div>
        }
      />
      {draft.error && <div className="mb-4"><CmsFeedback message={draft.error} /></div>}
      {draft.success && <div className="mb-4"><CmsFeedback message={draft.success} variant="success" /></div>}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]">
        <div className="grid gap-5">
          <CmsPanel title="Brand colors" description="Hex values are validated before saving. Keep gold accents restrained.">
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ['primary', 'Primary red'],
                ['dark', 'Deep black'],
                ['light', 'White'],
                ['gold', 'Metallic gold accent'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <input aria-label={label} type="color" value={theme.colors[key]} onChange={(event) => updateColor(key, event.target.value)} className="h-11 w-14 cursor-pointer rounded border-0 bg-transparent p-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{label}</span>
                    <span className="block text-xs uppercase text-slate-500">{theme.colors[key]}</span>
                  </span>
                </label>
              ))}
            </div>
          </CmsPanel>

          <CmsPanel title="Backgrounds" description="Choose accessible page, surface, alternate-section and hero-overlay colors.">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ['page', 'Page background'],
                ['surface', 'Card / surface background'],
                ['alternate', 'Alternate section background'],
                ['heroOverlay', 'Hero overlay'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <input aria-label={label} type="color" value={theme.backgrounds[key]} onChange={(event) => updateBackground(key, event.target.value)} className="h-11 w-14 cursor-pointer rounded border-0 bg-transparent p-0" />
                  <span><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="text-xs uppercase text-slate-500">{theme.backgrounds[key]}</span></span>
                </label>
              ))}
            </div>
          </CmsPanel>

          <CmsPanel title="Button styles" description="Set primary and secondary button colors and border treatment.">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ['primaryBackground', 'Primary background'],
                ['primaryText', 'Primary text'],
                ['secondaryBackground', 'Secondary background'],
                ['secondaryText', 'Secondary text'],
                ['border', 'Button border'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <input aria-label={label} type="color" value={theme.buttons[key]} onChange={(event) => updateButtonColor(key, event.target.value)} className="h-11 w-14 cursor-pointer rounded border-0 bg-transparent p-0" />
                  <span><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="text-xs uppercase text-slate-500">{theme.buttons[key]}</span></span>
                </label>
              ))}
              <CmsField label="Border width (px)" type="number" min={0} max={4} step={1} value={theme.buttons.borderWidthPx} onChange={(value) => updateButtonBorderWidth(Number(value))} />
            </div>
          </CmsPanel>

          <CmsPanel title="Typography">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium text-slate-800">
                Body font
                <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5" value={theme.typography.bodyFont} onChange={(event) => {
                  const value = event.target.value;
                  if (value === 'DM Sans' || value === 'Arial' || value === 'system-ui') updateBodyFont(value);
                }}>
                  <option>DM Sans</option><option>Arial</option><option>system-ui</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-800">
                Display font
                <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5" value={theme.typography.displayFont} onChange={(event) => {
                  const value = event.target.value;
                  if (value === 'Barlow Condensed' || value === 'DM Sans' || value === 'Arial') updateDisplayFont(value);
                }}>
                  <option>Barlow Condensed</option><option>DM Sans</option><option>Arial</option>
                </select>
              </label>
              <CmsField label="Base font size (px)" type="number" min={14} max={20} value={theme.typography.baseFontSizePx} onChange={(value) => updateTypographyNumber('baseFontSizePx', Number(value))} />
              <CmsField label="Heading scale" type="number" min={1} max={1.8} step={0.05} value={theme.typography.headingScale} onChange={(value) => updateTypographyNumber('headingScale', Number(value))} />
            </div>
          </CmsPanel>

          <CmsPanel title="Layout and shape">
            <div className="grid gap-4 sm:grid-cols-2">
              <CmsField label="Content width (px)" type="number" min={960} max={1600} step={16} value={theme.layout.contentWidthPx} onChange={(value) => updateLayout('contentWidthPx', Number(value))} />
              <CmsField label="Section spacing (px)" type="number" min={48} max={160} step={4} value={theme.layout.sectionSpacingPx} onChange={(value) => updateLayout('sectionSpacingPx', Number(value))} />
              <CmsField label="Card corner radius (px)" type="number" min={0} max={32} value={theme.layout.cardRadiusPx} onChange={(value) => updateLayout('cardRadiusPx', Number(value))} />
              <CmsField label="Button corner radius (px)" type="number" min={0} max={24} value={theme.layout.buttonRadiusPx} onChange={(value) => updateLayout('buttonRadiusPx', Number(value))} />
            </div>
          </CmsPanel>
        </div>

        <CmsPanel title="Draft style preview" description="A local preview of the saved settings values. This does not update the public website.">
          <div className="overflow-hidden rounded-2xl border border-slate-200" style={{ backgroundColor: theme.backgrounds.page, color: theme.colors.dark }}>
            <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ backgroundColor: theme.colors.dark, color: theme.colors.light }}>
              <strong>TruckAxic.</strong>
              <span className="text-xs">Services　 About　 Contact</span>
            </div>
            <div className="p-5" style={{ fontFamily: theme.typography.bodyFont, fontSize: `${theme.typography.baseFontSizePx}px` }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.colors.gold }}>Premium logistics</span>
              <h2 className="mt-2 text-3xl font-bold" style={{ color: theme.colors.dark, fontFamily: theme.typography.displayFont, transform: `scale(${theme.typography.headingScale})`, transformOrigin: 'left' }}>Moving business forward.</h2>
              <p className="mt-3 text-sm text-slate-600">Theme settings are staged in this draft until a CMS integration phase applies them to the live pages.</p>
              <span className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-bold" style={{ backgroundColor: theme.buttons.primaryBackground, color: theme.buttons.primaryText, borderRadius: theme.layout.buttonRadiusPx, border: `${theme.buttons.borderWidthPx}px solid ${theme.buttons.border}` }}>
                <Brush size={15} /> Preview button
              </span>
              <span className="ml-2 mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-bold" style={{ backgroundColor: theme.buttons.secondaryBackground, color: theme.buttons.secondaryText, borderRadius: theme.layout.buttonRadiusPx, border: `${theme.buttons.borderWidthPx}px solid ${theme.buttons.border}` }}>
                Secondary action
              </span>
              <div className="mt-5 rounded-xl border border-slate-200 p-4" style={{ borderRadius: theme.layout.cardRadiusPx, backgroundColor: theme.backgrounds.surface }}>
                <span className="font-semibold">Service card</span>
                <span className="ml-2 text-xs" style={{ color: theme.colors.gold }}>Premium accent</span>
              </div>
            </div>
          </div>
        </CmsPanel>
      </div>
    </div>
  );
}

