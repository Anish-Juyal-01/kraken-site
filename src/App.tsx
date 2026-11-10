import Scene from './kraken/Scene';
import { HERO } from './content/content';

export default function App() {
  return (
    <main className="min-h-[100dvh] px-6 py-24">
      <Scene />
      <h1 className="display relative max-w-3xl text-5xl md:text-6xl">{HERO.headline}</h1>
    </main>
  );
}
