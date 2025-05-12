# Website Builder Platform

A Figma-like website builder that outputs production-ready Next.js websites with advanced features including animations, CMS integration, authentication, and direct GitHub integration.

## Core Value Proposition

- Figma-like design flexibility with immediate code output
- Next.js-based websites with SSR/SSG/ISR options
- Direct GitHub integration for developer workflows
- Multiple rendering strategies per component
- Advanced animation capabilities through visual editing
- Authentication and role-based access control (RBAC)
- Built-in CMS and content management
- Component system with shadcn/ui and custom components

## Technology Stack

- **Core Framework**: Next.js, TypeScript, tRPC, TanStack Query, Prisma, Tailwind CSS, NextAuth.js
- **Database & State Management**: NeonDB (PostgreSQL), Upstash Redis, Zustand
- **UI & Design System**: shadcn/ui, Radix UI, dnd-kit, Framer Motion, GSAP
- **Real-time Communication**: Socket.io, Upstash Redis Pub/Sub
- **Authentication & Authorization**: Auth.js, Custom RBAC system
- **Code Generation & Build Tools**: Babel, AST manipulation, Prettier, ESLint
- **External Integrations**: GitHub API, Vercel API
- **DevOps & Infrastructure**: Vercel, Docker, GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- Docker (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/website-builder.git
   cd website-builder
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

This is a monorepo managed with Turborepo:

```
website-builder/
├── apps/
│   ├── web/                  # Main builder platform
│   └── docs/                 # Documentation site
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── editor/               # Visual editor logic
│   ├── code-gen/             # Code generation engine
│   ├── animations/           # Animation engine
│   ├── cms/                  # CMS functionality
│   ├── auth/                 # Authentication modules
│   ├── git/                  # Git integration
│   ├── config/               # Shared configuration
│   └── db/                   # Database client
├── templates/                # Output templates
├── scripts/                  # Build and utility scripts
└── ...
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Business Source License 1.1 - see the [LICENSE](LICENSE) file for details.