/**
 * Plate — editorial placeholder imagery, fully self-contained (inline SVG).
 * Duotone tone + film grain + a large ghosted index number, so empty
 * content slots still read as deliberate art direction. Swap for <Image>
 * when real photography is supplied.
 */

const TONES = {
  ink: { bg: '#09090b', fg: '#fafafa', shape: '#1c1c22' },
  warm: { bg: '#f2f0ec', fg: '#09090b', shape: '#e5e1d8' },
  pink: { bg: '#ec4899', fg: '#fafafa', shape: '#d6317f' },
  paper: { bg: '#fafafa', fg: '#09090b', shape: '#ececec' },
  slate: { bg: '#3f3f46', fg: '#fafafa', shape: '#52525b' },
};

export default function Plate({
  index = '01',
  tone = 'ink',
  label = 'Editorial',
  className = '',
  ratio = '3 / 4',
  parallax = false,
}) {
  const c = TONES[tone] || TONES.ink;
  const gid = `grain-${index}-${tone}`;

  return (
    <div
      className={`plate ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`${label} — placeholder plate ${index}`}
    >
      <div
        data-parallax-media={parallax ? '' : undefined}
        style={{
          position: 'absolute',
          inset: parallax ? '-14% 0' : 0,
          width: '100%',
          height: parallax ? '128%' : '100%',
        }}
      >
        <svg
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={gid}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.14" intercept="0" />
              </feComponentTransfer>
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
          </defs>

          <rect width="600" height="800" fill={c.bg} />
          <path d="M0 520 L600 300 L600 800 L0 800 Z" fill={c.shape} opacity="0.9" />
          <path d="M0 0 L600 0 L600 180 L0 340 Z" fill={c.shape} opacity="0.45" />

          {/* abstract editorial gesture */}
          <g stroke={c.fg} strokeWidth="1.2" opacity="0.28" fill="none">
            <path d="M120 210 C 260 120, 360 260, 300 420 S 220 640, 380 700" />
            <circle cx="300" cy="330" r="150" />
          </g>

          <text
            x="46"
            y="700"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="240"
            fontStyle="italic"
            fontWeight="900"
            fill={c.fg}
            opacity="0.14"
          >
            {index}
          </text>

          <rect
            width="600"
            height="800"
            filter={`url(#${gid})`}
            opacity="0.55"
          />
        </svg>
      </div>

      <span
        style={{
          position: 'absolute',
          left: '1rem',
          bottom: '1rem',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.68rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: c.fg,
          opacity: 0.8,
          mixBlendMode: 'difference',
          zIndex: 2,
        }}
      >
        {label} · Nº {index}
      </span>
    </div>
  );
}
