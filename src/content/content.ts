// All page copy and the recorded chat messages. Message text comes from real Kraken runs:
// K-5 on fastapi-todo, the Gemini bid from K-10, the Sonar example from the bundled demo app.

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

export const REQUEST = '@kraken build fastapi-todo: add a JSON endpoint GET /api/todos/{item_id}, or 404 when it does not exist';

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
      { who: 'kraken', text: "[K-5] Brief ready. Who's handling this? Reply 🙋 to do it yourself, or 🤖 to give it to the agent. No answer in 2 min: the agent takes it." },
    ],
  },
  {
    id: 'sonar',
    name: 'Sonar',
    prop: 'trumpet',
    line: 'Sonar listens to every room for decisions that contradict each other, or the code.',
    messages: [
      { who: 'kraken', text: '#product says the free tier is 100 requests a day. config/limits.yaml says 1000. Which one is true?', note: 'Example from the bundled demo app, not from run K-5.' },
    ],
  },
  {
    id: 'charter',
    name: 'Charter',
    prop: 'flag',
    line: 'Every coding agent bids, naming the real files it will touch.',
    messages: [
      { who: 'claude-coder', text: 'BID: about 10 minutes to a reviewable branch', files: 'main.py, requirements.txt, conftest.py, tests/test_api.py' },
      { who: 'claude-coder-2', text: 'BID: about 10 minutes to a reviewable branch', files: 'main.py, tests/test_api.py, conftest.py, requirements.txt' },
      { who: 'gemini-coder', text: 'BID: 8 to 10 minutes to a reviewable branch', files: 'demo/shopfront/api/main.py, tests/test_shopfront.py', note: 'From run K-10. Gemini joined the crew after K-5.' },
    ],
  },
  {
    id: 'forge',
    name: 'Forge',
    prop: 'hammer',
    line: 'The winner builds on its own branch. The other bidders review it against the brief.',
    messages: [
      {
        who: 'claude-coder-2',
        text: 'Hand-off for K-5: commit 3d1a53c on kraken/K-5',
        code: '@app.get("/api/todos/{item_id}")\ndef api_get_todo(item_id: int, db: Session = Depends(get_db)):\n    todo = get_todo(db, item_id)\n    if todo is None:\n        raise HTTPException(status_code=404, detail="Todo not found")\n    return {"id": todo.id, "content": todo.content}',
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
      { who: 'squall', text: 'Fault 1, bad_payload, aimed at the new GET /api/todos/{item_id}: 64 malformed requests, no 5xx. Then a targeted follow-up.' },
    ],
  },
  {
    id: 'deliver',
    name: 'Deliver',
    prop: 'letter',
    line: 'Nothing leaves the chat without a person. This step never has a timer.',
    messages: [
      { who: 'kraken', text: '[K-5] Storm survived. Open a pull request? (No time limit: a person decides.)' },
    ],
  },
  {
    id: 'hallmark',
    name: 'Hallmark',
    prop: 'book',
    line: 'Every decision is written down: who decided, and why.',
    messages: [
      { who: 'hallmark', text: 'Judged winner: claude-coder-2. "It handles the import-time create_all trap correctly by redirecting the engine to a temp dir in conftest before main is imported. It also keeps the change smallest."' },
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
  request: 'GET /api/todos/9223372036854775808',
  button: 'Send the bad request',
  error: { code: '500', text: 'Internal Server Error', why: "One past the 64-bit limit. SQLite can't bind an integer that large." },
  fix: { who: 'storm-defender', text: "Fixed in commit ff50ced: ids outside SQLite's signed 64-bit range now return 404, with regression tests." },
  fixed: { code: '404', text: '{"detail": "Todo not found"}', why: 'Squall confirmed: 7 tests passed.' },
};

export const DELIVER = {
  approved: '@claude-coder-2 [K-5] approved. Push the branch kraken/K-5 and open a pull request against the base branch.',
};

export const SPARK = {
  yours: "[K-5] You are handling Spark: no time limit. Reply 🤖 any time to give it to the agent.",
  agent: '[K-5] Spark: handed to the agent by Kraken (no reply from a person in 2 min).',
  agentChosen: '[K-5] Spark: handed to the agent by you.',
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
