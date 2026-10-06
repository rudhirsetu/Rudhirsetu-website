import { motion, MotionConfig } from 'framer-motion';
import { ArrowRight, HandHeart, Heart, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import PreloadLink from '../components/PreloadLink';
import { Accent, Eyebrow, SectionHeader, sectionItemVariants } from '../components/ui/Section';
import ContactRow from '../components/contact/ContactRow';
import LazyMap from '../components/contact/LazyMap';
import type { ContactSettings } from '../types/sanity';

interface ContactProps {
  settings: ContactSettings | null;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = sectionItemVariants;

const Contact = ({ settings }: ContactProps) => {
  const phone = settings?.phone;
  const email = settings?.email;
  const address = settings?.address;
  const hasDetails = Boolean(phone || email || address);

  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s+/g, ' ').trim())}`
    : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip bg-white">
        {/* Header + details + map */}
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
              icon={MessageSquare}
              eyebrow="Contact us"
              title={
                <>
                  Get in <Accent>touch</Accent>
                </>
              }
              description="Reach out to learn more about our services, volunteer opportunities, or how you can support our cause."
            />

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="flex flex-col gap-8 lg:col-span-5">
                {/* Contact ledger */}
                <motion.div variants={itemVariants}>
                  <h2 className="sr-only">Contact information</h2>
                  {hasDetails ? (
                    <ul className="border-t border-red-900/10">
                      {phone && (
                        <ContactRow icon={Phone} label="Call us" href={`tel:${phone}`}>
                          {phone}
                        </ContactRow>
                      )}
                      {email && (
                        <ContactRow icon={Mail} label="Email us" href={`mailto:${email}`}>
                          {email}
                        </ContactRow>
                      )}
                      {address && (
                        <ContactRow icon={MapPin} label="Visit us" href={directionsUrl} external>
                          {address}
                        </ContactRow>
                      )}
                    </ul>
                  ) : (
                    <div className="border-t border-red-900/10 py-6">
                      <p className="font-medium text-gray-900">Contact details are unavailable right now.</p>
                      <p className="mt-1 text-sm text-gray-500">Please try again in a little while.</p>
                    </div>
                  )}
                </motion.div>

                {/* Emergency helpline */}
                {phone && (
                  <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-3xl bg-red-950 p-7 text-white sm:p-8"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 bg-[radial-gradient(closest-side,rgba(220,38,38,0.4),transparent)]"
                    />
                    <div className="relative">
                      <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
                        </span>
                        24/7 helpline
                      </p>
                      <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        Emergency contact
                      </h2>
                      <p className="mt-3 leading-relaxed text-white/70">
                        For emergency blood requirements or immediate assistance, please contact our 24/7 helpline.
                      </p>
                      <a
                        href={`tel:${phone}`}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-red-900 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        Call {phone}
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Map */}
              <motion.div variants={itemVariants} className="lg:col-span-7">
                <LazyMap src={settings?.googleMapsUrl} title="Rudhirsetu Seva Sanstha location" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Write to us */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="bg-paper px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <motion.div
              variants={itemVariants}
              className="group flex items-center justify-center rounded-3xl border border-red-900/10 bg-white p-8 sm:p-12 lg:col-span-5"
            >
              <img
                src="/images/illustrations/contact.webp"
                alt=""
                aria-hidden="true"
                width={715}
                height={579}
                loading="lazy"
                decoding="async"
                className="h-auto w-full max-w-[18rem] drop-shadow-[0_20px_24px_rgba(127,29,29,0.22)] transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-105"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-7">
              <Eyebrow icon={HandHeart}>Volunteer and partner</Eyebrow>
              <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Prefer to <Accent>write</Accent> to us?
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                Tell us how you would like to get involved, whether that is volunteering, partnering with us or
                supporting our camps and programmes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="group/cta inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email us
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                  </a>
                )}
                <PreloadLink
                  href="/donations"
                  priority="medium"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-red-900/15 bg-white px-6 py-3.5 font-semibold text-gray-900 transition-colors hover:bg-red-50"
                >
                  Donate now
                  <Heart className="h-4 w-4 text-red-700" />
                </PreloadLink>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </MotionConfig>
  );
};

export default Contact;
