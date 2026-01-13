# Recovery Navigator

A stage-aware navigation tool to help individuals, families, and facilitators identify appropriate next steps in eating disorder support—without replacing professional care.

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Note: Resource search requires the Netlify Function, which won't work in local dev without additional setup. The assessment and methodology sections work fully offline.

### Deploy to Netlify

**Option 1: Git Integration (Recommended)**
1. Push this repo to GitHub/GitLab
2. Connect to Netlify
3. Add environment variable: `ANTHROPIC_API_KEY` = your Claude API key
4. Deploy

**Option 2: Drag & Drop + CLI**
1. Run `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Use Netlify CLI to deploy functions separately (or use Git integration)

### Setting up the API Key

The resource search feature requires a Claude API key from Anthropic.

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. In Netlify: Site settings → Environment variables
3. Add: `ANTHROPIC_API_KEY` = `sk-ant-...`

Without this key, the assessment works but resource search will fail.

## Project Structure

```
recovery-navigator/
├── src/
│   ├── App.jsx          # Main app component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── netlify/
│   └── functions/
│       └── search-resources.js  # AI resource search function
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

### Transparency Section
- Full methodology explanation
- All five levels described
- What questions measure
- What the tool does NOT do
- How scoring works

### Resource Search (AI-Powered)
- User inputs location and preference (local/remote/both)
- Netlify Function calls Claude API with web search
- Returns real, current resources matched to stage
- Results include names, descriptions, URLs, phone numbers

### UI Features
- Welcome screen with clear expectations
- One question at a time with progress indicator
- Smooth fade transitions
- Mobile responsive
- Calm, supportive aesthetic

## Next Steps to Build

1. **AI Navigation Assistant** - Help button during assessment
2. **Location auto-detection** - Use browser geolocation
3. **Save/share results** - Export or email results
4. **More crisis resources** - Expand international coverage

## Design Principles

- Navigation, not diagnosis
- Conservative safety protocols
- Respect user autonomy
- Never label users ("You are Level 2")
- Calm, non-clinical tone throughout
- Real resources, not made-up directories
