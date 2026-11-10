# Kraken website

A single scrolling page for [Kraken](https://github.com/Anish-Juyal-01/Kraken): you dive from the sea
surface down to a 3D kraken whose eight arms present Kraken's stages, then rise back to the demo
video and the run steps.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for scroll, geometry, moods, interactions and device rules
npm run build    # static site in dist/
```

Add `?motion=reduce` to the URL to preview the reduced-motion version.

- `src/content/` all copy and the recorded chat messages
- `src/scroll/` scroll progress and the mapping from progress to section and arm
- `src/kraken/` the 3D creature: arms, body, eyes, moods, props, camera and depth colour
- `src/sections/` one component per page section, plus the three interactions
- `src/ui/` chat card, button, depth gauge, water

Design and plan: `docs/superpowers/`.
