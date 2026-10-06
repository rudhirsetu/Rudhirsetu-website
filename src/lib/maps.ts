/**
 * Only allow Google Maps embeds into our iframes.
 *
 * The map URL comes from the CMS (contactSettings.googleMapsUrl). Validating it
 * means a mistaken or malicious value can't frame an arbitrary site on ours.
 */
export function safeMapsEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.trim());
    const isGoogle = /^(www\.|maps\.)?google\.[a-z.]{2,6}$/i.test(parsed.hostname);
    const isEmbed =
      parsed.pathname.startsWith('/maps/embed') ||
      (parsed.pathname.startsWith('/maps') && parsed.searchParams.get('output') === 'embed');
    return parsed.protocol === 'https:' && isGoogle && isEmbed ? parsed.toString() : null;
  } catch {
    return null;
  }
}
