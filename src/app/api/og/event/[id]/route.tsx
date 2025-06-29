import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { client } from '../../../../../lib/sanity';
import { Event } from '../../../../../types/sanity';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch event data
    const event: Event = await client.fetch(
      `*[_type == "event" && _id == $id][0]{
        _id,
        title,
        date,
        location,
        expectedParticipants,
        isUpcoming,
        desc,
        image,
        shortDesc
      }`,
      { id }
    );

    if (!event) {
      return new Response('Event not found', { status: 404 });
    }

    // Format date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Remove background image to keep file size under 300KB limit

    // Get the base URL for this request
    const baseUrl = new URL(request.url).origin;

    // Fetch local Poppins fonts via HTTP
    const poppinsRegular = await fetch(`${baseUrl}/font/Poppins-Regular.ttf`).then((res) => res.arrayBuffer());
    const poppinsBold = await fetch(`${baseUrl}/font/Poppins-Bold.ttf`).then((res) => res.arrayBuffer());

    // Fetch local monogram logo
    const monogramSvg = await fetch(`${baseUrl}/images/monogram.svg`).then((res) => res.text());

    const response = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'linear-gradient(113.9deg, rgba(241,106,56,1) 13%, rgba(213,32,39,1) 48.8%, rgba(170,65,39,1) 85.9%)',
            fontFamily: 'Poppins',
          }}
        >
          {/* Solid background instead of image for smaller file size */}
          
          {/* Light overlay for better text contrast */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
              display: 'flex',
            }}
          />

          {/* Content Container */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              padding: '60px',
            }}
          >
            {/* Top Section - Status and Logo */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {/* Status Badges */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: event.isUpcoming ? '#DC2626' : 'rgba(0,0,0,0.3)',
                    color: 'white',
                    borderRadius: '50px',
                    padding: '8px 20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <span style={{ display: 'flex', marginRight: '6px' }}>📅</span>
                  <span style={{ display: 'flex' }}>
                    {event.isUpcoming ? 'Upcoming Event' : 'Past Event'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    borderRadius: '50px',
                    padding: '8px 20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <span style={{ display: 'flex', marginRight: '6px' }}>🕐</span>
                  <span style={{ display: 'flex' }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Logo - Rudhirsetu text with styled background */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {/* Logo container with actual monogram */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={`data:image/svg+xml;base64,${Buffer.from(monogramSvg).toString('base64')}`}
                    alt="Rudhirsetu Logo"
                    style={{
                      width: '40px',
                      height: '40px',
                    }}
                  />
                </div>
                <span
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    display: 'flex',
                  }}
                >
                  Rudhirsetu Seva Sanstha
                </span>
              </div>
            </div>

            {/* Main Content - Event Details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '800px',
              }}
            >
              {/* Event Title - Large and Bold with Shadow */}
              <h1
                style={{
                  fontSize: event.title.length > 30 ? '56px' : event.title.length > 20 ? '64px' : '72px',
                  fontWeight: '700',
                  color: 'white',
                  lineHeight: '1.1',
                  marginBottom: '24px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                  display: 'flex',
                }}
              >
                {event.title.length > 40 ? event.title.substring(0, 40) + '...' : event.title}
              </h1>

              {/* Event Description */}
              {event.shortDesc && (
                <p
                  style={{
                    fontSize: '26px',
                    color: 'rgba(255,255,255,0.99)',
                    lineHeight: '1.4',
                    marginBottom: '24px',
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                    display: 'flex',
                    maxWidth: '700px',
                    fontWeight: '400',
                  }}
                >
                  {event.shortDesc.length > 80 ? event.shortDesc.substring(0, 80) + '...' : event.shortDesc}
                </p>
              )}

              {/* Event Details Icons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  fontSize: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                  }}
                >
                  <span style={{ display: 'flex', marginRight: '12px', fontSize: '28px' }}>📅</span>
                  <span
                    style={{
                      display: 'flex',
                      fontWeight: '600',
                      textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                    }}
                  >
                    {eventDate}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                  }}
                >
                  <span style={{ display: 'flex', marginRight: '12px', fontSize: '28px' }}>📍</span>
                  <span
                    style={{
                      display: 'flex',
                      fontWeight: '600',
                      textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                    }}
                  >
                    {event.location.length > 40 ? event.location.substring(0, 40) + '...' : event.location}
                  </span>
                </div>

                {event.expectedParticipants && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'white',
                    }}
                  >
                    <span style={{ display: 'flex', marginRight: '12px', fontSize: '28px' }}>👥</span>
                    <span
                      style={{
                        display: 'flex',
                        fontWeight: '600',
                        textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                      }}
                    >
                      {event.expectedParticipants} expected participants
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Website URL */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '20px',
                  fontWeight: '500',
                  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  display: 'flex',
                }}
              >
                www.rudhirsetu.org
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 628,
        fonts: [
          {
            name: 'Poppins',
            data: poppinsRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Poppins',
            data: poppinsBold,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );

    // Set response headers for optimization
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    response.headers.set('Content-Type', 'image/png');
    
    return response;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
} 