import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

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
      new URL('/public/images/logo-light.svg', import.meta.url)
    );
    const logoBuffer = await logoResponse.arrayBuffer();
    const logoBase64 = Buffer.from(logoBuffer).toString('base64');
    const logoDataUrl = `data:image/svg+xml;base64,${logoBase64}`;

    // EXACT same gradient as event OG tag
    const commonStyle = {
      gradientStart: '#EA580C',
      gradientEnd: '#C2410C',
      accentColor: '#FFF7ED',
      overlayOpacity: 0.9
    };

    const style = commonStyle;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            position: 'relative',
            fontFamily: 'Poppins',
            background: 'linear-gradient(113.9deg, rgba(241,106,56,1) 13%, rgba(213,32,39,1) 48.8%, rgba(170,65,39,1) 85.9%)',
          }}
        >

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
            }}
          >
            {/* Left Side - Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '700px',
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
                  style={{
                    marginRight: '40px',
                  }}
                />
                <div
                  style={{
                    color: 'white',
                    fontSize: '42px',
                    fontWeight: '600',
                    fontFamily: 'Poppins',
                  }}
                >
                  Rudhirsetu Seva Sanstha
                </div>
              </div>

              {/* Main Title */}
              <h1
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 20px 0',
                  lineHeight: 1.1,
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
                  fontFamily: 'Poppins',
                }}
              >
                {title}
              </h1>

              {/* Description */}
              <p
                style={{
                  fontSize: '32px',
                  color: style.accentColor,
                  margin: '0 0 30px 0',
                  lineHeight: 1.4,
                  fontWeight: '400',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
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
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '16px 32px',
                  alignItems: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '500',
                    fontFamily: 'Poppins',
                  }}
                >
                  Since 2010 • Transforming Lives Across India
                </div>
              </div>
            </div>

            {/* Right Side - Website URL only */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                height: '100%',
                paddingBottom: '20px',
              }}
            >
              {/* Website URL */}
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '26px',
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                }}
              >
                rudhirsetu.org
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
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            fontFamily: 'system-ui',
            padding: '60px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            {fallbackParams.get('title') || 'Rudhirsetu Seva Sanstha'}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#FEF2F2',
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
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 32px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '18px',
            }}
          >
            rudhirsetu.org
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