# Nuxt UI Pro Documentation Template

A comprehensive documentation site built with [Nuxt Content](https://content.nuxt.com/) and [Nuxt UI Pro](https://ui.nuxt.com/pro).

## Prerequisites

- Node.js 18.x or later
- pnpm 9.x or later (this project uses pnpm as the package manager)
- A valid Nuxt UI Pro license key

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd nuxt-docs-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment:
Create a `.env` file in the project root with your Nuxt UI Pro license key:
```bash
NUXT_UI_PRO_LICENSE=your-license-key-here
```

4. Start the development server:
```bash
pnpm run dev
```

The site will be available at `http://localhost:3000`.

## Project Structure

```
nuxt-docs-app/
├── app/                  # Application components and configuration
├── content/             # Documentation content (Markdown files)
├── public/              # Static files
├── .env                 # Environment variables (create this)
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run typecheck` - Run TypeScript type checking

## Documentation Structure

The documentation is organized in the `content/` directory:

- `content/index.yml` - Main navigation and site structure
- `content/getting-started/` - Getting started guides
- `content/api/` - API documentation
- `content/guide/` - User guides and tutorials

## Contributing

1. Create a new branch for your changes
2. Make your changes and commit them
3. Push your branch and create a pull request
4. Wait for review and approval

## License

This project uses Nuxt UI Pro, which requires a valid license. Make sure you have a valid license key before running the project.
