import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Route segment config
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e5a0',
          fontWeight: 800,
          fontFamily: 'sans-serif',
        }}
      >
        <span style={{ color: '#6c63ff' }}>M</span>K
      </div>
    ),
    { ...size }
  );
}
