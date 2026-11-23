import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Clock3, ShieldCheck, Truck } from 'lucide-react';
import type { CmsHeroSection } from '@/lib/cms/types';
import { CmsPublicLink } from '@/components/cms/CmsPublicLink';

const heroImage = '/videos/truck-hero-poster.jpg';
const heroVideo = '/videos/truck-hero.mp4';

export default function Hero({
  cmsSection,
  mediaUrls = {},
  showScrollLink = true,
}: {
  cmsSection?: CmsHeroSection;
  mediaUrls?: Record<string, string>;
  showScrollLink?: boolean;
} = {}) {
  const [showVideo, setShowVideo] = useState(false);
  const [showLoopPoster, setShowLoopPoster] = useState(false);
  const [failedCmsVideo, setFailedCmsVideo] = useState('');
  const [failedCmsImage, setFailedCmsImage] = useState('');

  const cmsVideoPath = cmsSection?.backgroundVideo?.storagePath ?? '';
  const cmsPosterPath = cmsSection?.poster?.storagePath ?? '';
  const cmsBackgroundImagePath = cmsSection?.backgroundImage?.storagePath ?? '';
  const cmsPosterUrl =
    cmsSection?.poster && mediaUrls[cmsSection.poster.storagePath];
  const cmsBackgroundImageUrl =
    cmsSection?.backgroundImage &&
    mediaUrls[cmsSection.backgroundImage.storagePath];
  const resolvedCmsVideo =
    cmsSection?.backgroundVideo && mediaUrls[cmsSection.backgroundVideo.storagePath];
  const displayCmsVideo =
    resolvedCmsVideo && failedCmsVideo !== cmsVideoPath ? resolvedCmsVideo : '';
  const displayCmsPoster =
    cmsPosterUrl && failedCmsImage !== cmsPosterPath ? cmsPosterUrl : '';
  const displayCmsBackgroundImage =
    cmsBackgroundImageUrl && failedCmsImage !== cmsBackgroundImagePath
      ? cmsBackgroundImageUrl
      : '';
  const displayCmsImage =
    displayCmsVideo
      ? displayCmsPoster || displayCmsBackgroundImage
      : displayCmsBackgroundImage || displayCmsPoster;
  const videoSource =
    displayCmsVideo ||
    (cmsSection?.backgroundVideo ||
    !displayCmsBackgroundImage
      ? heroVideo
      : '');
  const videoActive = showVideo && Boolean(videoSource);

  useEffect(() => {
    const videoMedia = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    );
    const updateVideoPreference = () => setShowVideo(videoMedia.matches);

    updateVideoPreference();
    videoMedia.addEventListener('change', updateVideoPreference);
    return () => videoMedia.removeEventListener('change', updateVideoPreference);
  }, []);

  useEffect(() => {
    setFailedCmsVideo('');
  }, [resolvedCmsVideo]);

  useEffect(() => {
    setFailedCmsImage('');
  }, [cmsPosterUrl, cmsBackgroundImageUrl]);

  return (
    <section className="hero-shell">
      <img
        className={`hero-photo${showLoopPoster ? ' hero-photo-loop' : ''}${
          !videoActive ? ' hero-photo-fallback' : ''
        }`}
        src={displayCmsImage || heroImage}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        onError={() => {
          if (displayCmsPoster) setFailedCmsImage(cmsPosterPath);
          else if (displayCmsBackgroundImage) {
            setFailedCmsImage(cmsBackgroundImagePath);
          }
        }}
      />
      {videoActive && videoSource && (
        <video
          className={`hero-video${showLoopPoster ? ' hero-video-loop' : ''}`}
          key={videoSource}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={displayCmsImage || heroImage}
          aria-hidden="true"
          onError={() => {
            if (displayCmsVideo) setFailedCmsVideo(cmsVideoPath);
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            const timeRemaining = video.duration - video.currentTime;

            if (timeRemaining <= 0.35) {
              setShowLoopPoster(true);
            } else if (video.currentTime <= 0.35) {
              setShowLoopPoster(false);
            }
          }}
        >
          <source
            src={videoSource}
            type={
              displayCmsVideo
                ? cmsSection?.backgroundVideo?.contentType
                : 'video/mp4'
            }
          />
        </video>
      )}
      <div className="hero-light-streak" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy">
          <span className="eyebrow">
            {cmsSection?.eyebrow?.trim() || 'Built for American carriers'}
          </span>
          {cmsSection?.title?.trim() ? (
            <h1>{cmsSection.title}</h1>
          ) : (
            <h1>
              Moving
              <br />
              America
              <br />
              <span className="text-primary-red">forward.</span>
            </h1>
          )}
          <p>
            {cmsSection?.description?.trim() ||
              'Better loads. Stronger rates. A dispatch partner who keeps your business moving while you focus on the road.'}
          </p>
          <div className="hero-actions">
            {cmsSection?.actions.length ? (
              cmsSection.actions.map((action, index) => (
                <CmsPublicLink
                  key={`${action.href}-${index}`}
                  href={action.href}
                  className={
                    action.style === 'primary'
                      ? 'btn-primary'
                      : action.style === 'secondary'
                        ? 'btn-secondary'
                        : 'btn-secondary hero-text-action'
                  }
                >
                  {action.label}
                  {action.style === 'primary' && <ArrowRight size={18} />}
                </CmsPublicLink>
              ))
            ) : (
              <>
                <CmsPublicLink href="/carrier-signup" className="btn-primary">
                  Get started <ArrowRight size={18} />
                </CmsPublicLink>
                <CmsPublicLink href="/services" className="btn-secondary">
                  Explore our services
                </CmsPublicLink>
              </>
            )}
          </div>
          <div className="hero-proof">
            <div>
              <ShieldCheck size={18} className="text-[#d2b579]" />
              FMCSA registered
            </div>
            <div>
              <Clock3 size={18} className="text-[#d2b579]" />
              24/7 dispatch support
            </div>
            <div>
              <Truck size={18} className="text-[#d2b579]" />
              48-state coverage
            </div>
          </div>
        </div>
      </div>
      {showScrollLink && (
        <a
          href="#home-services"
          className="absolute bottom-8 right-[max(1.5rem,calc((100vw-80rem)/2))] hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white md:flex"
        >
          Discover TruckAxic <ArrowDownRight size={17} />
        </a>
      )}
    </section>
  );
}
