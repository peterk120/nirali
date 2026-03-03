# Qoderr Rules - Master File

## PROJECT: Nirali Sai Group — 4 luxury Indian bridal/fashion web apps

## QUALITY STANDARD: BlueStone + Nykaa + WedMeGood level

### TECH RULES (NEVER deviate)

- Next.js 14 App Router + TypeScript (strict) + Tailwind CSS

- Shadcn/ui + Radix UI for all UI primitives

- Framer Motion for ALL animations — no CSS-only animations

- Zustand for client state, React Query for server state

- React Hook Form + Zod for ALL forms

### UI RULES (NON-NEGOTIABLE)

- Mobile-first: design at 375px, enhance up

- All interactive elements: hover + focus + active + disabled states

- Loading: skeleton screens first, spinners only inside buttons

- Images: always next/image, always include width/height or fill

- Fonts: Playfair Display (headings) + DM Sans (body)

- Never use alert() — use react-hot-toast

- Never use inline styles — Tailwind only

- Never hardcode colors — use brand token classes

- Add aria-labels to all icon-only buttons

- All modals: closeable by Escape + outside click + X button

### BRAND COLORS

- Boutique: brand-rose=#C0436A, brand-gold=#C9922A, brand-ivory=#FAF7F0

- Bridal Jewels: brand-gold=#B8860B, brand-maroon=#800020, brand-cream=#FFFDD0

- Sasthik: brand-teal=#1A7A7A, brand-rose-gold=#B76E79, bg-white=#FFFFFF

- Tamilsmakeover: brand-plum=#6B2D8B, brand-blush=#F8C8D4, bg-soft=#FDF6FF

### CODE RULES

- TypeScript: no "any", always type component props with interface

- Named exports for components, default export for pages only

- All API calls in lib/api.ts — never inline fetch in components

- Use cn() from lib/utils.ts for all conditional class merging

- Every page.tsx must have generateMetadata() export

- Error boundaries around all major page sections

### ALWAYS INCLUDE (unless told not to)

- Empty state UI for every list or grid

- Loading skeleton for every async component

- Error state with retry button for all API calls

- Toast feedback for every user action (add to cart, book, etc)

- WhatsApp floating button on all non-checkout pages


### Strict Prompt Execution Policy

- Follow the prompt exactly as given.

- Do not add assumptions, explanations, optimizations, or extra content.

- Do not modify the scope or introduce new ideas.

-Return only what is explicitly requested in the prompt.


### Change Control & Permission Rule

- Do not delete, replace, or modify any existing code unless explicitly instructed in the prompt.

- Do not use alternative methods or different approaches unless mentioned.

- If any deletion, replacement, or different method is required that is not specified in the prompt, you must ask for permission and wait for approval before proceeding.


### DEPENDENCY MANAGEMENT RULE (MANDATORY)

- If any required package is missing or not found, install it before proceeding.

- Install only the exact package required for the implementation.

- Do not install additional, unrelated, or optional packages unless explicitly instructed.

- If a version conflict occurs, pause and request clarification before resolving it.

- After installation, ensure the project builds without errors before continuing.

- Do not modify package versions, remove dependencies, or upgrade libraries unless explicitly mentioned in the prompt.