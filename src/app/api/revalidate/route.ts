import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Webhook endpoint for Sanity to trigger on-demand revalidation
 * 
 * Setup in Sanity:
 * 1. Go to Sanity Studio > API > Webhooks
 * 2. Create new webhook
 * 3. URL: https://your-domain.com/api/revalidate
 * 4. Dataset: production (or your dataset)
 * 5. Trigger on: Create, Update, Delete
 * 6. Filter: _type == "event"
 * 7. Secret: Set a secret and add it to Vercel env vars as SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    // Sanity webhooks can send secret in Authorization header or custom header
    const authHeader = request.headers.get('authorization');
    const customSecret = request.headers.get('x-sanity-secret') || request.headers.get('x-webhook-secret');
    const secret = customSecret || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error('SANITY_REVALIDATE_SECRET is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (secret && secret !== expectedSecret) {
      console.warn('Invalid webhook secret');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    const { _type, _id } = body;
    
    // If no secret header, try checking the body (some webhook configs send it there)
    if (!secret && body.secret && body.secret !== expectedSecret) {
      console.warn('Invalid webhook secret in body');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    console.log('Webhook received:', { _type, _id });

    // Only revalidate event pages
    if (_type === 'event' && _id) {
      // Revalidate using the tag we set in the page
      revalidateTag(`event-${_id}`);
      
      // Also revalidate the paths
      revalidatePath(`/event/${_id}`);
      revalidatePath('/camp');
      revalidatePath('/');
      
      // Revalidate the OG image for this event
      revalidatePath(`/api/og/event/${_id}`);
      
      console.log(`Revalidated event page: /event/${_id}`);
      
      return NextResponse.json({
        revalidated: true,
        paths: [`/event/${_id}`, '/camp', '/'],
        timestamp: new Date().toISOString(),
      });
    }

    // If it's a gallery image update, we might want to revalidate gallery pages too
    if (_type === 'galleryImage') {
      revalidatePath('/gallery');
      console.log('Revalidated gallery page');
      
      return NextResponse.json({
        revalidated: true,
        paths: ['/gallery'],
        timestamp: new Date().toISOString(),
      });
    }

    // For other types, just acknowledge
    return NextResponse.json({
      revalidated: false,
      message: `Type ${_type} does not require revalidation`,
    });
  } catch (error) {
    console.error('Error in revalidation webhook:', error);
    return NextResponse.json(
      { error: 'Error revalidating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Allow GET for testing (with secret in query param)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const eventId = request.nextUrl.searchParams.get('eventId');
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  if (eventId) {
    revalidateTag(`event-${eventId}`);
    revalidatePath(`/event/${eventId}`);
    revalidatePath('/camp');
    revalidatePath('/');
    
    return NextResponse.json({
      revalidated: true,
      paths: [`/event/${eventId}`, '/camp', '/'],
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    message: 'Revalidation endpoint. Use POST for webhooks or GET with ?secret=xxx&eventId=xxx for manual revalidation',
  });
}

