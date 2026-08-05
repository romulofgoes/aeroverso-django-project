<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Form inputs must set an explicit text color

The `<body>` in `src/app/layout.tsx` sets `text-slate-100` (near-white) globally for the dark theme. Any form rendered on a light (`bg-white`/`bg-gray-50`) card — e.g. `CreateAuthor.tsx`, `EditAuthor.tsx` — must set an explicit text color (`text-gray-700` or similar) on its `<input>`/`<textarea>` elements, otherwise the typed text inherits the light body color and becomes unreadable against the light background.
