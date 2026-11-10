// Scroll progress lives outside React: it changes every frame, and re-rendering the tree on
// each change would stutter. Consumers subscribe and write styles or 3D values directly.
type Fn = (p: number) => void;
let progress = 0;
let velocity = 0;
const subs = new Set<Fn>();

export const scrollStore = {
  get: () => progress,
  velocity: () => velocity,
  set(p: number, v = 0) {
    progress = p;
    velocity = v;
    subs.forEach((fn) => fn(p));
  },
  subscribe(fn: Fn) {
    subs.add(fn);
    fn(progress);
    return () => {
      subs.delete(fn);
    };
  },
};
