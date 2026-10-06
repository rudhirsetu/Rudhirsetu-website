import type { ComponentType } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Droplets,
  Eye,
  HandHeart,
  Heart,
  HeartPulse,
  Landmark,
  QrCode,
  Ribbon,
} from 'lucide-react';
import PreloadLink from '../components/PreloadLink';
import { Accent, Eyebrow, SectionHeader, SectionLink, sectionItemVariants } from '../components/ui/Section';
import { IMPACT } from '../lib/impact';
import DetailRow from '../components/donations/DetailRow';
import UpiPayButton from '../components/donations/UpiPayButton';
import type { DonationSettings } from '../types/sanity';

interface DonationsProps {
  settings: DonationSettings | null;
  /** Pre-sized QR image URL, built on the server so the client bundle stays small. */
  qrCodeUrl?: string | null;
}

type IconType = ComponentType<{ className?: string }>;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = sectionItemVariants;

/** Where the money goes. Only facts already used elsewhere on the site. */
const uses: { title: string; tag: string; description: string; icon: IconType }[] = [
  {
    title: 'Blood donation camps',
    tag: 'Emergency support 24/7',
    description: 'Organising blood donation camps and providing emergency blood support.',
    icon: Droplets,
  },
  {
    title: 'Thalassemia support',
    tag: `${IMPACT.thalassemiaPatients}+ patients`,
    description: 'Free testing camps and comprehensive patient support.',
    icon: HeartPulse,
  },
  {
    title: 'Eye care',
    tag: 'Free for those in need',
    description: 'Free eye checkups, cataract screening and operations.',
    icon: Eye,
  },
  {
    title: 'Cancer awareness',
    tag: 'Cervical and breast cancer',
    description: 'Awareness drives backed by free testing camps.',
    icon: Ribbon,
  },
];

const TileIndex = ({ index, dark = false }: { index: number; dark?: boolean }) => (
  <span className={`text-sm font-semibold tabular-nums ${dark ? 'text-white/50' : 'text-red-700/50'}`}>
    {String(index).padStart(2, '0')}
  </span>
);

const Unavailable = ({ children, hint, dark = false }: { children: string; hint: string; dark?: boolean }) => (
  <div className={`mt-8 border-t py-6 ${dark ? 'border-white/15' : 'border-red-900/10'}`}>
    <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{children}</p>
    <p className={`mt-1 text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>{hint}</p>
  </div>
);

const Donations = ({ settings, qrCodeUrl }: DonationsProps) => {
  const upiEnabled = Boolean(settings?.isUpiEnabled);
  const bankEnabled = Boolean(settings?.isBankEnabled);
  const taxEnabled = Boolean(settings?.isSection80GEnabled);

  const upiId = settings?.upiId;
  const payeeName = settings?.accountName || 'Rudhirsetu Seva Sanstha';
  const upiLink = upiId ? `upi://pay?pa=${encodeURIComponent(upiId).replace(/%40/g, '@')}&pn=${encodeURIComponent(payeeName)}` : null;

  const showUpi = upiEnabled && Boolean(qrCodeUrl || upiId);

  const bankRows = [
    { label: 'Account name', value: settings?.accountName },
    { label: 'Account number', value: settings?.accountNumber },
    { label: 'IFSC code', value: settings?.ifscCode },
    { label: 'Bank & branch', value: settings?.bankAndBranch },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));
  const showBank = bankEnabled && bankRows.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip bg-white">
        {/* Header + payment details */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              as="h1"
              icon={Heart}
              eyebrow="Donate"
              title={
                <>
                  Support our <Accent>cause</Accent>
                </>
              }
              description="Your contribution helps us continue our mission of providing healthcare support and community services to those in need."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:gap-5">
              {/* UPI: dark payment tile with the QR code in a white frame (only when UPI is enabled) */}
              {showUpi && (
                <motion.article
                  variants={itemVariants}
                  className="relative flex flex-col overflow-hidden rounded-3xl bg-red-950 p-7 text-white sm:p-8 md:col-span-6 lg:col-span-5 xl:col-span-4"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] bg-[radial-gradient(closest-side,rgba(220,38,38,0.4),transparent)]"
                  />
                  <div className="relative flex items-center justify-between gap-4">
                    <TileIndex index={1} dark />
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                      <QrCode className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>

                  <h2 className="relative mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    UPI payment
                  </h2>
                  <p className="relative mt-2 text-white/70">Scan to donate via any UPI app.</p>

                  <div className="relative flex flex-1 flex-col">
                    {qrCodeUrl && (
                      <div className="mx-auto mt-6 w-full max-w-[17rem] rounded-3xl bg-white p-4 sm:p-5">
                        <div className="aspect-square w-full">
                          <img
                            src={qrCodeUrl}
                            alt={settings?.qrCodeImage?.alt || 'UPI QR code for donating to Rudhirsetu Seva Sanstha'}
                            width={576}
                            height={576}
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {upiId && (
                      <ul className="mt-6 border-t border-white/15">
                        <DetailRow label="UPI ID" value={upiId} dark />
                      </ul>
                    )}

                    {upiLink && <UpiPayButton href={upiLink} />}
                  </div>
                </motion.article>
              )}

              {/* Bank transfer: ledger of details (always rendered; widens when UPI is off) */}
              <motion.article
                variants={itemVariants}
                className={`flex flex-col rounded-3xl border border-red-900/10 bg-white p-7 sm:p-8 ${
                  showUpi ? 'md:col-span-6 lg:col-span-7 xl:col-span-5' : 'md:col-span-12 xl:col-span-8'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <TileIndex index={showUpi ? 2 : 1} />
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-red-700">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Bank transfer
                </h2>

                {showBank ? (
                  <>
                    <p className="mt-2 text-gray-600">Transfer directly from your bank using these details.</p>
                    <ul className={`mt-6 grid grid-cols-1 border-t border-red-900/10 ${showUpi ? '' : 'sm:grid-cols-2 sm:gap-x-10'}`}>
                      {bankRows.map((row) => (
                        <DetailRow key={row.label} label={row.label} value={row.value} />
                      ))}
                    </ul>
                  </>
                ) : (
                  <Unavailable hint="Please check back later or contact us for assistance.">
                    Bank transfer is temporarily unavailable.
                  </Unavailable>
                )}

                <div className="mt-auto pt-6">
                  {!showUpi && (
                    <p className="mb-4 flex items-start gap-3 rounded-2xl bg-paper p-4 text-sm text-gray-600">
                      <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
                      <span>
                        <span className="font-semibold text-gray-900">UPI payments are temporarily unavailable.</span>{' '}
                        Please use bank transfer instead.
                      </span>
                    </p>
                  )}
                  {showBank && (
                    <p className="text-sm text-gray-500">Tap Copy beside any detail to paste it into your banking app.</p>
                  )}
                </div>
              </motion.article>

              {/* Help: illustration tile */}
              <motion.aside
                variants={itemVariants}
                className={`group flex flex-col items-center gap-6 rounded-3xl bg-paper p-7 sm:flex-row sm:p-8 md:col-span-12 xl:flex-col xl:items-stretch ${
                  showUpi ? 'xl:col-span-3' : 'xl:col-span-4'
                }`}
              >
                <img
                  src="/images/illustrations/donate.webp"
                  alt=""
                  aria-hidden="true"
                  width={557}
                  height={800}
                  decoding="async"
                  className="h-auto w-32 shrink-0 self-center drop-shadow-[0_20px_24px_rgba(127,29,29,0.22)] transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-105 sm:w-36 xl:w-full xl:max-w-[11rem]"
                />
                <div className="xl:mt-auto">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">Need help?</h2>
                  <p className="mt-2 leading-relaxed text-gray-600">
                    For any queries regarding donations or to discuss other ways to support us, please feel free to
                    contact us.
                  </p>
                  <PreloadLink
                    href="/contact"
                    priority="medium"
                    className="group/cta mt-5 inline-flex items-center justify-center gap-2 rounded-md border border-red-900/15 bg-white px-6 py-3.5 font-semibold text-gray-900 transition-colors hover:bg-red-50"
                  >
                    Contact us
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                  </PreloadLink>
                </div>
              </motion.aside>
            </div>
          </div>
        </motion.section>

        {/* Where your donation goes */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="bg-paper px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div variants={itemVariants} className="self-start lg:sticky lg:top-32 lg:col-span-5">
              <Eyebrow icon={HandHeart}>Your impact</Eyebrow>
              <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Where your donation <Accent>goes</Accent>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600 sm:text-xl">
                Your support keeps these programmes running for the community.
              </p>
            </motion.div>

            <ul className="border-t border-red-900/10 lg:col-span-7">
              {uses.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.title}
                    variants={itemVariants}
                    className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-red-900/10 py-8 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6 sm:py-10"
                  >
                    <span className="pt-1.5 text-sm font-semibold tabular-nums text-red-700/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-red-700 sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm font-semibold text-red-700">{item.tag}</p>
                      <p className="mt-3 max-w-md leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                    <span className="hidden h-14 w-14 items-center justify-center rounded-full border border-red-900/10 bg-white text-red-700/60 transition-colors duration-300 group-hover:border-red-700 group-hover:bg-red-700 group-hover:text-white sm:flex">
                      <Icon className="h-6 w-6" />
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </motion.section>

        {/* Tax benefits */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              icon={BadgeCheck}
              eyebrow="Section 80G"
              title={
                <>
                  Tax <Accent>benefits</Accent>
                </>
              }
              description={
                taxEnabled
                  ? 'All donations to Rudhirsetu Seva Sanstha are eligible for tax deduction under Section 80G of the Income Tax Act. You will receive a donation receipt that can be used for tax purposes.'
                  : 'Tax benefit information is currently being updated. Please contact us for the latest information about tax deductions.'
              }
              action={<SectionLink href="/contact">Ask us about tax benefits</SectionLink>}
            />

            {taxEnabled && (settings?.section80GNumber || settings?.taxDeductionPercentage) && (
              <motion.dl variants={itemVariants} className="grid grid-cols-1 border-t border-red-900/10 sm:grid-cols-2">
                {settings?.section80GNumber && (
                  <div className="border-b border-red-900/10 py-8 sm:pr-8">
                    <dt className="text-sm text-gray-500">Section 80G number</dt>
                    <dd className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900 tabular-nums [overflow-wrap:anywhere] sm:text-4xl">
                      {settings.section80GNumber}
                    </dd>
                  </div>
                )}
                {settings?.taxDeductionPercentage ? (
                  <div className="border-b border-red-900/10 py-8 sm:border-l sm:pl-8">
                    <dt className="text-sm text-gray-500">Tax deduction</dt>
                    <dd className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900 tabular-nums sm:text-4xl">
                      {settings.taxDeductionPercentage}%{' '}
                      <span className="font-sans text-lg font-medium tracking-normal text-gray-600">
                        of donation amount
                      </span>
                    </dd>
                  </div>
                ) : null}
              </motion.dl>
            )}
          </div>
        </motion.section>
      </div>
    </MotionConfig>
  );
};

export default Donations;
