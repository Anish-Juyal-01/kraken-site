// A "look" is everything about how the kraken is drawn. The creature's behaviour (arms, moods,
// eyes that follow you) is the same for every look; only shapes, colours and shading change.

export type Look = {
  id: string;
  name: string;
  blurb: string;
  skin: string;
  skinDeep: string; // eyelids, darker accents
  belly: string;
  bellyAmount: number; // 0 no pale underside .. 1 strong
  outline: string | null;
  outlineWidth: number; // world units; 0 for none
  shade: number[] | 'clay'; // toon steps (0..255), or soft clay shading
  head: { height: number; narrow: number; lean: number; wide: number; point: number };
  eyes: {
    style: 'iris' | 'dot' | 'sticker' | 'button';
    r: number;
    x: number; // half the distance between the eyes
    y: number;
    iris: string;
    lids: boolean;
  };
  mouth: { y: number; size: number };
  blush: number; // opacity, 0 for none
  gloss: number; // opacity of the painted highlight, 0 for none
  spots: boolean;
  fins: 'none' | 'ears' | 'crown';
  web: number; // size of the skirt the arms come out of
  arm: { thick: number; length: number; restCurl: number; suckers: boolean };
};

export const LOOKS: Look[] = [
  {
    id: 'mochi',
    name: 'Mochi',
    blurb: 'A soft round blob. Tiny dot eyes set wide apart, no outline, stubby arms.',
    skin: '#f0705a',
    skinDeep: '#dc5a45',
    belly: '#fbd9cb',
    bellyAmount: 0.9,
    outline: null,
    outlineWidth: 0,
    shade: [205, 232, 250, 255],
    head: { height: 0.92, narrow: 0, lean: 0, wide: 1.16, point: 0 },
    eyes: { style: 'dot', r: 0.085, x: 0.42, y: 0.16, iris: '#1a1210', lids: false },
    mouth: { y: 0.03, size: 0.55 },
    blush: 0.75,
    gloss: 0.3,
    spots: false,
    fins: 'none',
    web: 1.05,
    arm: { thick: 1.25, length: 0.62, restCurl: 0.55, suckers: false },
  },
  {
    id: 'dumbo',
    name: 'Dumbo',
    blurb: 'Modelled on the dumbo octopus: two ear fins that flap, a webbed skirt, big glossy eyes.',
    skin: '#ef7e57',
    skinDeep: '#d9643f',
    belly: '#fde2cf',
    bellyAmount: 0.8,
    outline: '#7a2a16',
    outlineWidth: 0.014,
    shade: [150, 205, 240, 255],
    head: { height: 1.06, narrow: 0.04, lean: 0.06, wide: 1.04, point: 0 },
    eyes: { style: 'iris', r: 0.25, x: 0.36, y: 0.24, iris: '#2a6b8f', lids: true },
    mouth: { y: -0.02, size: 0.7 },
    blush: 0.7,
    gloss: 0.38,
    spots: true,
    fins: 'ears',
    web: 1.3,
    arm: { thick: 1.1, length: 0.72, restCurl: 0.6, suckers: true },
  },
  {
    id: 'sticker',
    name: 'Sticker',
    blurb: 'Flat like a sticker: two tones, a thick dark outline, big black oval eyes.',
    skin: '#e8553d',
    skinDeep: '#c9402b',
    belly: '#e8553d',
    bellyAmount: 0,
    outline: '#12332d',
    outlineWidth: 0.045,
    shade: [176, 176, 255, 255],
    head: { height: 1.0, narrow: 0, lean: 0, wide: 1.08, point: 0 },
    eyes: { style: 'sticker', r: 0.23, x: 0.34, y: 0.3, iris: '#0b1a17', lids: true },
    mouth: { y: 0.04, size: 0.85 },
    blush: 0.9,
    gloss: 0,
    spots: false,
    fins: 'none',
    web: 0.9,
    arm: { thick: 1.0, length: 0.95, restCurl: 0.85, suckers: false },
  },
  {
    id: 'squid',
    name: 'Little kraken',
    blurb: 'More kraken than octopus: a tall pointed hood with two fins, long arms, bright eyes.',
    skin: '#d94a3a',
    skinDeep: '#b7382b',
    belly: '#f6c7b2',
    bellyAmount: 0.85,
    outline: '#5c1a12',
    outlineWidth: 0.018,
    shade: [128, 190, 232, 255],
    head: { height: 1.55, narrow: 0.3, lean: 0.14, wide: 0.96, point: 0.5 },
    eyes: { style: 'iris', r: 0.27, x: 0.37, y: 0.2, iris: '#d9a21e', lids: true },
    mouth: { y: -0.08, size: 0.75 },
    blush: 0.55,
    gloss: 0.4,
    spots: true,
    fins: 'crown',
    web: 0.95,
    arm: { thick: 0.92, length: 1.12, restCurl: 0.8, suckers: true },
  },
];

export const lookById = (id: string | null | undefined): Look => LOOKS.find((l) => l.id === id) ?? LOOKS[1];
