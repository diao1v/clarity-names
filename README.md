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
- **Toast Notifications**: Real-time feedback for all operations

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

## Quick Start

1. **Configure AI Provider**:
   - Open Settings (gear icon)
   - Choose OpenAI or Ollama
   - For OpenAI: Enter your API key
   - For Ollama: Configure URL (default: http://localhost:11434)

2. **Add Files**:
   - Drag and drop files into the upload area
   - Or click to browse and select files

3. **Generate Suggestions**:
   - Select a prompt template
   - Click "Analyze Files" to generate AI suggestions

4. **Review & Rename**:
   - Edit suggested filenames as needed
   - Click "Rename" for individual files or "Rename All" for batch processing

5. **Manage History**:
   - View all rename operations in the History tab
   - Undo any rename with a single click

## Configuration

### OpenAI Setup
- Get your API key from [OpenAI Platform](https://platform.openai.com)
- Supported models: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- API keys are encrypted and stored locally

### Ollama Setup  
- Install [Ollama](https://ollama.ai)
- Pull a model: `ollama pull llama2`
- Start Ollama service
- Configure URL in Settings (default: http://localhost:11434)

## Prompt Templates

The app comes with default templates:
- **Date-Who-Topic**: `YYYY-MM-DD_{who}_{topic}` → `2024-01-15_john_meeting-notes`
- **Topic-Date**: `{topic}_YYYY-MM-DD` → `invoice_2024-01-15`
- **Descriptive**: `{description}` → AI-generated descriptive filename

Create custom templates in the Templates tab with placeholders like `{who}`, `{topic}`, `{description}`.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development instructions.

```bash
# Start Vite dev server
npm run dev:vite

# Start Electron (in another terminal)
npm run dev:electron

# Or run both with concurrently
npm run dev
```

## Project Structure

```
clarity-names/
├── src/
│   ├── main/              # Electron main process
│   │   ├── db/            # Database (SQLite + Drizzle)
│   │   ├── services/      # AI & file operations
│   │   ├── trpc/          # tRPC router
│   │   └── store.ts       # Secure settings storage
│   └── renderer/          # React frontend
│       ├── components/    # UI components
│       ├── lib/           # Utilities
│       └── hooks/         # React hooks
├── dist/                  # Build output
└── package.json
```

## Security

- ✅ API keys encrypted using electron-store
- ✅ Sandboxed file operations in Electron
- ✅ No file data sent externally (except to chosen AI provider)
- ✅ Context isolation enabled in Electron
- ✅ No eval() or dangerous code execution

## Troubleshooting

### Build Issues
- Ensure Node.js 20.x or higher is installed
- Run `npm install` to install all dependencies
- Main process must be built before renderer: `npm run build:electron` then `npm run build:vite`

### Runtime Issues
- **OpenAI errors**: Verify API key is set in Settings
- **Ollama connection failed**: Ensure Ollama service is running
- **File rename failed**: Check file permissions and that files aren't open in another program

### Development Mode
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac) to open DevTools
- Check console for errors
- Verify tRPC connection in Network tab

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [OpenAI](https://openai.com/)
- [Ollama](https://ollama.ai/)