import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { aiService } from '../services/ai';
import { fileService } from '../services/file';
import { store } from '../store';
import { db } from '../db';
import { renameHistory, promptTemplates } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

const t = initTRPC.create({ isServer: true });

export const appRouter = t.router({
  // Settings
  getSettings: t.procedure.query(() => {
    return {
      openaiApiKey: store.get('openaiApiKey') ? '***' : undefined,
      ollamaUrl: store.get('ollamaUrl'),
      selectedModel: store.get('selectedModel'),
      openaiModel: store.get('openaiModel'),
      ollamaModel: store.get('ollamaModel'),
      theme: store.get('theme'),
    };
  }),

  updateSettings: t.procedure
    .input(
      z.object({
        openaiApiKey: z.string().optional(),
        ollamaUrl: z.string().optional(),
        selectedModel: z.enum(['openai', 'ollama']).optional(),
        openaiModel: z.string().optional(),
        ollamaModel: z.string().optional(),
        theme: z.enum(['light', 'dark', 'system']).optional(),
      })
    )
    .mutation(({ input }) => {
      if (input.openaiApiKey !== undefined) store.set('openaiApiKey', input.openaiApiKey);
      if (input.ollamaUrl !== undefined) store.set('ollamaUrl', input.ollamaUrl);
      if (input.selectedModel !== undefined) store.set('selectedModel', input.selectedModel);
      if (input.openaiModel !== undefined) store.set('openaiModel', input.openaiModel);
      if (input.ollamaModel !== undefined) store.set('ollamaModel', input.ollamaModel);
      if (input.theme !== undefined) store.set('theme', input.theme);
      return { success: true };
    }),

  // AI Analysis
  analyzeFile: t.procedure
    .input(
      z.object({
        filePath: z.string(),
        promptTemplate: z.string().optional(),
        customPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const suggestion = await aiService.analyzeFile(input);
      return { suggestion };
    }),

  batchAnalyze: t.procedure
    .input(
      z.object({
        files: z.array(z.string()),
        promptTemplate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const results = await aiService.batchAnalyze(input.files, input.promptTemplate);
      return Object.fromEntries(results);
    }),

  // File Operations
  renameFile: t.procedure
    .input(
      z.object({
        originalPath: z.string(),
        newName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return fileService.renameFile(input.originalPath, input.newName);
    }),

  batchRename: t.procedure
    .input(
      z.array(
        z.object({
          path: z.string(),
          newName: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      return fileService.batchRename(input);
    }),

  validateFileName: t.procedure
    .input(z.string())
    .query(({ input }) => {
      return fileService.validateFileName(input);
    }),

  // History
  getHistory: t.procedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const history = await db.query.renameHistory.findMany({
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(renameHistory.timestamp)],
      });
      return history;
    }),

  undoRename: t.procedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const success = await fileService.undoRename(input);
      return { success };
    }),

  // Prompt Templates
  getTemplates: t.procedure.query(async () => {
    return db.query.promptTemplates.findMany({
      orderBy: [desc(promptTemplates.createdAt)],
    });
  }),

  createTemplate: t.procedure
    .input(
      z.object({
        name: z.string(),
        template: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [template] = await db
        .insert(promptTemplates)
        .values({
          ...input,
          createdAt: new Date(),
        })
        .returning();
      return template;
    }),

  deleteTemplate: t.procedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.delete(promptTemplates).where(eq(promptTemplates.id, input));
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
