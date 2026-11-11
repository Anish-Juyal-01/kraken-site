// Every colour on the site comes from one palette. ?palette=<id> picks one.

export type Palette = {
  id: string;
  name: string;
  blurb: string;
  paper: string; // the sky, and light text in the deep
  ink: string; // text on the sky
  deep: string; // the deep sea, and text on the accent
  accent: string; // buttons, the gauge, highlights
  pop: string; // a second, small colour: fish, starfish, a stripe
  water: { farTop: string; far: string; midTop: string; mid: string; nearTop: string; near: string; nearBottom: string };
  sea: [string, string, string, string]; // the deep, from lit top to dark bottom
  bed: [string, string];
  kelp: [string, string];
  fish: string;
  rock: string;
  coral: [string, string]; // reef colours on the sea floor
  kraken: { skin: string; skinDeep: string; outline: string };
};

export const PALETTES: Palette[] = [
  {
    id: 'lagoon',
    name: 'Lagoon',
    blurb: 'Warm sand sky over bright turquoise water. A red kraken, yellow fish.',
    paper: '#fff4dd',
    ink: '#0d3b4f',
    deep: '#062a3a',
    accent: '#ff5d5d',
    pop: '#ffc93c',
    water: { farTop: '#c4f3ea', far: '#8fe6d8', midTop: '#4dd6cf', mid: '#22b8bc', nearTop: 'rgba(20,160,178,0.84)', near: 'rgba(10,116,146,0.82)', nearBottom: 'rgba(6,42,58,0.96)' },
    sea: ['#1290a8', '#0b5f7c', '#062a3a', '#041c28'],
    bed: ['#0c5067', '#083b4d'],
    kelp: ['#1bb59a', '#12987f'],
    fish: '#ffc93c',
    rock: '#0f6078',
    coral: ['#ff5d5d', '#ff9e6d'],
    kraken: { skin: '#ff5d5d', skinDeep: '#e24545', outline: '#0d3b4f' },
  },
  {
    id: 'reef',
    name: 'Reef',
    blurb: 'Mint sky, clear tropical blue, green kelp. An orange kraken.',
    paper: '#effff7',
    ink: '#0b2b5c',
    deep: '#07205a',
    accent: '#ff8a3d',
    pop: '#ffe14d',
    water: { farTop: '#b9f1dc', far: '#7fdcc4', midTop: '#3cc3df', mid: '#1f9fd6', nearTop: 'rgba(24,128,210,0.84)', near: 'rgba(14,88,176,0.82)', nearBottom: 'rgba(7,32,90,0.96)' },
    sea: ['#1a72d4', '#0f4aa3', '#07205a', '#051641'],
    bed: ['#0e3d8c', '#0a2d6c'],
    kelp: ['#1dbb8d', '#15a07a'],
    fish: '#ffe14d',
    rock: '#134ea3',
    coral: ['#ff5fa2', '#ff8a3d'],
    kraken: { skin: '#ff8a3d', skinDeep: '#ec6f22', outline: '#0b2b5c' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    blurb: 'Peach sky over a violet evening sea. An orange kraken, glowing fish.',
    paper: '#ffe0c2',
    ink: '#3a1638',
    deep: '#1c0f2e',
    accent: '#ff7a3d',
    pop: '#ffd166',
    water: { farTop: '#ffc2a3', far: '#f79a8f', midTop: '#d0649a', mid: '#a4458a', nearTop: 'rgba(120,44,118,0.84)', near: 'rgba(74,30,100,0.84)', nearBottom: 'rgba(28,15,46,0.96)' },
    sea: ['#6a2f86', '#3f1c62', '#1c0f2e', '#120a20'],
    bed: ['#3d1e58', '#2b1542'],
    kelp: ['#8a45ab', '#6c3391'],
    fish: '#ffd166',
    rock: '#4d2670',
    coral: ['#ff7a3d', '#ff4d8d'],
    kraken: { skin: '#ff7a3d', skinDeep: '#e85f25', outline: '#3a1638' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    blurb: 'Pale ice sky over deep cobalt. A pink kraken, yellow buttons.',
    paper: '#eaf2ff',
    ink: '#0b1f4a',
    deep: '#050d2a',
    accent: '#ffd60a',
    pop: '#4cc9f0',
    water: { farTop: '#c6dbff', far: '#98bbff', midTop: '#5f8bf5', mid: '#3d67dc', nearTop: 'rgba(34,76,196,0.84)', near: 'rgba(20,46,144,0.84)', nearBottom: 'rgba(5,13,42,0.96)' },
    sea: ['#1a3a98', '#0f246c', '#050d2a', '#030819'],
    bed: ['#112a72', '#0b1d54'],
    kelp: ['#2c5ac8', '#2149aa'],
    fish: '#4cc9f0',
    rock: '#183c8e',
    coral: ['#ff5fa2', '#ffd60a'],
    kraken: { skin: '#ff5fa2', skinDeep: '#e2408a', outline: '#0b1f4a' },
  },
  {
    id: 'kelp',
    name: 'Kelp (the old one)',
    blurb: 'The earlier bone and bottle-green look, for comparison.',
    paper: '#ece7d9',
    ink: '#12332d',
    deep: '#0b2420',
    accent: '#e8553d',
    pop: '#f2c14e',
    water: { farTop: '#a9cfc2', far: '#8fc0b2', midTop: '#5fa594', mid: '#4a9484', nearTop: 'rgba(38,110,96,0.86)', near: 'rgba(26,84,73,0.8)', nearBottom: 'rgba(11,36,32,0.96)' },
    sea: ['#1c5247', '#0f342d', '#0b2420', '#071a17'],
    bed: ['#123a32', '#0d2d27'],
    kelp: ['#1d5a4e', '#184c42'],
    fish: '#2c6b5e',
    rock: '#1a4a40',
    coral: ['#e8553d', '#f2c14e'],
    kraken: { skin: '#e8553d', skinDeep: '#c9402b', outline: '#12332d' },
  },
];

const fromUrl = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('palette');
export const PALETTE: Palette = PALETTES.find((p) => p.id === fromUrl) ?? PALETTES.find((p) => p.id === 'reef')!;

/** Publish the palette as CSS variables. Tailwind's colour utilities read the same names. */
export function applyPalette(p: Palette = PALETTE) {
  const set = (k: string, v: string) => document.documentElement.style.setProperty(k, v);
  set('--color-paper', p.paper);
  set('--color-ink', p.ink);
  set('--color-deep', p.deep);
  set('--color-coral', p.accent);
  set('--pop', p.pop);
  set('--w-far-top', p.water.farTop);
  set('--w-far', p.water.far);
  set('--w-mid-top', p.water.midTop);
  set('--w-mid', p.water.mid);
  set('--w-near-top', p.water.nearTop);
  set('--w-near', p.water.near);
  set('--w-near-bottom', p.water.nearBottom);
  p.sea.forEach((c, i) => set(`--sea-${i}`, c));
  set('--bed-1', p.bed[0]);
  set('--bed-2', p.bed[1]);
  set('--kelp-1', p.kelp[0]);
  set('--kelp-2', p.kelp[1]);
  set('--fish', p.fish);
  set('--rock', p.rock);
  set('--reef-1', p.coral[0]);
  set('--reef-2', p.coral[1]);
  set('--bg-now', p.paper);
  set('--ink-now', p.ink);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.paper);
}
