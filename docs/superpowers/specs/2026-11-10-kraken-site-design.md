# Kraken website: design

Date: 2026-11-10. Status: draft for review.

## Goal

A single-page marketing site for Kraken (github.com/Anish-Juyal-01/Kraken) that people want to
scroll to the end. It must explain what Kraken does, show how it uses Switch, and send people to
the demo video and the repo.

**Audience:** hackathon judges (Flip the Switch) and developers or teams who might run Kraken.
Judges need the demo video and the Switch story early; developers need the run steps at the end.

**Success looks like:**
- The first screen says what Kraken is and shows the creature.
- Scrolling tells the whole pipeline in order, with real messages from run K-5.
- A visitor can reach the demo video and the repo from the first and the last screen.
- It stays smooth on a mid-range laptop and usable on a phone.

## Concept: The Descent, with eight arms

The page is a dive. The visitor starts at the sea surface and scrolls down to a cute 3D kraken at
the bottom, whose eight arms each hold one part of Kraken. Then the page rises back to the surface.

### Page order

| # | Section | What happens |
|---|---|---|
| 1 | Surface (hero) | Bone-paper sea surface with a chat channel floating on it. The kraken peeks over the waterline: only its eyes show. Headline, one line of subtext, two buttons: "Watch the demo", "View on GitHub". |
| 2 | Waterline | A chat message `@kraken build …` is typed, then sinks. The camera follows it under. The depth gauge appears. |
| 3 | Descent | Short fall through the water. The problem in two or three lines: decisions made in chat never reach the code. Arms pass through frame. |
| 4 | The creature | Pinned scene. The kraken sits centre. Each scroll step brings one arm forward with its stage (see below). |
| 5 | Sea floor | How Kraken is built on Switch (short table), plus "any repo, any agent". |
| 6 | Ascent | One fast rise. A person's thumbs-up brings the work to the surface. |
| 7 | Surface again | Embedded demo video, the commands to run Kraken, links. |

### The eight arms (section 4)

Each arm carries a small prop and shows real content from run K-5.

| Arm | Prop | Content | Interaction |
|---|---|---|---|
| Spark | pencil | The planner's brief message | The page asks the visitor 🙋 or 🤖 with a sped-up 2-minute clock. 🙋: "it's yours, no time limit". 🤖 or timeout: "the agent takes it". |
| Sonar | ear trumpet | A conflict from the bundled shopfront demo (not from K-5): `#product` says 100 a day, `limits.yaml` says 1000 | none |
| Charter | flag | Bids from the Claude coders and Gemini | Hover a bid to see its files |
| Forge | hammer | Commit 3d1a53c and the endpoint code, reviewer's ACCEPTED | none |
| Storm | umbrella | Squall's attack | Visitor clicks "Send the bad request": 500 appears, kraken is startled, defender's fix lands, 404, kraken relieved |
| Deliver | sealed letter | "Open a pull request?" | Visitor clicks 👍; kraken looks proud |
| Hallmark | book | The recorded pick reason for claude-coder-2 | none |
| You | none | "Human first": people get the first word at every step | This arm follows the cursor and waves |

The Gemini bid is from run K-10 and is labelled as such, as in the demo video. No pull-request
link is shown, because no real PR was opened.

## The kraken

- Real-time 3D in the browser (Three.js), built from code: no model file, no video, no generated
  images.
- **Body:** round soft head (sculpted sphere), two large eyes with pupils and eyelids, a small
  mouth. **Arms:** eight short, chubby tapered tubes built along curves, with a row of suckers.
- **Shading:** storybook toon shading: two or three flat tones and a soft dark outline. No gloss,
  no glow.
- **Behaviour:**
  - eyes track the cursor; random blinks;
  - arms sway idly, lean toward the cursor, and lag slightly behind scroll speed;
  - bubbles on fast movement;
  - waves if the cursor is still for a few seconds.
- **Moods** (eyelids, pupil size, mouth, body squash): neutral, curious (Spark), concentrating
  (Forge), startled then relieved (Storm), proud (Deliver).
- **Build order if time is short:** eyes and arms, then moods, then props.

## Look

- **Colors:** bone paper `#ece7d9` and bottle-green ink `#12332d` at the surface; deep bottle green
  `#0b2420` with bone text in the deep. One accent: coral red `#e8553d`, used for the kraken,
  buttons and the depth gauge. The page darkens once, continuously, with depth. No other theme
  flips, gradients on text, or glows.
- **Type:** Bricolage Grotesque for headlines, Geist for body, Geist Mono for chat messages and
  code. Fonts are self-hosted.
- **Shape:** one corner radius (14px) for cards and message bubbles; buttons are full pills.
- **Chat messages** are real components with real text, styled as the site's own chat cards, not
  as Discord screenshots.
- **Depth gauge:** a thin vertical scale on the right showing depth and the current stage name. It
  is the page's progress indicator and also works as navigation (click a mark to jump).
- **Copy rules:** plain sentences, no filler verbs, no em-dashes, one label per button intent
  ("Watch the demo", "View on GitHub").

## Motion

- Everything is driven by scroll position (GSAP ScrollTrigger, scrubbed) or by a visitor action.
  The only ambient motion is the kraken's idle sway, blinking and bubbles.
- Only `transform` and `opacity` are animated in the DOM. The 3D scene has one render loop.
- `prefers-reduced-motion`: no camera travel and no pinning. The page becomes a normal vertical
  page with the same content and interactions. The kraken is drawn once per section as a single
  still frame of the 3D scene (no render loop), in that section's mood.

## Phones and slow devices

- Under 768px the pinned eight-arm scene becomes a vertical list: one card per arm, with a small
  kraken view at the top of the section.
- The 3D scene drops to fewer segments per arm and no outline pass on small or slow devices. If
  WebGL is unavailable, a still image is shown.

## Tech

- **Location:** `C:\Users\jlali\Documents\Projects\kraken-site`, its own git repository.
- **Stack:** Vite, React, TypeScript, Tailwind v4, Three.js through react-three-fiber, GSAP with
  ScrollTrigger. No Motion library, so two animation systems never fight over the same elements.
- **Structure:**
  - `src/content/` the copy and the K-5 messages as typed data, one file;
  - `src/kraken/` the 3D creature: `Body`, `Arm`, `Eyes`, `moods`, `props`, each its own file;
  - `src/scroll/` one module that owns the scroll timeline and exposes progress (0 to 1) and the
    current stage to everything else;
  - `src/sections/` one component per page section;
  - `src/ui/` chat card, button, depth gauge.
- The 3D scene reads scroll progress and the current stage from `src/scroll/`; sections never talk
  to the 3D scene directly.
- **Hosting:** GitHub Pages under Anish-Juyal-01. Publishing is public, so it needs the owner's OK
  first.

## Checks before calling it done

- Viewed in the browser at 1440px, 1024px and 375px wide.
- Reduced-motion version checked.
- Every interaction works with keyboard as well as mouse; buttons and text meet WCAG AA contrast
  in both the paper and deep-green parts of the page.
- A Lighthouse run, with the 3D code loaded after the first screen's text so the page appears fast.
- All links (video, repo, Switch docs) open.

## Out of scope

- Multiple pages, a blog, docs.
- A live connection to a running Kraken: the mock chat replays recorded messages.
- A typed "try a request" box (possible later; the click interactions cover the same need).
- Higgsfield-generated art: the account has no credits. If that changes, a generated still could
  replace the reduced-motion images.
