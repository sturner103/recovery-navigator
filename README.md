# Support Navigator

A stage-aware navigation tool to help individuals, families, and facilitators identify appropriate next steps in eating disorder support—without replacing professional care.

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Deploy to Netlify

**Option 1: Drag & Drop**
1. Run `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

**Option 2: Git Integration**
1. Push this repo to GitHub/GitLab
2. Connect to Netlify
3. Netlify auto-detects Vite and deploys

The `netlify.toml` is already configured for you.

## Project Structure

```
recovery-navigator/
├── src/
│   ├── App.jsx          # Main assessment component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml         # Netlify deployment config
```

## What's Built

### Assessment Engine
- 12 pattern-based questions (non-diagnostic, non-triggering)
- 4-point scale (0-3) for questions 1-11
- Deterministic scoring with stage bands:
  - Level 0 (0-7): Awareness & Early Concern
  - Level 1 (8-14): Emerging Patterns
  - Level 2 (15-22): Established Patterns
  - Level 3 (23-33): Higher Support Needs

### Safety Gate (Q12)
- Any non-zero response triggers immediate crisis redirection
- Bypasses all standard scoring and messaging
- Presents localized crisis resources (NZ, AU, International)

### Stage-Specific Outputs
- Positioning statement (non-labeling)
- What often helps at this stage
- What may be less helpful/premature
- What to watch for (escalation signs)
- Next-step call to action

### UI Features
- One question at a time with progress indicator
- Smooth fade transitions
- Mobile responsive
- Calm, supportive aesthetic (warm colors, readable typography)
- "Need help?" button for AI assistant (to be wired up)

## Next Steps to Build

1. **AI Navigation Assistant** - Wire up the help button to Claude API
2. **Resource Search** - Build the search layer that finds real resources
3. **Location Detection** - Auto-detect or ask for location
4. **Netlify Functions** - Add serverless functions for API calls

## Design Principles

- Navigation, not diagnosis
- Conservative safety protocols
- Respect user autonomy
- Never label users ("You are Level 2")
- Calm, non-clinical tone throughout
