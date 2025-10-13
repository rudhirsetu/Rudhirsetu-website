import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { GridBackground } from '../../../components/GridBackground';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Rudhirsetu Seva Sanstha';
    const description = searchParams.get('description') || 'Empowering Communities Through Service';
    // const route = searchParams.get('route') || 'home'; // Not needed since all routes use same gradient

    // Load fonts
    const poppinsBold = await fetch(
      new URL('/public/font/Poppins-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    const poppinsRegular = await fetch(
      new URL('/public/font/Poppins-Regular.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());


    // Load logo and convert to base64
    const logoResponse = await fetch(
      new URL('/public/images/logo-dark.svg', import.meta.url)
    );
    const logoBuffer = await logoResponse.arrayBuffer();
    const logoBase64 = Buffer.from(logoBuffer).toString('base64');
    const logoDataUrl = `data:image/svg+xml;base64,${logoBase64}`;


    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            fontFamily: 'Poppins',
            background: 'linear-gradient(113.9deg, rgba(255,240,240,1) 13%, rgba(255,245,245,1) 48.8%, rgba(255,250,250,1) 85.9%)',
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
              display: 'flex',
              width: '100%',
              height: '100%',
              padding: '60px',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              borderRadius: '22px',
              border: '12px solid #dc2626',
            }}
          >
            {/* Left Side - Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '800px',
                flex: 1,
              }}
            >
              {/* Logo Area - Large logo without container */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '40px',
                }}
              >
                <img
                  src={logoDataUrl}
                  alt="Rudhirsetu Logo"
                  width="160"
                  height="160"
                />
              </div>

              {/* Main Title */}
              <h1
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 16px 0',
                  lineHeight: 1.1,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Poppins',
                }}
              >
                {title}
              </h1>

              {/* Divider */}
              <div
                style={{
                  width: '200px',
                  height: '12px',
                  backgroundColor: '#dc2626',
                  borderRadius: '999px',
                  marginBottom: '20px',
                }}
              />

              {/* Description */}
              <p
                style={{
                  fontSize: '32px',
                  color: '#4b5563',
                  margin: '0 0 30px 0',
                  lineHeight: 1.4,
                  fontWeight: '400',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Poppins',
                  opacity: 0.95,
                }}
              >
                {description}
              </p>

              {/* Call to Action Badge */}
              <div
                style={{
                  display: 'flex',
                  borderRadius: '16px',
                  padding: '24px 0px',
                  alignItems: 'center',
                  marginTop: '0px',
                }}
              >
                <div
                  style={{
                    color: '#dc2626',
                    fontSize: '32px',
                    fontWeight: '600',
                    fontFamily: 'Poppins',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Saving lives since 2010
                </div>
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
            data: poppinsBold,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Poppins',
            data: poppinsRegular,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Extract params again for fallback
    const { searchParams: fallbackParams } = new URL(request.url);
    
    // Fallback simple design if assets fail to load
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(113.9deg, rgba(255,250,250,1) 13%, rgba(255,245,245,1) 48.8%, rgba(255,240,240,1) 85.9%)',
            fontFamily: 'system-ui',
            padding: '60px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#dc2626',
              textAlign: 'center',
              marginBottom: '20px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {fallbackParams.get('title') || 'Rudhirsetu Seva Sanstha'}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#4b5563',
              textAlign: 'center',
              lineHeight: 1.4,
              opacity: 0.9,
            }}
          >
            {fallbackParams.get('description') || 'Empowering Communities Through Service'}
          </div>
          <div
            style={{
              marginTop: '40px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '16px 32px',
              borderRadius: '12px',
              color: '#6b7280',
              fontSize: '18px',
            }}
          >
            www.rudhirsetu.org
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 628,
      }
    );
  }
} 