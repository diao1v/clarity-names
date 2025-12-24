// Type definitions for the tRPC router
// This provides proper typing for the tRPC client in the renderer process

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// Base router interface that matches the actual router structure
export interface AppRouter {
  _def: {
    _config: {
      transformer: any;
    };
    queries: any;
    mutations: any;
    subscriptions: any;
  };
  
  // Queries
  getSettings: {
    query: () => Promise<{
      openaiApiKey?: string;
      ollamaUrl?: string;
      selectedModel: 'openai' | 'ollama';
      openaiModel: string;
      ollamaModel: string;
      theme: 'light' | 'dark' | 'system';
    }>;
  };
  
  getHistory: {
    query: (input: { limit?: number; offset?: number }) => Promise<Array<{
      id: number;
      originalPath: string;
      newPath: string;
      timestamp: Date;
      aiModel: string | null;
      prompt: string | null;
    }>>;
  };
  
  getTemplates: {
    query: () => Promise<Array<{
      id: number;
      name: string;
      template: string;
      description: string | null;
      createdAt: Date;
    }>>;
  };
  
  validateFileName: {
    query: (input: string) => Promise<{ valid: boolean; error?: string }>;
  };
  
  // Mutations
  updateSettings: {
    mutate: (input: {
      openaiApiKey?: string;
      ollamaUrl?: string;
      selectedModel?: 'openai' | 'ollama';
      openaiModel?: string;
      ollamaModel?: string;
      theme?: 'light' | 'dark' | 'system';
    }) => Promise<{ success: boolean }>;
  };
  
  analyzeFile: {
    mutate: (input: {
      filePath: string;
      promptTemplate?: string;
      customPrompt?: string;
    }) => Promise<{ suggestion: string }>;
  };
  
  batchAnalyze: {
    mutate: (input: {
      files: string[];
      promptTemplate?: string;
    }) => Promise<Record<string, string>>;
  };
  
  renameFile: {
    mutate: (input: {
      originalPath: string;
      newName: string;
    }) => Promise<{
      originalPath: string;
      newPath: string;
      status: 'pending' | 'success' | 'error';
      error?: string;
    }>;
  };
  
  batchRename: {
    mutate: (input: Array<{
      path: string;
      newName: string;
    }>) => Promise<Array<{
      originalPath: string;
      newPath: string;
      status: 'pending' | 'success' | 'error';
      error?: string;
    }>>;
  };
  
  undoRename: {
    mutate: (input: number) => Promise<{ success: boolean }>;
  };
  
  createTemplate: {
    mutate: (input: {
      name: string;
      template: string;
      description?: string;
    }) => Promise<{
      id: number;
      name: string;
      template: string;
      description: string | null;
      createdAt: Date;
    }>;
  };
  
  deleteTemplate: {
    mutate: (input: number) => Promise<{ success: boolean }>;
  };
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
