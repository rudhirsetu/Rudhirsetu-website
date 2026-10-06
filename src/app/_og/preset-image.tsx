import { SITE_URL, type OgRoute } from '../../lib/seo';
import { loadIllustration, loadLogo } from './assets';
import { PresetCard } from './card';
import { getOgFonts } from './fonts';
import { OG_PRESETS } from './presets';
import { CACHE_DEGRADED, CACHE_PRESET, bannerResponse, renderImage } from './respond';

/**
 * Builds the default export of a page's `opengraph-image.tsx` for one preset page.
 *
 * Next prerenders these files at build time (the routes have no dynamic input), so crawlers
 * get a ready-made static JPEG with no cold start. The copy and illustration come from
 * `presets.ts`. A page's file only needs:
 *
 *   export const alt = '...';
 *   export const size = { width: 1200, height: 630 };
 *   export const contentType = 'image/jpeg';
 *   export const revalidate = 86400;
 *   export default createPresetImage('camp');
 */
export function createPresetImage(route: OgRoute) {
  return async function PresetImage(): Promise<Response> {
    try {
      const preset = OG_PRESETS[route];
      const text = [...preset.headline.map((word) => word.text), preset.subtitle].join(' ');
      const [{ fonts, degraded }, logo, illustration] = await Promise.all([
        getOgFonts(text, SITE_URL),
        loadLogo(SITE_URL),
        loadIllustration(preset.illustration, SITE_URL),
      ]);

      return await renderImage(
        <PresetCard preset={preset} logo={logo} illustration={illustration} />,
        fonts,
        degraded || !logo || !illustration ? CACHE_DEGRADED : CACHE_PRESET,
      );
    } catch (error) {
      console.error(`Error generating the "${route}" share image:`, error);
      return bannerResponse(SITE_URL);
    }
  };
}
