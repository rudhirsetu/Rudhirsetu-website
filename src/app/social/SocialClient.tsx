'use client';

import Social from '../../views/Social';
import type { SocialMediaSettings } from '../../types/sanity';

export default function SocialClient({ settings }: { settings: SocialMediaSettings | null }) {
  return <Social settings={settings} />;
}
