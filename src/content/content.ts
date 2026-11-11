// All page copy and the chat messages. The messages follow one general example request (K-42
// on a team's orders API), written in the same shape as real Kraken output.

export type StageId = 'spark' | 'sonar' | 'charter' | 'forge' | 'storm' | 'deliver' | 'hallmark' | 'you';
export type PropKind = 'pencil' | 'trumpet' | 'flag' | 'hammer' | 'umbrella' | 'letter' | 'book';
export type ChatMsg = { who: string; text: string; note?: string; code?: string; files?: string };
export type Arm = {
  id: StageId;
  name: string;
  prop: PropKind | null;
  line: string;
  messages: ChatMsg[];
};

export const LINKS = {
  demo: 'https://youtu.be/o_IiLbg4gio',
  demoEmbed: 'https://www.youtube-nocookie.com/embed/o_IiLbg4gio?autoplay=1',
  repo: 'https://github.com/Anish-Juyal-01/Kraken',
  switchDocs: 'https://docs.switchagents.ai',
};

export const HERO = {
  headline: 'Ask for it in chat. Eight arms get to work.',
  sub: 'Kraken is a crew of AI agents that plans, builds, reviews and stress-tests your request, then waits for your thumbs-up.',
};

export const REQUEST = '@kraken build orders-api: add GET /api/orders/{id} that returns one order, or 404 when it does not exist';

export const PROBLEM = [
  'Decisions get made in chat.',
  'Then someone has to carry them into the code by hand.',
  'Kraken lives where the decision happens, and does the carrying.',
];

export const ARMS: Arm[] = [
  {
    id: 'spark',
    name: 'Spark',
    prop: 'pencil',
    line: 'A planner turns the request into a brief. Then Kraken asks who handles it.',
    messages: [
      { who: 'kraken-planner', text: "The request was clear, so I didn't need to ask anything. Brief written to the room document `brief`. BRIEF READY" },
      { who: 'kraken', text: "[K-42] Brief ready. Who's handling this? Reply 🙋 to do it yourself, or 🤖 to give it to the agent. No answer in 2 min: the agent takes it." },
    ],
  },
  {
    id: 'sonar',
    name: 'Sonar',
    prop: 'trumpet',
    line: 'Sonar listens to every room for decisions that contradict each other, or the code.',
    messages: [
      { who: 'kraken', text: '#product says the free tier is 100 requests a day. config/limits.yaml says 1000. Which one is true?' },
    ],
  },
  {
    id: 'charter',
    name: 'Charter',
    prop: 'flag',
    line: 'Every coding agent bids, naming the real files it will touch.',
    messages: [
      { who: 'claude-coder', text: 'BID: about 12 minutes to a reviewable branch', files: 'app/routes/orders.py, app/db.py, tests/test_orders.py' },
      { who: 'codex-coder', text: 'BID: about 10 minutes to a reviewable branch', files: 'app/routes/orders.py, tests/test_orders.py' },
      { who: 'gemini-coder', text: 'BID: 10 to 15 minutes to a reviewable branch', files: 'app/routes/orders.py, app/schemas.py, tests/test_orders.py' },
    ],
  },
  {
    id: 'forge',
    name: 'Forge',
    prop: 'hammer',
    line: 'The winner builds on its own branch. The other bidders review it against the brief.',
    messages: [
      {
        who: 'codex-coder',
        text: 'Hand-off for K-42: commit 8c4e21b on kraken/K-42',
        code: '@router.get("/api/orders/{order_id}")\ndef get_order(order_id: int, db: Session = Depends(get_db)):\n    order = db.get(Order, order_id)\n    if order is None:\n        raise HTTPException(status_code=404, detail="Order not found")\n    return OrderOut.model_validate(order)',
      },
      { who: 'claude-coder', text: "Checked against the brief's acceptance criteria and ran the tests. ACCEPTED" },
    ],
  },
  {
    id: 'storm',
    name: 'Storm',
    prop: 'umbrella',
    line: 'Chaos agents attack the running app. Try it: send the request that broke it.',
    messages: [
      { who: 'squall', text: 'Fault 1, bad_payload, aimed at the new GET /api/orders/{id}: 64 malformed requests, no 5xx. Then a targeted follow-up.' },
    ],
  },
  {
    id: 'deliver',
    name: 'Deliver',
    prop: 'letter',
    line: 'Nothing leaves the chat without a person. This step never has a timer.',
    messages: [
      { who: 'kraken', text: '[K-42] Storm survived. Open a pull request? (No time limit: a person decides.)' },
    ],
  },
  {
    id: 'hallmark',
    name: 'Hallmark',
    prop: 'book',
    line: 'Every decision is written down: who decided, and why.',
    messages: [
      { who: 'hallmark', text: 'Judged winner: codex-coder. "Smallest change that meets every acceptance criterion, and the only bid with a test for the missing-order case." Decided by Kraken, no person replied in 2 min.' },
    ],
  },
  {
    id: 'you',
    name: 'You',
    prop: null,
    line: 'The eighth arm is yours. People get the first word at every step. Agents only take over when nobody answers.',
    messages: [],
  },
];

export const STORM = {
  request: 'GET /api/orders/9223372036854775808',
  button: 'Send the bad request',
  error: { code: '500', text: 'Internal Server Error', why: "One past the 64-bit limit. SQLite can't bind an integer that large." },
  fix: { who: 'storm-defender', text: "Fixed in commit 1f9a7d0: ids outside SQLite's signed 64-bit range now return 404, with regression tests." },
  fixed: { code: '404', text: '{"detail": "Order not found"}', why: 'Squall confirmed: 7 tests passed.' },
};

export const DELIVER = {
  approved: '@codex-coder [K-42] approved. Push the branch kraken/K-42 and open a pull request against the base branch.',
};

export const SPARK = {
  yours: "[K-42] You are handling Spark: no time limit. Reply 🤖 any time to give it to the agent.",
  agent: '[K-42] Spark: handed to the agent by Kraken (no reply from a person in 2 min).',
  agentChosen: '[K-42] Spark: handed to the agent by you.',
};

export const SWITCH_ROWS: { feature: string; use: string }[] = [
  { feature: 'Rooms on Discord', use: 'Every stage of every request gets its own channel, so people and agents work side by side.' },
  { feature: 'Agent protocol', use: 'Kraken is itself a Switch agent. One event stream lets it hear every room it belongs to.' },
  { feature: 'Room templates', use: 'Each stage is a template. Kraken opens rooms on demand with the right agents and people in them.' },
  { feature: 'Bring any agent', use: 'Claude Code, Codex, OpenCode with Gemini: add an agent in Switch and it bids at the next Charter.' },
  { feature: 'Runs and documents', use: 'One run records every room of a request. Briefs and the decision ledger live as room documents.' },
];

export const ANY = 'Any repo: @kraken connect <url>. Any agent: whatever you add in Switch joins the crew on its own.';

export const ASCENT = 'One thumbs-up from a person, and the pull request opens.';

export const RUN_STEPS = [
  'git clone https://github.com/Anish-Juyal-01/Kraken.git && cd Kraken',
  'python -m venv .venv && source .venv/bin/activate',
  'pip install -e ".[dev]"',
  'python scripts/register.py   # prints the two keys for .env',
  'python -m kraken.main',
];
