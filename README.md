# Nirali Sai Platform

A monorepo containing four luxury Indian bridal/fashion web applications built with Next.js 14, TypeScript, and Tailwind CSS.

## Project Structure

```
nirali-sai-platform/
├── apps/
│   ├── boutique/           # Luxury Boutique App
│   ├── bridal-jewels/      # Bridal Jewelry App
│   ├── sasthik/            # Sasthik App
│   └── tamilsmakeover/     # Tamils Makeover App
├── packages/
│   ├── ui/                 # Shared UI Components
│   ├── types/              # Shared TypeScript Types
│   ├── utils/              # Shared Utilities
│   └── api-client/         # Shared API Client
└── backend/                # Node.js + Express API Server
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State Management**: Zustand (client), React Query (server)
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm with workspaces

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Start the development server: `pnpm dev`

## Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm start` - Start all apps in production mode
- `pnpm lint` - Lint all packages

## Brand Colors

### Boutique
- Rose: #C0436A
- Gold: #C9922A
- Ivory: #FAF7F0

### Bridal Jewels
- Gold: #B8860B
- Maroon: #800020
- Cream: #FFFDD0

### Sasthik
- Teal: #1A7A7A
- Rose Gold: #B76E79
- White: #FFFFFF

### Tamilsmakeover
- Plum: #6B2D8B
- Blush: #F8C8D4
- Soft: #FDF6FF