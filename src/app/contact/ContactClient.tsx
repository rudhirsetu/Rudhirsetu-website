'use client';

import Contact from '../../views/Contact';
import type { ContactSettings } from '../../types/sanity';

export default function ContactClient({ settings }: { settings: ContactSettings | null }) {
  return <Contact settings={settings} />;
}
