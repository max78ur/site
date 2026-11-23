import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
import type { CmsMediaAsset, CmsMediaReference } from '@/lib/cms/types';

export function CmsPageTitle({
  eyebrow = 'Website management',
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {actions}
    </div>
  );
}

export function CmsPanel({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <div className="mb-5">
        <h2 className="font-bold text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function CmsField({
  label,
  value,
  onChange,
  hint,
  multiline = false,
  type = 'text',
  min,
  max,
  step,
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  hint?: string;
  multiline?: boolean;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}) {
  const classes =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-600 focus:ring-2 focus:ring-red-100';
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-800">
      {label}
      {multiline ? (
        <textarea
          className={`${classes} min-h-24 resize-y`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
        />
      ) : (
        <input
          className={classes}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          min={min}
          max={max}
          step={step}
          required={required}
        />
      )}
      {hint && <span className="text-xs font-normal leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

export function CmsSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-800">
      {label}
      <select
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CmsFeedback({
  message,
  variant = 'error',
}: {
  message: string;
  variant?: 'error' | 'success' | 'info';
}) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle;
  const colors =
    variant === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : variant === 'info'
        ? 'border-blue-200 bg-blue-50 text-blue-900'
        : 'border-red-200 bg-red-50 text-red-900';
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm ${colors}`}>
      <Icon aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
      <span className="leading-5">{message}</span>
    </div>
  );
}

export function CmsButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
}) {
  const colors =
    variant === 'primary'
      ? 'bg-red-700 text-white hover:bg-red-800'
      : variant === 'danger'
        ? 'border border-red-200 bg-red-50 text-red-800 hover:bg-red-100'
        : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-55 ${colors}`}
    >
      {children}
    </button>
  );
}

export function CmsLoading() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
      <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
      Loading CMS content…
    </div>
  );
}

export function mediaReference(asset: CmsMediaAsset): CmsMediaReference {
  return {
    assetId: asset.assetId,
    storagePath: asset.storagePath,
    contentType: asset.contentType,
    altText: asset.altText,
  };
}

export function CmsMediaPicker({
  label,
  assets,
  value,
  onChange,
  accept = 'all',
}: {
  label: string;
  assets: CmsMediaAsset[];
  value?: CmsMediaReference;
  onChange: (value: CmsMediaReference | undefined) => void;
  accept?: 'all' | 'image' | 'video';
}) {
  const filtered = assets.filter((asset) =>
    accept === 'all' ||
    (accept === 'image' && asset.contentType.startsWith('image/')) ||
    (accept === 'video' && asset.contentType.startsWith('video/')),
  );
  const currentId = value?.assetId ?? '';
  const selectedAsset = filtered.find((asset) => asset.assetId === currentId);
  const referenceIsStale =
    !!value &&
    !!selectedAsset &&
    value.storagePath !== selectedAsset.storagePath;
  return (
    <div className="grid gap-2">
      <CmsSelect
        label={label}
        value={currentId}
        onChange={(assetId) => {
          const asset = filtered.find((item) => item.assetId === assetId);
          onChange(asset ? mediaReference(asset) : undefined);
        }}
        options={[
          { value: '', label: 'No media selected' },
          ...filtered.map((asset) => ({
            value: asset.assetId,
            label: `${asset.fileName} · ${asset.contentType}`,
          })),
        ]}
      />
      {filtered.length === 0 && (
        <p className="text-xs leading-5 text-slate-500">
          No published media of this type. Upload and publish media in the Media Library first.
        </p>
      )}
      {referenceIsStale && selectedAsset && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
          A newer published version of this asset is available.
          <button
            type="button"
            className="ml-2 font-bold underline"
            onClick={() => onChange(mediaReference(selectedAsset))}
          >
            Use latest version
          </button>
        </div>
      )}
      {value && (
        <CmsField
          label="Alternative text"
          value={value.altText}
          onChange={(altText) => onChange({ ...value, altText })}
        />
      )}
    </div>
  );
}

