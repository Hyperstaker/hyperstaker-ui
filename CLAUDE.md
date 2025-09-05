# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hyperstaker is a decentralized platform that connects early-stage software projects with contributors and funders through Hypercerts. The platform bridges the funding gap between innovation and venture capital by creating utility, value, and demand for Hypercerts, enabling users to predict and fund promising public goods projects while securing a vested interest in their success.

## Core Architecture

### Technology Stack
- **Frontend**: Next.js 15.2.4 with App Router, React 19.1.0, TypeScript 5
- **UI Framework**: Mantine v7.5.3 for components, Tailwind CSS for styling
- **Web3 Integration**: Wagmi v2.14.9, Viem v2.24.3, RainbowKit v2.0.0
- **Backend**: Prisma v6.5.0 with PostgreSQL, Next.js API routes
- **External APIs**: Hypercerts SDK v2.8.0, Allo Protocol integration, IPFS via Pinata

### Directory Structure
```
app/
├── (home)/          # Landing page components
├── (legacy)/        # Legacy route structure
├── api/             # API routes for backend functionality
└── types/           # TypeScript type definitions

components/
├── ui/              # Reusable UI components
└── [feature]/       # Feature-specific components

interfaces/          # TypeScript interfaces
hooks/               # Custom React hooks
lib/                 # Utility libraries
prisma/              # Database schema and migrations
```

### Key Components
- **Project Management**: Create, list, and manage projects with Hypercerts
- **Funding Flow**: Donation and staking mechanisms for project support
- **Allo Protocol Integration**: Profile and pool management for funding allocation
- **IPFS Integration**: Decentralized storage for project metadata and media

## Development Commands

### Essential Commands
```bash
# Install dependencies and generate Prisma client
npm install && npx prisma generate

# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations in development
npx prisma studio        # Open database GUI
```

### Testing
- No specific test framework configured - verify testing approach before adding tests
- Manual testing recommended for Web3 interactions and database operations

## Database Schema

### Core Models
- **ProjectListings**: Tracks which Hypercerts are publicly listed
- **AlloProfiles**: Links Hypercerts to Allo Protocol profiles and pools
- **UserAlloProfiles**: Maps wallet addresses to Allo profile IDs
- **ProjectCreationProgress**: Tracks multi-step project creation workflow

### Environment Variables Required
```bash
PRISMA_DATABASE_URL=postgresql://...
NEXT_PUBLIC_WALLETCONNECT_ID=your_wallet_connect_project_id
```

## Code Standards

### TypeScript Guidelines
- Use interfaces over types for object definitions
- Prefer explicit typing over type inference for public APIs
- Follow strict TypeScript checking (no type assertions unless necessary)
- Use double quotes for strings consistently

### React/Next.js Patterns
- Use Server Components by default, minimize 'use client' usage
- Follow Next.js 15 App Router patterns
- Implement proper error boundaries and loading states
- Use functional components with TypeScript interfaces for props

### Web3 Integration
- Use Wagmi v2 hooks (avoid v1 patterns)
- Use Viem v2 API for blockchain interactions
- Handle wallet connection states and errors gracefully
- Use the custom `useHypercertClient` hook for Hypercerts SDK operations

### Styling
- Use Mantine v7 components for complex UI elements
- Use Tailwind CSS for layout and custom styling
- Follow the dark theme configuration in providers.tsx
- Use custom color scheme defined in tailwind.config.ts

### Color System
- **CRITICAL**: All colors MUST be defined in `/lib/design-tokens.ts` as the single source of truth
- Never hard-code colors anywhere in the codebase - always use design tokens
- The design token system automatically configures both Mantine and Tailwind CSS
- To change any color throughout the entire application, update only the design tokens file
- Use semantic color names (e.g., `designTokens.semantic.text.primary`) instead of raw values
- Follow the color usage guide in `COLOR_USAGE_GUIDE.md`

### API Development
- Use Next.js API routes in app/api/ directory
- Implement proper error handling and validation
- Use Prisma client for database operations
- Handle CORS and security considerations for Web3 interactions

## Key Integration Points

### Hypercerts SDK
- Initialized in production environment
- Use `useHypercertClient` hook for all Hypercerts operations
- Handle metadata formatting for IPFS storage

### Allo Protocol
- Profile creation and management through API routes
- Pool creation and allocation workflows
- Integration with project funding mechanisms

### IPFS/Pinata
- File and JSON metadata storage
- Use existing API routes for upload operations
- Handle URL formatting for metadata retrieval

## Common Workflows

### Project Creation Flow
1. User creates Allo profile (if needed)
2. Project metadata uploaded to IPFS
3. Hypercert minted with project details
4. Project listed in database
5. Allo pool created for funding

### Funding Flow
1. User discovers projects through listings
2. Projects can receive direct donations
3. Staking mechanism planned for future implementation
4. Retro-funding support through Allo Protocol

## Important Notes

- Environment runs in production mode for Hypercerts SDK
- Database operations require proper error handling
- Web3 interactions need wallet connection checks
- IPFS operations may have latency - implement loading states
- Follow the comprehensive code style rules in .cursorrules file