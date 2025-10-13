import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { client } from '../../../../../lib/sanity';
import { Event } from '../../../../../types/sanity';
import { GridBackground } from '../../../../../components/GridBackground';

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
    const monogramSvg = await fetch(`${baseUrl}/images/logo-dark.svg`).then((res) => res.text());

    // Lucide icons as SVG strings
    const calendarIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>

</svg>`;
    const mapPinIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    const usersIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

    const response = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            background: 'linear-gradient(113.9deg, rgba(255,240,240,1) 13%, rgba(255,245,245,1) 48.8%, rgba(255,250,250,1) 85.9%)',
            fontFamily: 'Poppins',
          }}
        >
          <GridBackground 
            gridSize={100}
            gridColor="#dc2626"
            opacity={0.29}
            strokeWidth={1}
            pattern="diagonal"
          />

          {/* Content Container */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
              padding: '60px',
              borderRadius: '22px',
              border: '12px solid #dc2626',
            }}
          >
            {/* Left Side - Main Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '750px',
                flex: 1,
              }}
            >
              {/* Event Title - Large and Bold with Shadow */}
              <h1
                style={{
                  fontSize: event.title.length > 30 ? '64px' : event.title.length > 20 ? '72px' : '80px',
                  fontWeight: '600',
                  color: '#1f2937',
                  lineHeight: '1.1',
                  marginBottom: '16px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                }}
              >
                {event.title.length > 50 ? event.title.substring(0, 50) + '...' : event.title}
              </h1>

              {/* Divider */}
              <div
                style={{
                  width: '200px',
                  height: '12px',
                  backgroundColor: '#dc2626',
                  borderRadius: '999px',
                  marginBottom: '40px',
                }}
              />

              {/* Event Details Icons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  fontSize: '28px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1f2937',
                  }}
                >
                  <img
                    src={`data:image/svg+xml;base64,${Buffer.from(calendarIcon).toString('base64')}`}
                    alt="Calendar"
                    style={{
                      width: '60px',
                      height: '60px',
                      marginRight: '12px',
                      color: '#000000',
                    }}
                  />
                  <span
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      textShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      fontSize: '32px',
                    }}
                  >
                    {eventDate}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1f2937',
                  }}
                >
                  <img
                    src={`data:image/svg+xml;base64,${Buffer.from(mapPinIcon).toString('base64')}`}
                    alt="Location"
                    style={{
                      width: '60px',
                      height: '60px',
                      marginRight: '12px',
                      color: '#dc2626',
                    }}
                  />
                  <span
                    style={{
                      display: 'flex',
                      fontWeight: '500',
                      textShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      fontSize: '32px',
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
                      color: '#1f2937',
                    }}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${Buffer.from(usersIcon).toString('base64')}`}
                      alt="Users"
                      style={{
                        width: '60px',
                        height: '60px',
                        marginRight: '12px',
                        color: '#dc2626',
                      }}
                    />
                    <span
                      style={{
                        display: 'flex',
                        fontWeight: '500',
                        textShadow: '0 1px 4px rgba(0,0,0,0.1)',
                        fontSize: '32px',
                      }}
                    >
                      {event.expectedParticipants} expected participants
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '40px',
                marginTop: '-320px',
              }}
            >
              <img
                src={`data:image/svg+xml;base64,${Buffer.from(monogramSvg).toString('base64')}`}
                alt="Rudhirsetu Logo"
                style={{
                  width: '180px',
                  height: '180px',
                }}
              />
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