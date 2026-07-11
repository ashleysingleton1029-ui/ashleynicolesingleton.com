/**
 * Single source of truth for site copy.
 * All strings here are polished PLACEHOLDER content — replace with real
 * bio, credits, press, and booking details. Structure stays the same.
 */

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Reel', href: '#reel' },
  { label: 'Press', href: '#press' },
  { label: 'Bookings', href: '#contact' },
];

export const hero = {
  location: 'Las Vegas, Nevada',
  role: 'Host · Media Personality · Editorial Model',
  nameLines: ['Ashley', 'Nicole', 'Singleton'],
  statement:
    'On-camera host and editorial model translating Las Vegas energy into broadcast, brand campaigns, and the front row.',
};

export const marquee = [
  'Broadcast Host',
  'Brand Ambassador',
  'Live Events',
  'Editorial',
  'Red Carpet',
  'Campaigns',
];

export const about = {
  eyebrow: 'The Personality',
  headingLines: ['Camera-ready', 'and unmistakably', 'her own.'],
  lead:
    'Ashley Nicole Singleton is a Las Vegas–based media personality who moves fluently between the anchor desk, the step-and-repeat, and the editorial spread.',
  body: [
    'She built her name hosting live entertainment on the Strip — the kind of nights where the run-of-show changes twice before the doors open and the host has to make it look effortless. That instinct for live, unscripted moments now anchors broadcast segments, brand activations, and the campaigns she fronts.',
    'As an editorial model she brings the same point of view: high-contrast, expressive, and never templated. Directors book her for presence; brands keep her for the audience that follows.',
  ],
  stats: [
    { value: '10+', label: 'Years on camera' },
    { value: '40+', label: 'Brand campaigns' },
    { value: '1.2M', label: 'Combined reach' },
  ],
};

export const work = {
  eyebrow: 'Selected Work',
  headingLines: ['The', 'Portfolio'],
  intro:
    'A cross-section of broadcast, campaign, and editorial work. Full case studies and tear sheets available on request.',
  items: [
    { index: '01', title: 'Neon Hours', category: 'Broadcast · Host', tone: 'ink', span: 'wide', year: '2025' },
    { index: '02', title: 'Atelier No.9', category: 'Editorial · Cover', tone: 'warm', span: 'tall', year: '2025' },
    { index: '03', title: 'House of Lumen', category: 'Campaign · Face', tone: 'pink', span: 'std', year: '2024' },
    { index: '04', title: 'The Vault Sessions', category: 'Live · Host', tone: 'slate', span: 'std', year: '2024' },
    { index: '05', title: 'Mirage & Muse', category: 'Editorial · Feature', tone: 'ink', span: 'tall', year: '2024' },
    { index: '06', title: 'Skyline Premiere', category: 'Red Carpet · Correspondent', tone: 'warm', span: 'wide', year: '2023' },
  ],
};

export const reel = {
  eyebrow: 'On Camera',
  headingLines: ['The Reel'],
  copy:
    'A ninety-second cut of hosting segments, live crosses, and campaign spots. Full-length reels and raw selects available to casting and brand teams.',
  runtime: '01:32',
  meta: ['4K · 2025 Cut', 'Broadcast + Digital', 'Available on request'],
};

export const press = {
  eyebrow: 'Featured In',
  headingLines: ['Press &', 'Recognition'],
  outlets: ['VEGAS', 'LUXE', 'THE STRIP', 'FRONT ROW', 'ATELIER', 'HAUTE', 'MIRAGE', 'ENCORE'],
  quotes: [
    {
      quote:
        'Singleton hosts the way the best ones do — like the camera is a person she already knows.',
      source: 'The Strip Quarterly',
    },
    {
      quote:
        'A genuine editorial presence. High-contrast, expressive, and completely her own.',
      source: 'Atelier Magazine',
    },
    {
      quote:
        'The rare personality who reads as premium on broadcast and in print alike.',
      source: 'Luxe Las Vegas',
    },
  ],
};

export const appearances = {
  eyebrow: 'Live & Upcoming',
  headingLines: ['Appearances'],
  events: [
    { date: 'Aug 14', city: 'Las Vegas, NV', venue: 'Encore Theater · Season Host', status: 'Confirmed' },
    { date: 'Sep 02', city: 'Los Angeles, CA', venue: 'House of Lumen · Campaign Launch', status: 'Confirmed' },
    { date: 'Oct 19', city: 'Las Vegas, NV', venue: 'The Vault Sessions · Live Host', status: 'On sale' },
    { date: 'Nov 30', city: 'Miami, FL', venue: 'Front Row · Editorial Panel', status: 'Announced' },
  ],
};

export const contact = {
  eyebrow: 'Bookings',
  headingLines: ["Let's make", 'something', 'unmistakable.'],
  copy:
    'For hosting, campaigns, editorial, and appearances. Serious inquiries receive a full media kit and availability within two business days.',
  email: 'bookings@ashleynicolesingleton.com',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com', handle: '@ashleynicolesingleton' },
    { label: 'TikTok', href: 'https://tiktok.com', handle: '@ashleynicole' },
    { label: 'IMDb', href: 'https://imdb.com', handle: 'Ashley Nicole Singleton' },
    { label: 'LinkedIn', href: 'https://linkedin.com', handle: 'in/ashleynicolesingleton' },
  ],
  representation: [
    { role: 'Talent', name: 'Meridian Talent Group', detail: 'talent@meridian.example' },
    { role: 'Editorial', name: 'Atelier Model Mgmt', detail: 'board@atelier.example' },
  ],
};
