# Execution Layer Prototypes

Static HTML prototypes exploring a HubSpot MCX concept: a home surface that recommends what to do next, plus execution-layer Focus Modes that let the user act on those recommendations without leaving context.

## Running locally

From this directory:

```
python3 -m http.server 8765
```

Then open `http://localhost:8765/home.html`.

## Files

### Entry surface

| File | Purpose |
| --- | --- |
| `home.html` | Home / today surface. Lists recommended actions as brief cards. Each card has a CTA that opens the relevant Focus Mode in an iframe overlay (`#fm-overlay` / `#fm-iframe`). |

### Focus Modes

Full-screen iframe modals launched from `home.html`. Each has a left context panel and a right action panel, a floating chat, and a cursor-mode toggle that turns any context card into a Breeze context source.

| File | CTA on home | What it does |
| --- | --- | --- |
| `focus-mode-high-confidence.html` | Review email drafts | Contact-by-contact email reply flow with AI-drafted response and Back/Next pagination. |
| `focus-mode-outreach.html` | Start outreach / Review outreach | Multi-company outbound sequence. Company paginator in the footer, contact chips with Suggested/Engaged/All filter, Start outreach CTA. |
| `focus-mode-meeting-prep.html` | Start prep | Pre-meeting surface: participants, summary, deal, activity. Right panel has two drafts — customer agenda and internal pre-read. |
| `focus-mode-meeting-followup.html` | Review next steps | Post-meeting surface for the Meridian Mechanical pipeline review. Right panel has two drafts — a next-steps doc for the team and a follow-up email to the customer. |

### Shared

| File | Purpose |
| --- | --- |
| `modality-toggle.js` | Renders the bottom-right "Show modalities" dev button. Toggles `body.show-modalities` and decorates `[data-modality]` elements with a coloured outline and label. Only mounts its UI at the top level; inside iframes it mirrors the parent's state. |
| `nav-shell.html` | Shared navigation shell used by surrounding surfaces. |
| `index.html` | Prototype index (links surfaces from the design site). |

### Other surfaces (not focus modes)

`companies-index.html`, `companies-recommended-cards.html`, `companies-recommended-table.html`, `deal-record.html`, `deals-board.html`, `deals-board-recommendations.html`, `deals-needs-action.html` — standalone views used as additional prototype stops. These are navigated via the shared shell, not launched from `home.html`.

## Focus Mode conventions

All focus modes share the same shell, chat UX, and cursor-mode behaviour. Changes to any of these patterns should land in all four files.

- **Chat panel** (`.chat-panel`): floating overlay with header, messages, and a footer omnibar. Header has title, Select (cursor-mode) pill, Pin, Close.
- **Pinned sidebar** (`.chat-sidebar`): chat pops out to the right via `pinChat()` / `unpinChat()`. When pinned, `modal-group.sidebar-pinned` rounds all four corners of the main modal and collapses the context to one column.
- **Cursor mode** (`body.cursor-mode`): clicking any context card programmatically triggers its `.card-check` button, which highlights the card and inserts an "Asking about X" focus block at the end of the chat thread (replacing the default onboarding prompts).
- **Card focus block** (`.card-focus-block`): rendered by `insertContextMarker()` — a header plus the card's contextual prompts, appended to `#chatMessages`. `clearCardFocus()` restores the onboarding welcome when the card is deselected.
- **Modality attributes** (`data-modality="focus|breeze|user"`): decorative only; the `modality-toggle.js` script renders them when toggled on.

## State

- `sessionStorage` / `localStorage` are used for cross-page persistence where needed (e.g. `showModalities` flag).
- No build step, no framework. Plain HTML + inline CSS + inline JS, served static.
