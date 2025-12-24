# Clarity Names

AI-powered file renaming desktop app built with Electron, React, and TypeScript.

## Features

- **Drag & Drop Interface**: Easily add files (PDF, images, TXT, DOCX) for renaming
- **AI-Powered Analysis**: Automatically analyze file content and suggest descriptive filenames
- **Multiple AI Models**: Choose between OpenAI API or Ollama (local) for file analysis
- **Custom Prompt Templates**: Use predefined templates like "yyyy-mm-dd_who_topic" or create your own
- **Preview Before Rename**: Review and edit AI suggestions before applying changes
- **Undo History**: Track all rename operations and undo if needed
- **Conflict Resolution**: Automatically handle filename conflicts
- **Batch Processing**: Rename multiple files at once
- **Secure API Key Storage**: Encrypted storage for your API keys
- **Dark/Light Mode**: Choose your preferred theme

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Desktop Framework**: Electron
- **API Communication**: tRPC (electron-trpc) + TanStack Query
- **Database**: Drizzle ORM + SQLite
- **AI Integration**: OpenAI API + Ollama support

## Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package the app
npm run package
```

## Configuration

1. Open Settings (gear icon in top right)
2. Choose your AI model provider:
   - **OpenAI**: Enter your API key (stored securely and encrypted)
   - **Ollama**: Configure your local Ollama URL and model
3. Select your preferred theme (Light/Dark/System)

## Usage

1. **Add Files**: Drag and drop files or click to browse
2. **Select Template**: Choose a prompt template for filename generation
3. **Analyze**: Click "Analyze Files" to generate AI suggestions
4. **Review**: Edit any suggested filenames as needed
5. **Rename**: Click "Rename" on individual files or "Rename All" for batch processing

## Prompt Templates

The app comes with default templates:
- `YYYY-MM-DD_{who}_{topic}` - Date-Who-Topic format
- `{topic}_YYYY-MM-DD` - Topic-Date format
- `{description}` - AI-generated descriptive filename

You can create custom templates in the database or modify the defaults in the code.

## Development

```bash
# Start Vite dev server
npm run dev:vite

# Start Electron (in another terminal)
npm run dev:electron

# Or run both with concurrently
npm run dev
```

## Security

- API keys are encrypted using electron-store
- All file operations are sandboxed within Electron
- No file data is sent to external servers (except to your chosen AI provider)

## License

MIT