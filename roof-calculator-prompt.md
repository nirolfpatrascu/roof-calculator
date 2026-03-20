# CLAUDE CODE PROMPT — Roof Calculator for Construction Material Supplier

## YOUR ROLE

You are my senior full-stack development partner. We are building a **production-ready demo** of a Roof Area Calculator + Tile Offer Generator for a Romanian construction material supplier. The end goal is a white-label widget embeddable in the supplier's website and connected to their CRM. Right now we are building the standalone demo.

**Before writing ANY code**, walk me through the full project setup step by step. Ask me to confirm each step is done before moving to the next. Do not skip ahead.

---

## PHASE 0 — GUIDED ENVIRONMENT SETUP

Guide me through these steps **one at a time**, confirming completion before proceeding:

### 0.1 — GitHub Repository
1. Ask me to create a new GitHub repo named `roof-calculator` (private, with README).
2. Ask me to clone it locally.
3. Confirm the local folder path before continuing.

### 0.2 — Project Initialization
1. Initialize a **Next.js 14+ (App Router)** project with TypeScript inside the cloned repo.
2. Use `pnpm` as package manager.
3. Set up Tailwind CSS + shadcn/ui.
4. Confirm the dev server runs at `localhost:3000`.

### 0.3 — Supabase Project
1. Ask me to create a new Supabase project (name suggestion: `roof-calculator`).
2. Ask me for the Supabase URL and anon key.
3. Set up `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Install `@supabase/supabase-js` and create the Supabase client utility at `lib/supabase.ts`.
5. Confirm the connection works with a simple test query.

### 0.4 — Vercel Deployment
1. Ask me to connect the GitHub repo to Vercel.
2. Guide me to add the Supabase env vars in Vercel project settings.
3. Confirm the first deployment succeeds.
4. From this point on, every push to `main` auto-deploys.

### 0.5 — Claude Code Configuration
1. Create a `.claude/settings.json` with appropriate permissions for the project (file read/write within repo, shell commands for pnpm/git).
2. Create a `CLAUDE.md` at root with project conventions (described below).

---

## PHASE 1 — DATABASE SCHEMA (Supabase)

Create the following tables via Supabase SQL editor. Generate the migration SQL and ask me to run it:

### Tables

```
vendors
├── id (uuid, PK)
├── name (text, NOT NULL) — e.g., "Bramac", "Tondach", "Creaton"
├── logo_url (text, nullable)
├── created_at (timestamptz)

tile_types
├── id (uuid, PK)
├── vendor_id (uuid, FK → vendors.id)
├── name (text, NOT NULL) — e.g., "Bramac Montero"
├── coverage_length_mm (numeric) — usable length per tile in mm
├── coverage_width_mm (numeric) — usable width per tile in mm
├── coverage_per_sqm (numeric) — tiles needed per m² (precomputed)
├── price_per_tile (numeric) — RON, ex-VAT
├── price_per_sqm (numeric, nullable) — RON, if sold per m²
├── weight_per_tile_kg (numeric, nullable)
├── color (text, nullable)
├── image_url (text, nullable)
├── is_active (boolean, default true)
├── created_at (timestamptz)

calculations
├── id (uuid, PK)
├── roof_type (text) — 'mono' | 'gable' | 'triple' | 'quad'
├── dimensions (jsonb) — { sides: [{ label: "A", length_m: 8, width_m: 5 }] }
├── total_area_sqm (numeric)
├── tile_type_id (uuid, FK → tile_types.id, nullable)
├── total_tiles (integer, nullable)
├── total_price (numeric, nullable)
├── waste_percentage (numeric, default 10) — configurable overage
├── customer_name (text, nullable)
├── customer_phone (text, nullable)
├── customer_email (text, nullable)
├── created_at (timestamptz)
```

### Row-Level Security
- Enable RLS on all tables.
- `vendors` and `tile_types`: public read, admin write.
- `calculations`: public insert + read own (by id), admin read all.

### Seed Data
Prepare seed SQL with 2–3 vendors and 3–5 tile types each. Use realistic Romanian market data. Ask me if I have specific vendor documents to extract tile dimensions and prices from. If I provide PDFs or images, parse the tile specs from those.

---

## PHASE 2 — APPLICATION ARCHITECTURE

```
src/
├── app/
│   ├── page.tsx                  — Landing / entry point
│   ├── calculator/
│   │   └── page.tsx              — Main calculator wizard
│   ├── offer/
│   │   └── [id]/page.tsx         — Generated offer view (shareable URL)
│   └── admin/
│       └── page.tsx              — Tile/vendor management (basic)
├── components/
│   ├── roof-selector/
│   │   ├── RoofTypeCard.tsx      — Clickable card with roof SVG
│   │   └── RoofTypeSelector.tsx  — Grid of 4 roof type options
│   ├── dimension-input/
│   │   ├── RoofDiagram.tsx       — Interactive SVG showing labeled sides
│   │   └── DimensionForm.tsx     — Inputs for each side dimension
│   ├── tile-selector/
│   │   ├── VendorSelect.tsx      — Vendor dropdown/cards
│   │   └── TileTypeSelect.tsx    — Tile type grid with specs
│   ├── offer/
│   │   ├── OfferSummary.tsx      — Final calculation results
│   │   └── OfferPDF.tsx          — PDF-exportable offer layout
│   └── ui/                       — shadcn/ui components
├── lib/
│   ├── supabase.ts               — Supabase client
│   ├── calculations.ts           — Area formulas per roof type
│   └── types.ts                  — TypeScript interfaces
└── hooks/
    └── useCalculator.ts          — Calculator state machine
```

---

## PHASE 3 — CALCULATOR WIZARD (Core UX)

Build a **multi-step wizard** with these steps. Each step must be fully complete before the next unlocks.

### Step 1 — Roof Type Selection

Display **4 clickable cards** in a 2×2 grid, each containing:

| Roof Type | Sides | Visual Description |
|-----------|-------|--------------------|
| **Mono-slope (Shed)** | 1 slope | Single angled rectangle — one flat plane tilting from a high edge to a low edge |
| **Gable (Dual-slope)** | 2 slopes | Classic triangle-topped house — two rectangular planes meeting at a ridge, forming an inverted V when seen from the end |
| **Triple-slope** | 3 slopes | Like a gable with one hip end — two large rectangular slopes plus one triangular slope closing off one side |
| **Quad-slope (Hip)** | 4 slopes | Pyramid-style — four planes (two trapezoidal, two triangular) all sloping inward from every wall, meeting near the top |

**Visual requirements for each card:**
- Create a **clean SVG illustration** showing a 3D-perspective view of the roof type.
- Use a muted color palette: roof slopes in terracotta/warm brown tones, edges/ridges highlighted.
- Label each slope surface clearly (A, B, C, D) directly on the SVG.
- On hover: subtle elevation shadow + slight scale.
- On select: highlighted border + checkmark.
- Below each SVG: roof type name + "X slope(s)" subtitle.

**SVG Design Direction:**
- Isometric or light 3D perspective (viewed slightly from above and to the right).
- Each visible slope face is labeled with its letter (A, B, C...) in a contrasting color.
- Ridge lines drawn in a darker stroke.
- Keep it schematic/technical, not photorealistic. Think "architectural diagram".

### Step 2 — Dimension Input

Based on the roof type selected, display:

1. **A larger reference SVG diagram** of the selected roof type with the labeled sides (A, B, C...) clearly visible. This diagram should be the "legend" the user refers to while entering numbers.

2. **Input fields** for each slope, grouped by side label:
   - **Mono-slope (1 side):** Side A → Length (m), Width (m)
   - **Gable (2 sides):** Side A → Length, Width; Side B → Length, Width (pre-fill B = A, editable)
   - **Triple-slope (3 sides):** Sides A, B (rectangles) → Length, Width each; Side C (triangle) → Base, Height
   - **Quad-slope (4 sides):** Sides A, B (trapezoids) → Top edge, Bottom edge, Height; Sides C, D (triangles) → Base, Height

3. **Live area calculation** — as the user types, calculate and display:
   - Individual slope area (next to each input group)
   - **Total roof area** in bold, large font
   - All in m² with 2 decimal places

**Area Formulas:**
- Rectangle: length × width
- Triangle: (base × height) / 2
- Trapezoid: ((top + bottom) / 2) × height

### Step 3 — Tile Selection

1. **Vendor selector**: Cards or dropdown showing vendor name + logo. On select, filter tile types.
2. **Tile type selector**: Grid of tile cards, each showing:
   - Tile name
   - Tile image (if available)
   - Coverage: X tiles/m²
   - Price per tile and price per m²
   - Color swatch
3. On tile selection, **auto-calculate**:
   - Total tiles needed = ceil(total_area × coverage_per_sqm × (1 + waste_percentage/100))
   - Total price = total_tiles × price_per_tile
   - Show waste percentage with a slider (default 10%, range 5–20%)

### Step 4 — Offer Generation

Display a **professional offer summary**:
- Roof type + diagram thumbnail
- Dimensions table (side, dimensions, area)
- Selected tile info (vendor, tile name, specs)
- Calculation breakdown (area → tiles needed → waste → total tiles → unit price → **total price in RON**)
- Optional: customer name, phone, email fields
- **"Save Offer"** button → saves to `calculations` table, generates shareable URL
- **"Download PDF"** button → generates a branded PDF offer
- **"Request Quote"** button → placeholder for CRM integration (shows a toast: "In production, this sends the offer to the supplier's CRM")

---

## PHASE 4 — OFFER PAGE (Shareable)

Route: `/offer/[id]`
- Fetches saved calculation from Supabase by ID.
- Renders a clean, printable offer page.
- Shows all details from Step 4.
- Includes a "Recalculate" link back to the calculator pre-filled with these dimensions.

---

## PHASE 5 — ADMIN PANEL (Basic)

Route: `/admin` (no auth for demo, just a hidden route)
- CRUD for vendors (name, logo URL).
- CRUD for tile types (all fields).
- Table view with inline editing.
- Bulk import: paste CSV or upload a simple spreadsheet of tile specs.

---

## PHASE 6 — POLISH & PRODUCTION READINESS

### UI/UX
- Fully responsive (mobile-first — construction workers use phones on-site).
- Romanian language as primary (hardcode strings, prepare for i18n later).
- Loading skeletons for data fetches.
- Form validation with clear error messages.
- Smooth step transitions (framer-motion or CSS transitions).

### Technical
- All Supabase queries via server actions or route handlers (not client-side for writes).
- TypeScript strict mode, no `any` types.
- Zod validation on all form inputs and API boundaries.
- Error boundaries on each wizard step.
- SEO meta tags on the offer page (for when links are shared on WhatsApp/social).

### Performance
- SVG roof diagrams: inline, no external image loads.
- Tile images: Next.js Image component with Supabase Storage URLs.
- Calculator logic: client-side only (no API calls until save).

---

## CLAUDE.md FILE CONTENT

Create this at the project root:

```markdown
# ROOF CALCULATOR — Project Conventions

## Stack
- Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL + Auth + Storage)
- Vercel (deployment)
- pnpm (package manager)

## Code Style
- Strict TypeScript (no `any`)
- Zod for all runtime validation
- Server Actions for mutations, client-side for reads where appropriate
- Components: PascalCase files, one component per file
- Utilities: camelCase files in lib/

## Architecture Decisions
- Calculator state managed via useReducer in useCalculator hook
- Roof SVGs are inline React components (no external images)
- All prices in RON (Romanian Lei), ex-VAT
- Waste percentage is user-adjustable (default 10%)
- Shareable offers via /offer/[id] route

## Database
- Supabase with RLS enabled on all tables
- UUIDs for all primary keys
- Timestamps in UTC

## Naming
- Romanian-facing strings: hardcoded Romanian (prepare for i18n)
- Code: English only
- Branch strategy: main (production), feature/* for development

## Testing Strategy (for later phases)
- Vitest for unit tests on calculation functions
- Playwright for E2E on the wizard flow
```

---

## DEVELOPMENT ORDER

Build in this exact sequence, committing after each milestone:

1. **Setup** (Phase 0) — repo, project init, Supabase, Vercel
2. **Database** (Phase 1) — schema, RLS, seed data
3. **Roof Type Selector** (Phase 3, Step 1) — SVG illustrations + selection UX
4. **Dimension Input** (Phase 3, Step 2) — diagrams + forms + live calculation
5. **Tile Selector** (Phase 3, Step 3) — vendor/tile selection + pricing
6. **Offer Generation** (Phase 3, Step 4) — summary + save + PDF
7. **Offer Page** (Phase 4) — shareable URL view
8. **Admin Panel** (Phase 5) — basic CRUD
9. **Polish** (Phase 6) — responsive, validation, error handling, transitions

**After each milestone**: push to GitHub, verify Vercel deployment, show me the result and ask for feedback before moving to the next milestone.

---

## IMPORTANT CONSTRAINTS

- **Do NOT scaffold everything at once.** Build step by step, verify each piece works, then move on.
- **Show me previews** of the SVG roof illustrations before integrating them so I can give feedback on the visual style.
- **Ask me for vendor documents** before seeding the database — I may have PDFs with real tile specifications and prices.
- **Keep the wizard state in a single reducer** so it can be serialized/restored later (for the "Recalculate" feature).
- **Every component must be self-contained** and embeddable — this will eventually be an iframe widget or web component.

---

## FUTURE PHASES (Do not build now, but design with these in mind)

- **CRM Integration**: Webhook on offer save → sends lead to supplier's CRM (HubSpot, Salesforce, or custom).
- **User Accounts**: Suppliers log in to manage their tile catalog and view customer calculations.
- **White-label Mode**: Configurable logo, colors, and tile catalog per supplier instance.
- **Multi-language**: Romanian (default), English, Hungarian.
- **Advanced Roof Types**: Mansard, cross-gable, L-shaped, dormer additions.
- **Accessories Calculator**: Ridge tiles, valley tiles, underlayment, fasteners.
- **Map Integration**: Customer enters address → satellite roof measurement suggestion (Google Solar API).

---

## BEGIN

Start with Phase 0, Step 0.1. Ask me to create the GitHub repository and confirm when it's ready.
