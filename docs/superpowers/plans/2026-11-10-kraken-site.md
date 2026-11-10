# Kraken Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single scrolling page where the visitor dives from the sea surface to a cute 3D kraken whose eight arms present Kraken's stages, then rises back to the demo video and run steps.

**Architecture:** One scroll module owns a single progress value (0 to 1) and the current stage. DOM sections and the 3D scene both read from it and never talk to each other. All geometry, camera, color, mood and interaction logic lives in pure functions that are unit-tested; React components and the render loop only apply those values.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind v4 (`@tailwindcss/vite`), three + @react-three/fiber, gsap + ScrollTrigger, vitest. Fonts self-hosted through `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`.

**Spec:** `docs/superpowers/specs/2026-11-10-kraken-site-design.md`

## Global Constraints

- Location: `C:\Users\jlali\Documents\Projects\kraken-site`, its own git repository. Commit locally after each task; never push or publish without the owner's OK.
- Colors, exact: paper `#ece7d9`, ink `#12332d`, deep `#0b2420`, coral `#e8553d`. Coral is the only accent.
- Type: Bricolage Grotesque (headlines), Geist (body), Geist Mono (chat and code).
- Corner radius 14px for cards and message bubbles; buttons are full pills.
- Button labels, one per intent: "Watch the demo", "View on GitHub".
- Links: demo `https://youtu.be/o_IiLbg4gio`, repo `https://github.com/Anish-Juyal-01/Kraken`.
- Copy: plain sentences, no em-dashes or en-dashes anywhere visible, no filler verbs.
- No Motion/framer-motion. No `window.addEventListener('scroll')`. Animate only `transform` and `opacity` in the DOM.
- No model files, videos or generated images. No pull-request URL. The Gemini bid is labelled "from run K-10"; the Sonar example is labelled as the bundled demo app.
- Emoji appear only inside chat-message text and the three choice buttons (🙋 🤖 👍), because they are Kraken's real commands.
- `prefers-reduced-motion`: no camera travel, no pinning, same content and interactions.

## Review Focus

1. Scroll progress outside 0..1 (rubber-band overscroll, resize while pinned): stage and camera must clamp, never return undefined or NaN. Test in Task 2 and Task 5.
2. Clicking "Send the bad request" or 👍 twice, or fast: the sequence must not restart or skip. Test in Task 7.
3. The Spark clock when the visitor scrolls away or the component unmounts mid-countdown: the timer stops, and returning shows the last state. Test in Task 7.
4. WebGL unavailable or context lost: the page still shows all content with a still fallback. Test in Task 9 (`qualityFor`).
5. Keyboard-only visitor: every choice button reachable and operable, gauge marks focusable. Checked in Task 10.

---

### Task 1: Project, theme and content

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/content/content.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type StageId = 'spark'|'sonar'|'charter'|'forge'|'storm'|'deliver'|'hallmark'|'you';
  export type ChatMsg = { who: string; text: string; note?: string; code?: string };
  export type Arm = { id: StageId; name: string; prop: 'pencil'|'trumpet'|'flag'|'hammer'|'umbrella'|'letter'|'book'|null;
                      line: string; messages: ChatMsg[] };
  export const ARMS: Arm[];                       // exactly 8, in the order above
  export const LINKS: { demo: string; repo: string; switchDocs: string };
  export const HERO: { headline: string; sub: string };
  export const PROBLEM: string[];                 // 2-3 lines
  export const SWITCH_ROWS: { feature: string; use: string }[];
  export const RUN_STEPS: string[];               // shell commands from the Kraken README
  ```
- CSS variables in `src/index.css`: `--paper`, `--ink`, `--deep`, `--coral`, `--radius: 14px`; Tailwind theme exposes them as `paper`, `ink`, `deep`, `coral`.

- [ ] **Step 1:** Scaffold with `npm create vite@latest . -- --template react-ts`, then install `three @react-three/fiber gsap tailwindcss @tailwindcss/vite` and the three `@fontsource-variable/*` packages, plus dev `vitest @types/three`. `git init`.
- [ ] **Step 2: Write the failing test** `src/content/content.test.ts`:
  ```ts
  test('eight arms in order', () => {
    expect(ARMS.map(a => a.id)).toEqual(['spark','sonar','charter','forge','storm','deliver','hallmark','you']);
  });
  test('only the last arm has no prop', () => {
    expect(ARMS.filter(a => a.prop === null).map(a => a.id)).toEqual(['you']);
  });
  test('no em or en dashes in any visible string', () => {
    const all = JSON.stringify({ ARMS, HERO, PROBLEM, SWITCH_ROWS });
    expect(all).not.toMatch(/[\u2013\u2014]/);
  });
  test('labels that keep the site honest', () => {
    const charter = ARMS.find(a => a.id === 'charter')!;
    expect(charter.messages.find(m => m.who === 'gemini-coder')!.note).toMatch(/K-10/);
    expect(ARMS.find(a => a.id === 'sonar')!.messages[0].note).toMatch(/demo app/);
    expect(JSON.stringify(ARMS)).not.toMatch(/\/pull\/\d+/);
  });
  ```
- [ ] **Step 3:** Run `npx vitest run src/content` and see it fail (module missing).
- [ ] **Step 4:** Write `src/content/content.ts`. Message text comes from run K-5 as used in the demo video (`C:\Users\jlali\Documents\Projects\kraken-video\src\scenes.tsx`): planner's "BRIEF READY", the three Claude bids, the Gemini K-10 bid, commit `3d1a53c` with the endpoint code, "ACCEPTED", Squall's 500 on `GET /api/todos/9223372036854775808`, the fix `ff50ced`, "7 passed", the pick reason for claude-coder-2, the PR question. Hero headline: "Your team decides in chat. Something below is listening." Sub (max 20 words): "Kraken is a crew of AI agents in your team chat that turns a request into a tested pull request."
- [ ] **Step 5:** Write `src/index.css` (Tailwind import, font imports, the four color variables, radius) and a placeholder `App.tsx` that renders the hero headline on `--paper`.
- [ ] **Step 6:** `npx vitest run` passes; `npm run build` succeeds. Commit: `feat: project scaffold, theme and content`.

### Task 2: Scroll module

**Files:**
- Create: `src/scroll/stages.ts`, `src/scroll/store.ts`, `src/scroll/useScrollProgress.ts`
- Test: `src/scroll/stages.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type SectionId = 'surface'|'waterline'|'descent'|'creature'|'floor'|'ascent'|'surfaceAgain';
  export const SECTION_RANGES: Record<SectionId, [number, number]>;  // contiguous, cover 0..1; creature is [0.30, 0.72]
  export function sectionAt(p: number): SectionId;                   // clamps p to 0..1
  export function armIndexAt(p: number): number | null;              // 0..7 inside creature, else null; equal slices
  export function localProgress(p: number, s: SectionId): number;    // 0..1 within a section, clamped
  export const scrollStore: { get(): number; set(p: number): void; subscribe(fn: (p: number) => void): () => void };
  export function useScrollProgress(): void;   // mounts one ScrollTrigger on the page root, writes scrollStore
  ```

- [ ] **Step 1: Failing tests:**
  ```ts
  test('ranges are contiguous and cover 0..1', () => {
    const r = Object.values(SECTION_RANGES).sort((a, b) => a[0] - b[0]);
    expect(r[0][0]).toBe(0); expect(r.at(-1)![1]).toBe(1);
    r.slice(1).forEach((x, i) => expect(x[0]).toBe(r[i][1]));
  });
  test('clamps out-of-range progress', () => {
    expect(sectionAt(-0.2)).toBe('surface'); expect(sectionAt(1.4)).toBe('surfaceAgain');
    expect(localProgress(9, 'creature')).toBe(1); expect(Number.isNaN(localProgress(NaN, 'creature'))).toBe(false);
  });
  test('eight equal arm slices inside the creature section', () => {
    expect(armIndexAt(0.29)).toBeNull(); expect(armIndexAt(0.30)).toBe(0);
    expect(armIndexAt(0.719)).toBe(7); expect(armIndexAt(0.73)).toBeNull();
  });
  ```
- [ ] **Step 2:** Run, see fail. **Step 3:** Implement the three files; `localProgress` treats NaN as 0. `useScrollProgress` creates one `ScrollTrigger({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate })` and kills it on unmount.
- [ ] **Step 4:** Tests pass. Commit: `feat: scroll progress and stage mapping`.

### Task 3: Kraken body, eyes and arms

**Files:**
- Create: `src/kraken/armCurve.ts`, `src/kraken/Arm.tsx`, `src/kraken/Body.tsx`, `src/kraken/Eyes.tsx`, `src/kraken/toon.ts`, `src/kraken/Kraken.tsx`, `src/kraken/Scene.tsx`
- Test: `src/kraken/armCurve.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ArmPose = { reach: number; curl: number; lift: number };          // each 0..1
  export function armPoints(index: number, time: number, pose: ArmPose,
                            lean: [number, number], segments: number): [number, number, number][];
  export function armRadius(t: number): number;       // t 0 (root) .. 1 (tip); 0.22 at root, 0.05 at tip, monotonic
  export function toonMaterial(color: string): THREE.MeshToonMaterial;   // 3-step gradient map
  // <Kraken mood={Mood} poses={ArmPose[8]} look={[x,y]} quality={Quality} />  (Mood: Task 4, Quality: Task 9)
  // <Scene /> : the R3F <Canvas> with <Kraken>, reads scrollStore
  ```
- Arms attach on a ring of radius 0.55 under the body, index `i` at angle `i * 45°`.

- [ ] **Step 1: Failing tests:**
  ```ts
  const pts = armPoints(0, 0, { reach: 0.5, curl: 0.3, lift: 0 }, [0, 0], 24);
  test('returns segments+1 finite points anchored on the body ring', () => {
    expect(pts).toHaveLength(25); pts.flat().forEach(n => expect(Number.isFinite(n)).toBe(true));
    expect(Math.hypot(pts[0][0], pts[0][2])).toBeCloseTo(0.55, 2);
  });
  test('more reach makes a longer arm', () => {
    const len = (r: number) => { const p = armPoints(0, 0, { reach: r, curl: 0, lift: 0 }, [0, 0], 24);
      return Math.hypot(p[24][0] - p[0][0], p[24][1] - p[0][1], p[24][2] - p[0][2]); };
    expect(len(1)).toBeGreaterThan(len(0.2));
  });
  test('radius tapers from 0.22 to 0.05', () => {
    expect(armRadius(0)).toBeCloseTo(0.22); expect(armRadius(1)).toBeCloseTo(0.05);
    expect(armRadius(0.5)).toBeLessThan(armRadius(0.25));
  });
  ```
- [ ] **Step 2:** Run, see fail. **Step 3:** Implement `armCurve.ts` (a base curve bent by `curl`, lifted by `lift`, with a small time-based sway and an offset toward `lean`).
- [ ] **Step 4:** `Arm.tsx`: a tube mesh rebuilt each frame from `armPoints` (reuse one `BufferGeometry`, update positions in `useFrame`), plus suckers as an `InstancedMesh` along the underside. `Body.tsx`: sphere scaled to `[1, 0.9, 1]` with a slight vertex bulge at the back. `Eyes.tsx`: two white spheres, coral-dark pupils that move by `look`, eyelids as half-spheres rotated by a `lid` value (0 open, 1 closed), random blink every 3 to 6 seconds. Outline: a second back-face mesh scaled 1.04 in ink color.
- [ ] **Step 5:** Tests pass. Open the dev server in the browser, confirm one kraken on a paper background with eight arms, an outline and eyes that follow the cursor. Commit: `feat: 3D kraken body, eyes and arms`.

### Task 4: Moods

**Files:**
- Create: `src/kraken/moods.ts`
- Test: `src/kraken/moods.test.ts`
- Modify: `src/kraken/Kraken.tsx`, `src/kraken/Eyes.tsx`, `src/kraken/Body.tsx`

**Interfaces:**
- Produces:
  ```ts
  export type MoodId = 'neutral'|'curious'|'concentrating'|'startled'|'relieved'|'proud';
  export type Mood = { lid: number; pupil: number; mouth: number; squash: number; tongue: number };  // lid 0..1, pupil 0.6..1.4, mouth -1..1, squash 0.85..1.15, tongue 0..1
  export const MOODS: Record<MoodId, Mood>;
  export function blendMood(a: Mood, b: Mood, k: number): Mood;        // k clamped 0..1, linear
  export function moodFor(arm: number | null, storm: StormPhase, delivered: boolean): MoodId;  // StormPhase: Task 7
  ```
- `moodFor`: arm 0 → curious; arm 3 → concentrating; arm 4 → startled when storm is `'error'`, relieved when `'fixed'`, else neutral; arm 5 → proud when delivered; otherwise neutral.

- [ ] **Step 1: Failing tests:** `blendMood(MOODS.neutral, MOODS.startled, 0)` equals neutral, at 1 equals startled, at 5 equals startled; `MOODS.startled.pupil < MOODS.neutral.pupil` and `MOODS.startled.lid === 0`; `MOODS.concentrating.tongue === 1`; the `moodFor` table above, one assertion per row.
- [ ] **Step 2:** Run, fail. **Step 3:** Implement and wire: `Kraken` keeps a current `Mood` and blends toward the target each frame at rate `1 - Math.exp(-dt * 6)`.
- [ ] **Step 4:** Tests pass; in the browser, temporarily cycle moods with number keys to see each one, then remove the keys. Commit: `feat: kraken moods`.

### Task 5: Camera, depth color and the dive

**Files:**
- Create: `src/kraken/camera.ts`, `src/kraken/depth.ts`
- Test: `src/kraken/camera.test.ts`
- Modify: `src/kraken/Scene.tsx`

**Interfaces:**
- Produces:
  ```ts
  export function cameraAt(p: number): { pos: [number, number, number]; look: [number, number, number] };
  export function depthColor(p: number): string;     // hex; '#ece7d9' at p=0 and p=1, '#0b2420' across the creature and floor sections
  export function inkColor(p: number): string;       // '#12332d' on paper, '#ece7d9' in the deep; switches where depthColor passes mid-luminance
  export function krakenVisibility(p: number): { y: number; scale: number };   // peeking at 0, hidden in descent start, full at creature
  ```

- [ ] **Step 1: Failing tests:** `depthColor(0)` and `depthColor(1)` equal `#ece7d9`; `depthColor(0.5)` equals `#0b2420`; `depthColor(-1)` equals `depthColor(0)`; `cameraAt(p).pos` is finite for `p` in `[-1, 0, 0.3, 0.72, 1, 2, NaN]`; the camera y at 0.5 is lower than at 0.05; `inkColor(0)` is `#12332d` and `inkColor(0.5)` is `#ece7d9`.
- [ ] **Step 2:** Run, fail. **Step 3:** Implement with smoothstep between keyframes per section from `SECTION_RANGES`.
- [ ] **Step 4:** `Scene.tsx` applies `cameraAt` and sets the page background and a CSS variable `--ink-now` from `depthColor`/`inkColor` on each store update (direct style writes, no React state). Add fog in the depth color and 40 instanced bubbles that rise with speed tied to scroll velocity.
- [ ] **Step 5:** Tests pass; in the browser, scrolling a tall placeholder page dives, darkens and returns. Commit: `feat: camera dive and depth color`.

### Task 6: Page sections and UI

**Files:**
- Create: `src/ui/ChatCard.tsx`, `src/ui/Button.tsx`, `src/ui/DepthGauge.tsx`, `src/sections/Surface.tsx`, `src/sections/Waterline.tsx`, `src/sections/Descent.tsx`, `src/sections/Floor.tsx`, `src/sections/Ascent.tsx`, `src/sections/SurfaceAgain.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: content from Task 1; `scrollStore`, `SECTION_RANGES`, `sectionAt` from Task 2.
- Produces: `<ChatCard msg={ChatMsg} />`, `<Button href? onClick? variant="solid"|"line">`, `<DepthGauge />`; each section component takes no props.

- [ ] **Step 1:** `ChatCard`: avatar initial, name, text in Geist Mono, optional `note` as a small line under the text, optional `code` block. `Button`: pill, coral solid with ink text or 1.5px line; `:active` scale 0.98.
- [ ] **Step 2:** `Surface`: left-aligned headline (max 2 lines at 1440px), sub, the two buttons; nothing else. `Waterline`: the build request typed character by character from local progress, then translated down. `Descent`: `PROBLEM` lines revealed one at a time. `Floor`: `SWITCH_ROWS` as a two-column grouped list (no hairline under every row), plus one "any repo, any agent" statement. `Ascent`: one line. `SurfaceAgain`: the YouTube embed (`youtube-nocookie.com/embed/o_IiLbg4gio`, loaded on click of a poster button), `RUN_STEPS` in a code block with a copy button, the two buttons again.
- [ ] **Step 3:** `DepthGauge`: fixed right, a vertical scale with eight marks plus surface and floor, a coral pointer at the current progress, the current stage name beside it; each mark is a `<button>` that scrolls to that stage's progress. Hidden under 768px.
- [ ] **Step 4:** `App.tsx`: the fixed full-viewport `<Scene />` behind, sections stacked above it with heights that produce `SECTION_RANGES` (total page height 900vh), `useScrollProgress()` mounted once.
- [ ] **Step 5:** In the browser at 1440px: every section readable over the scene, hero fits the first screen, buttons open the right links. Commit: `feat: page sections, chat cards and depth gauge`.

### Task 7: The eight arms and the three interactions

**Files:**
- Create: `src/sections/Creature.tsx`, `src/sections/interactions.ts`, `src/kraken/poses.ts`
- Test: `src/sections/interactions.test.ts`, `src/kraken/poses.test.ts`
- Modify: `src/kraken/Scene.tsx`

**Interfaces:**
- Produces:
  ```ts
  export type SparkState = { phase: 'asking'|'yours'|'agent'; secondsLeft: number };       // starts { asking, 120 }
  export type SparkAction = { type: 'tick'; seconds: number } | { type: 'me' } | { type: 'agent' };
  export function sparkReducer(s: SparkState, a: SparkAction): SparkState;
  export type StormPhase = 'idle'|'sent'|'error'|'fixing'|'fixed';
  export function stormNext(p: StormPhase): StormPhase;        // idle→sent→error→fixing→fixed→fixed
  export function stormSend(p: StormPhase): StormPhase;        // idle→sent; any other phase unchanged
  export const interactionStore: { spark: SparkState; storm: StormPhase; delivered: boolean; subscribe(...): () => void; ... };
  export function posesFor(activeArm: number | null, k: number): ArmPose[];   // 8 poses; the active arm reach 1, lift 0.6; others reach 0.45
  ```
- The Spark clock runs 120 displayed seconds in 12 real seconds (one `tick` of 1 second every 100ms).

- [ ] **Step 1: Failing tests:**
  ```ts
  test('spark: me stops the clock, agent and timeout hand over', () => {
    let s: SparkState = { phase: 'asking', secondsLeft: 120 };
    expect(sparkReducer(s, { type: 'me' })).toEqual({ phase: 'yours', secondsLeft: 120 });
    expect(sparkReducer(s, { type: 'agent' }).phase).toBe('agent');
    s = sparkReducer(s, { type: 'tick', seconds: 119 }); expect(s.phase).toBe('asking');
    s = sparkReducer(s, { type: 'tick', seconds: 5 });   expect(s).toEqual({ phase: 'agent', secondsLeft: 0 });
    expect(sparkReducer({ phase: 'yours', secondsLeft: 80 }, { type: 'tick', seconds: 200 }).phase).toBe('yours');
  });
  test('storm: sending twice does not restart', () => {
    expect(stormSend('idle')).toBe('sent'); expect(stormSend('error')).toBe('error'); expect(stormSend('fixed')).toBe('fixed');
    expect(['idle','sent','error','fixing','fixed'].map(p => stormNext(p as StormPhase))).toEqual(['sent','error','fixing','fixed','fixed']);
  });
  test('poses: eight, active arm reaches furthest, null means all resting', () => {
    const p = posesFor(4, 1); expect(p).toHaveLength(8); expect(p[4].reach).toBe(1);
    expect(Math.max(...posesFor(null, 1).map(x => x.reach))).toBeLessThan(1);
  });
  ```
- [ ] **Step 2:** Run, fail. **Step 3:** Implement `interactions.ts` and `poses.ts`.
- [ ] **Step 4:** `Creature.tsx`: one sticky full-height panel inside a tall wrapper matching the creature range. It shows the card for `armIndexAt(progress)` beside the kraken (cards alternate left and right of centre so the creature stays visible), cross-fading by local progress. Spark shows the two choice buttons and the clock, started the first time arm 0 is active and cleared on unmount. Storm shows "Send the bad request"; the phases advance on timers (sent 600ms, error 1400ms, fixing 1200ms) and the card shows 500, then the defender's fix, then 404. Deliver shows 👍, which sets `delivered`. Charter's bid cards show their file list on hover and on keyboard focus. The "you" arm sets `lean` toward the cursor, and waves (a 1.2 second side-to-side of that arm's tip) when the cursor has been still for 4 seconds.
- [ ] **Step 5:** `Scene.tsx` passes `posesFor(armIndexAt(p), k)` and `moodFor(...)` to `<Kraken>`.
- [ ] **Step 6:** Tests pass; in the browser, step through all eight arms and all three interactions, including clicking each button twice. Commit: `feat: eight-arm scene and interactions`.

### Task 8: Props

**Files:**
- Create: `src/kraken/props.tsx`
- Modify: `src/kraken/Arm.tsx`

**Interfaces:**
- Produces: `<Prop kind={Arm['prop']} />`, a small group (max size 0.3 units) built from primitives in toon material, attached at the arm tip and oriented along the last segment.

- [ ] **Step 1:** Build seven props from boxes, cylinders, cones and tori: pencil, ear trumpet, flag, hammer, umbrella, sealed letter (with a coral seal), book. The eighth arm has none.
- [ ] **Step 2:** The active arm's prop scales from 0.8 to 1.15 as its card comes in.
- [ ] **Step 3:** In the browser, each prop is recognisable at the size it appears. Commit: `feat: arm props`.

### Task 9: Phones, reduced motion and fallbacks

**Files:**
- Create: `src/kraken/quality.ts`, `src/sections/CreatureList.tsx`
- Test: `src/kraken/quality.test.ts`
- Modify: `src/App.tsx`, `src/kraken/Scene.tsx`, `src/kraken/Arm.tsx`

**Interfaces:**
- Produces:
  ```ts
  export type Quality = { mode: 'full'|'lite'|'still'; armSegments: number; outline: boolean; bubbles: number; loop: boolean };
  export function qualityFor(d: { width: number; reducedMotion: boolean; webgl: boolean; cores: number }): Quality;
  ```
- Rules: no WebGL → `still` with `loop: false`; reduced motion → `still`; width under 768 or cores at most 4 → `lite` (`armSegments: 12`, `outline: false`, `bubbles: 12`); otherwise `full` (`armSegments: 24`, `outline: true`, `bubbles: 40`).

- [ ] **Step 1: Failing tests:** one assertion per rule above, plus: reduced motion wins over a wide, fast device; no WebGL wins over everything.
- [ ] **Step 2:** Run, fail. **Step 3:** Implement `quality.ts`; detect WebGL once by creating a context, and listen for `webglcontextlost` to drop to `still`.
- [ ] **Step 4:** `still` mode: the canvas renders one frame per stage change instead of looping (`frameloop="demand"`), no pinning, sections flow normally. Under 768px `CreatureList` replaces `Creature`: eight cards in a column, each with its arm name and the same interactions, and a kraken view pinned at the top of the section.
- [ ] **Step 5:** Tests pass; in the browser at 375px and with reduced motion emulated, all content and all three interactions are reachable. Commit: `feat: phone layout, reduced motion and fallbacks`.

### Task 10: Final checks

- [ ] **Step 1:** `npx vitest run` and `npm run build` pass with no TypeScript errors.
- [ ] **Step 2:** Lazy-load the 3D scene (`React.lazy`) so the hero text paints first; confirm in the network panel that three.js loads after first paint.
- [ ] **Step 3:** Browser pass at 1440, 1024 and 375 wide: hero fits the first screen, no horizontal scroll, no text over the kraken's face, gauge correct.
- [ ] **Step 4:** Keyboard pass: Tab reaches both hero buttons, each gauge mark, the three choice buttons, the copy button and the video button; Enter and Space work on each; focus rings are visible on paper and on deep green.
- [ ] **Step 5:** Contrast: body text and buttons at least 4.5:1 on `#ece7d9` and on `#0b2420`; fix any that fail.
- [ ] **Step 6:** Search the built HTML and JS for `\u2014` and `\u2013`: none in visible strings. Open every link.
- [ ] **Step 7:** Lighthouse on the production build (`npm run preview`); record the scores in the final report. Commit: `chore: final checks`.
