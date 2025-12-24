# Development Guide

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

This will start:
1. Vite dev server on http://localhost:5173
2. Electron app with hot reload

### Building

```bash
# Build for development
npm run build

# Package for distribution
npm run package
```

## Project Structure

```
clarity-names/
├── src/
│   ├── main/              # Electron main process
│   │   ├── db/            # Database schema and initialization
│   │   ├── services/      # Business logic (AI, file operations)
│   │   ├── trpc/          # tRPC router
│   │   ├── index.ts       # Main process entry
│   │   ├── preload.ts     # Preload script
│   │   └── store.ts       # Electron store configuration
│   └── renderer/          # React frontend
│       ├── components/    # React components
│       │   ├── ui/        # shadcn/ui components
│       │   ├── FileDropzone.tsx
│       │   ├── FileList.tsx
│       │   ├── Settings.tsx
│       │   ├── History.tsx
│       │   └── TemplateManager.tsx
│       ├── lib/           # Utilities
│       ├── App.tsx        # Main app component
│       └── main.tsx       # Renderer entry point
├── dist/                  # Build output
├── index.html             # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Architecture

### Main Process (Electron)
- Handles file system operations
- Manages database (SQLite via Drizzle)
- Provides tRPC API to renderer
- Handles AI service calls (OpenAI/Ollama)

### Renderer Process (React)
- User interface
- Communicates with main process via tRPC
- No direct file system access

### Communication
- tRPC over IPC (electron-trpc)
- Type-safe API calls from renderer to main

## Features Implementation

### File Upload
- Uses `react-dropzone` for drag & drop
- Accepts: PDF, images, txt, docx
- File validation in dropzone component

### AI Analysis
- OpenAI integration via official SDK
- Ollama support via REST API
- Configurable models and endpoints

### Filename Suggestions
- Template-based generation
- AI content analysis
- Manual editing before apply

### Database
- SQLite for local storage
- Drizzle ORM for type-safe queries
- Tables:
  - `rename_history`: Track all renames
  - `prompt_templates`: User-defined templates

### Security
- API keys encrypted via electron-store
- No credentials in source code
- Sandboxed file operations

## API (tRPC Router)

### Settings
- `getSettings`: Retrieve current settings
- `updateSettings`: Update configuration

### AI
- `analyzeFile`: Analyze single file
- `batchAnalyze`: Analyze multiple files

### File Operations
- `renameFile`: Rename a single file
- `batchRename`: Batch rename files
- `validateFileName`: Validate filename

### History
- `getHistory`: Get rename history
- `undoRename`: Revert a rename

### Templates
- `getTemplates`: List all templates
- `createTemplate`: Create new template
- `deleteTemplate`: Remove template

## Testing

Currently, there are no automated tests. To test manually:

1. Start the app in dev mode
2. Configure OpenAI API key or Ollama in Settings
3. Drop some test files
4. Select a template and analyze
5. Review suggestions and rename
6. Check history for undo functionality

## Troubleshooting

### Build Issues
- Ensure you run `npm run build:electron` before `build:vite`
- The renderer needs types from the built main process

### Runtime Issues
- Check Electron console (Ctrl+Shift+I in dev mode)
- Verify API keys are set in Settings
- For Ollama, ensure service is running on configured URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test
5. Submit a pull request

## License

MIT
