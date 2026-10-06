import type { CSSProperties, ReactNode } from 'react';
import type { LoadedImage } from './assets';
import { BODY_STACK, DISPLAY_STACK, SCRIPT_STACK } from './fonts';
import type { HeadlineWord, OgPreset } from './presets';

/**
 * Satori (the engine behind ImageResponse) only understands a subset of CSS:
 * flexbox layout, and every element with more than one child needs `display: flex`.
 * The look follows docs/DESIGN.md: deep maroon surface with a soft crimson glow,
 * hairline rules, a big Bricolage Grotesque headline and one Pacifico accent word.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const PAD_X = 64;
const PAD_Y = 52;
const MAROON = '#450a0a'; // red-950
const ACCENT = '#fecaca'; // red-200, for the script word on maroon
const HAIRLINE = 'rgba(255,255,255,0.18)';
const MUTED = 'rgba(255,255,255,0.62)';

const LOGO_HEIGHT = 108;

/** Fits an image inside a box, keeping its aspect ratio. */
function fit(image: LoadedImage, maxWidth: number, maxHeight: number) {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  return { width: Math.round(image.width * scale), height: Math.round(image.height * scale) };
}

function Canvas({ children, glow }: { children: ReactNode; glow: { x: number; y: number } }) {
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: MAROON,
        fontFamily: BODY_STACK,
        color: '#ffffff',
      }}
    >
      {/* Soft crimson glow behind the illustration / photo. */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          backgroundImage: `radial-gradient(ellipse 560px 460px at ${glow.x}px ${glow.y}px, rgba(220,38,38,0.48), rgba(220,38,38,0))`,
        }}
      />
      {children}
    </div>
  );
}

function Content({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        padding: `${PAD_Y}px ${PAD_X}px`,
      }}
    >
      {children}
    </div>
  );
}

function Logo({ logo }: { logo: LoadedImage | null }) {
  if (!logo) {
    return <div style={{ display: 'flex', height: LOGO_HEIGHT }} />;
  }
  const size = fit(logo, 400, LOGO_HEIGHT);
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: LOGO_HEIGHT }}>
      <img src={logo.src} width={size.width} height={size.height} alt="" />
    </div>
  );
}

function Footer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', width: '100%', height: 1, backgroundColor: HAIRLINE }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          fontSize: 19,
          fontWeight: 600,
          color: MUTED,
        }}
      >
        <div style={{ display: 'flex', textTransform: 'uppercase', letterSpacing: 3 }}>
          Rudhirsetu Seva Sanstha · Since 2010
        </div>
        <div style={{ display: 'flex', letterSpacing: 1 }}>rudhirsetu.org</div>
      </div>
    </div>
  );
}

function headlineSize(chars: number): number {
  if (chars <= 12) return 104;
  if (chars <= 18) return 92;
  if (chars <= 24) return 84;
  if (chars <= 32) return 68;
  return 62;
}

function Headline({ words, maxWidth }: { words: HeadlineWord[]; maxWidth: number }) {
  const size = headlineSize(words.map((word) => word.text).join(' ').length);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        maxWidth,
        fontFamily: DISPLAY_STACK,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.04,
        letterSpacing: -size * 0.025,
        color: '#ffffff',
      }}
    >
      {words.map((word, index) => {
        const style: CSSProperties = { display: 'flex', marginRight: Math.round(size * 0.24) };
        if (word.accent) {
          Object.assign(style, { fontFamily: SCRIPT_STACK, fontWeight: 400, letterSpacing: 0, color: ACCENT });
        }
        return (
          <div key={`${word.text}-${index}`} style={style}>
            {word.text}
          </div>
        );
      })}
    </div>
  );
}

/** Share image for a preset page: logo, headline with script accent, subtitle and an illustration. */
export function PresetCard({
  preset,
  logo,
  illustration,
}: {
  preset: OgPreset;
  logo: LoadedImage | null;
  illustration: LoadedImage | null;
}) {
  const art = illustration ? fit(illustration, 400, 400) : null;
  return (
    <Canvas glow={{ x: 900, y: 300 }}>
      {illustration && art && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: 92,
            top: Math.round((OG_HEIGHT - art.height) / 2) - 8,
          }}
        >
          <img src={illustration.src} width={art.width} height={art.height} alt="" />
        </div>
      )}
      <Content>
        <Logo logo={logo} />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <Headline words={preset.headline} maxWidth={640} />
          <div
            style={{
              display: 'flex',
              marginTop: 40,
              maxWidth: 560,
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.74)',
            }}
          >
            {preset.subtitle}
          </div>
        </div>
        <Footer />
      </Content>
    </Canvas>
  );
}

// Lucide-style line icons, as data URLs (Satori renders <img> data URLs reliably).
function iconUrl(paths: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
const CALENDAR_ICON = iconUrl(
  '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
);
const MAP_PIN_ICON = iconUrl(
  '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
);

function DetailRow({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={icon} width={34} height={34} alt="" />
      <div
        style={{
          display: 'block',
          marginLeft: 16,
          fontSize: 27,
          fontWeight: 600,
          lineHeight: 1.25,
          color: 'rgba(255,255,255,0.88)',
          lineClamp: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: 'upcoming' | 'completed' }) {
  const upcoming = status === 'upcoming';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: '9px 20px 9px 16px',
        borderRadius: 999,
        border: `1px solid ${upcoming ? 'rgba(254,202,202,0.55)' : 'rgba(255,255,255,0.28)'}`,
        backgroundColor: upcoming ? 'rgba(220,38,38,0.35)' : 'rgba(255,255,255,0.08)',
        fontSize: 19,
        fontWeight: 600,
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        color: upcoming ? '#ffffff' : 'rgba(255,255,255,0.8)',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 10,
          height: 10,
          marginRight: 12,
          borderRadius: 999,
          backgroundColor: upcoming ? '#fca5a5' : 'rgba(255,255,255,0.5)',
        }}
      />
      {upcoming ? 'Upcoming' : 'Completed'}
    </div>
  );
}

function eventTitleSize(chars: number): number {
  if (chars <= 18) return 78;
  if (chars <= 30) return 68;
  if (chars <= 44) return 60;
  return 54;
}

const PHOTO_FRAME = 10; // padding between the frame and the photo
const PHOTO_BORDER = 1;
/** The photo is the biggest part of the image, so its pixel area is capped to keep the file small. */
const PHOTO_AREA = 185_000;
/** Largest photo, so the framed photo stays clear of the footer rule. */
const PHOTO_MAX_WIDTH = 440;
const PHOTO_MAX_HEIGHT = 380;
const TEXT_COLUMN_WIDTH = 596;

/**
 * Size to request and draw an event photo at, for a source aspect ratio (width / height).
 * Aspect ratios are clamped so very wide or tall images are cropped instead of becoming slivers,
 * and the requested size keeps the (clamped) aspect ratio exactly, so nothing else is cropped.
 */
export function eventPhotoSize(aspect: number): { width: number; height: number } {
  const clamped = Math.min(1.4, Math.max(0.72, Number.isFinite(aspect) && aspect > 0 ? aspect : 1));
  let width = Math.min(PHOTO_MAX_WIDTH, Math.sqrt(PHOTO_AREA * clamped));
  let height = width / clamped;
  if (height > PHOTO_MAX_HEIGHT) {
    height = PHOTO_MAX_HEIGHT;
    width = height * clamped;
  }
  return { width: Math.round(width), height: Math.round(height) };
}

/** Share image for one event: status, title, IST date and place, plus its photo (or an illustration). */
export function EventCard({
  title,
  status,
  dateLine,
  location,
  photo,
  illustration,
  logo,
}: {
  title: string;
  status: 'upcoming' | 'completed';
  dateLine: string;
  location: string;
  /** The event photo as a `data:` URL, already sized to `width` x `height` (see `eventPhotoSize`). */
  photo: { src: string; width: number; height: number } | null;
  illustration: LoadedImage | null;
  logo: LoadedImage | null;
}) {
  const art = illustration ? fit(illustration, 400, 400) : null;
  const titleSize = eventTitleSize(title.length);

  return (
    <Canvas glow={{ x: 940, y: 315 }}>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          right: PAD_X,
          height: OG_HEIGHT,
          alignItems: 'center',
        }}
      >
        {photo ? (
          <div
            style={{
              display: 'flex',
              padding: PHOTO_FRAME,
              borderRadius: 34,
              border: `${PHOTO_BORDER}px solid rgba(255,255,255,0.22)`,
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <img src={photo.src} width={photo.width} height={photo.height} style={{ borderRadius: 24 }} alt="" />
          </div>
        ) : (
          illustration && art && <img src={illustration.src} width={art.width} height={art.height} alt="" />
        )}
      </div>
      <Content>
        <div style={{ display: 'flex', alignItems: 'center', width: TEXT_COLUMN_WIDTH }}>
          <Logo logo={logo} />
          <div style={{ display: 'flex', marginLeft: 36 }}>
            <StatusPill status={status} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: TEXT_COLUMN_WIDTH }}>
          <div
            style={{
              display: 'block',
              fontFamily: DISPLAY_STACK,
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: -titleSize * 0.025,
              color: '#ffffff',
              lineClamp: 3,
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30, gap: 12 }}>
            {dateLine && <DetailRow icon={CALENDAR_ICON}>{dateLine}</DetailRow>}
            {location && <DetailRow icon={MAP_PIN_ICON}>{location}</DetailRow>}
          </div>
        </div>
        <Footer />
      </Content>
    </Canvas>
  );
}
