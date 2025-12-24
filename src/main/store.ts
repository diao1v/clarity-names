import Store from 'electron-store';

interface StoreSchema {
  openaiApiKey?: string;
  ollamaUrl?: string;
  selectedModel: 'openai' | 'ollama';
  openaiModel: string;
  ollamaModel: string;
  theme: 'light' | 'dark' | 'system';
}

export const store = new Store<StoreSchema>({
  defaults: {
    selectedModel: 'openai',
    openaiModel: 'gpt-4-turbo-preview',
    ollamaModel: 'llama2',
    ollamaUrl: 'http://localhost:11434',
    theme: 'system',
  },
  encryptionKey: 'clarity-names-secure-key',
});
