import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isSanityTag, SANITY_TAGS, type SanityTag } from '../../../lib/sanity-cache';

/**
 * Webhook endpoint for Sanity to trigger on-demand revalidation.
 *
 * Setup in Sanity (Studio > API > Webhooks):
 * 1. URL: https://your-domain.com/api/revalidate
 * 2. Dataset: production (or your dataset)
 * 3. Trigger on: Create, Update, Delete
 * 4. Filter: _type in ["event", "galleryImage", "contactSettings", "socialMediaSettings", "donationSettings"]
 * 5. Projection: {_id, _type}
 * 6. Secret: set the same value as SANITY_REVALIDATE_SECRET in the hosting env vars.
 *    Sanity signs the body (`sanity-webhook-signature` header); a plain secret
 *    sent as `Authorization: Bearer <secret>`, `x-sanity-secret` or
 *    `x-webhook-secret`, or as `secret` in the JSON body, is accepted too.
 *
 * Every request must carry a valid secret; requests without one are rejected.
 * Pages and fetches are cached with a tag per Sanity `_type`, so
 * `revalidateTag(_type)` is what refreshes them.
 */

// Responses must never be cached by a CDN or the browser.
const NO_STORE = { 'Cache-Control': 'no-store' } as const;

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: NO_STORE });

/** Constant-time string comparison (hashes first so lengths never leak). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Validates Sanity's `sanity-webhook-signature: t=<ts>,v1=<base64url hmac>` header. */
function isValidSanitySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((part) => {
      const index = part.indexOf('=');
      return [part.slice(0, index).trim(), part.slice(index + 1).trim()];
    }),
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('base64url');
  return safeEqual(signature, expected);
}

/** Pulls a plain shared secret out of the request headers. */
function secretFromHeaders(request: NextRequest): string | null {
  const custom = request.headers.get('x-sanity-secret') || request.headers.get('x-webhook-secret');
  if (custom) return custom;
  const auth = request.headers.get('authorization');
  return auth?.startsWith('Bearer ') ? auth.substring(7) : null;
}

/** Purges everything cached for a Sanity document type (and the pages that show it). */
function revalidateType(type: SanityTag, id?: string): string[] {
  const paths: string[] = [];

  // Immediate expiry: editors expect to see their change on the next page load.
  revalidateTag(type, { expire: 0 });

  switch (type) {
    case SANITY_TAGS.event:
      if (id) {
        revalidateTag(`event-${id}`, { expire: 0 });
        // The event's share image (event/[id]/opengraph-image) uses the same tags, so it refreshes too.
        paths.push(`/event/${id}`);
      }
      paths.push('/camp', '/');
      break;
    case SANITY_TAGS.galleryImage:
      paths.push('/gallery', '/');
      break;
    case SANITY_TAGS.contactSettings:
      // Shown on the home page, the contact page and in the footer.
      paths.push('/contact', '/');
      break;
    case SANITY_TAGS.socialMediaSettings:
      paths.push('/social');
      break;
    case SANITY_TAGS.donationSettings:
      paths.push('/donations');
      break;
  }

  for (const path of paths) revalidatePath(path);
  return paths;
}

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
    if (!expectedSecret) {
      console.error('SANITY_REVALIDATE_SECRET is not set in environment variables');
      return json({ error: 'Server configuration error' }, 500);
    }

    const rawBody = await request.text();

    // 1) Sanity's signed webhook, or 2) a plain shared secret in a header.
    let authorised = isValidSanitySignature(
      rawBody,
      request.headers.get('sanity-webhook-signature'),
      expectedSecret,
    );
    if (!authorised) {
      const headerSecret = secretFromHeaders(request);
      authorised = headerSecret !== null && safeEqual(headerSecret, expectedSecret);
    }

    let body: { _type?: unknown; _id?: unknown; secret?: unknown } = {};
    try {
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    // 3) Some webhook setups put the secret in the JSON body.
    if (!authorised && typeof body.secret === 'string') {
      authorised = safeEqual(body.secret, expectedSecret);
    }

    if (!authorised) {
      console.warn('Revalidate webhook rejected: missing or invalid secret');
      return json({ error: 'Invalid secret' }, 401);
    }

    const type = body._type;
    const id = typeof body._id === 'string' ? body._id.replace(/^drafts\./, '') : undefined;

    if (!isSanityTag(type)) {
      return json({ revalidated: false, message: `Type ${String(type)} does not require revalidation` });
    }

    const paths = revalidateType(type, id);
    console.log('Revalidated', { type, id, paths });

    return json({
      revalidated: true,
      tag: type,
      paths,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in revalidation webhook:', error);
    return json({ error: 'Error revalidating' }, 500);
  }
}

// Manual trigger: GET /api/revalidate?secret=xxx&type=contactSettings  (or &eventId=xxx)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const eventId = request.nextUrl.searchParams.get('eventId');
  const type = eventId ? SANITY_TAGS.event : request.nextUrl.searchParams.get('type');
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret) {
    return json({ error: 'Server configuration error' }, 500);
  }

  if (!secret || !safeEqual(secret, expectedSecret)) {
    return json({ error: 'Invalid secret' }, 401);
  }

  if (isSanityTag(type)) {
    const paths = revalidateType(type, eventId ?? undefined);
    return json({ revalidated: true, tag: type, paths, timestamp: new Date().toISOString() });
  }

  return json({
    message:
      'Revalidation endpoint. Use POST for webhooks, or GET with ?secret=xxx&type=<event|galleryImage|contactSettings|socialMediaSettings|donationSettings> (or &eventId=xxx) for manual revalidation',
  });
}
