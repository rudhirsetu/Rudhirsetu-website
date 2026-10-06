'use client';

import Donations from '../../views/Donations';
import type { DonationSettings } from '../../types/sanity';

interface DonationsClientProps {
  settings: DonationSettings | null;
  qrCodeUrl: string | null;
}

export default function DonationsClient({ settings, qrCodeUrl }: DonationsClientProps) {
  return <Donations settings={settings} qrCodeUrl={qrCodeUrl} />;
}
