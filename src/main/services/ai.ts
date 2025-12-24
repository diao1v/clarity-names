import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { store } from '../store';

interface AnalyzeFileParams {
  filePath: string;
  promptTemplate?: string;
  customPrompt?: string;
}

export class AIService {
  private openai: OpenAI | null = null;

  private initOpenAI() {
    const apiKey = store.get('openaiApiKey');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeFileOpenAI(params: AnalyzeFileParams): Promise<string> {
    if (!this.openai) {
      this.initOpenAI();
    }

    const { filePath, promptTemplate, customPrompt } = params;
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    let content = '';
    
    // Read file content based on type
    if (['.txt', '.md'].includes(fileExt)) {
      content = fs.readFileSync(filePath, 'utf-8');
    } else if (fileExt === '.pdf') {
      content = `PDF file: ${fileName}`;
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
      content = `Image file: ${fileName}`;
    } else if (['.docx', '.doc'].includes(fileExt)) {
      content = `Document file: ${fileName}`;
    }

    const template = promptTemplate || '{description}';
    const systemPrompt = customPrompt || `Analyze the file content and suggest a descriptive filename following this template: ${template}. 
    
Rules:
- Use lowercase with hyphens for spaces
- No special characters except hyphens and underscores
- Keep it concise but descriptive
- For dates, use YYYY-MM-DD format
- Replace template variables with actual values from the content
- Return ONLY the suggested filename without extension`;

    const completion = await this.openai!.chat.completions.create({
      model: store.get('openaiModel') || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `File: ${fileName}\n\nContent preview:\n${content.slice(0, 2000)}` },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || fileName;
    return suggestion;
  }

  async analyzeFileOllama(params: AnalyzeFileParams): Promise<string> {
    const { filePath, promptTemplate, customPrompt } = params;
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    let content = '';
    
    if (['.txt', '.md'].includes(fileExt)) {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      content = `File: ${fileName}`;
    }

    const template = promptTemplate || '{description}';
    const prompt = customPrompt || `Analyze this file and suggest a descriptive filename following this template: ${template}. 
    
File: ${fileName}
Content: ${content.slice(0, 2000)}

Rules:
- Use lowercase with hyphens for spaces
- No special characters except hyphens and underscores
- Keep it concise but descriptive
- Return ONLY the suggested filename without extension`;

    const ollamaUrl = store.get('ollamaUrl') || 'http://localhost:11434';
    const model = store.get('ollamaModel') || 'llama2';

    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.statusText}`);
      }

      const data = await response.json() as { response?: string };
      return data.response?.trim() || fileName;
    } catch (error) {
      throw new Error(`Ollama connection failed: ${error}`);
    }
  }

  async analyzeFile(params: AnalyzeFileParams): Promise<string> {
    const selectedModel = store.get('selectedModel');
    
    if (selectedModel === 'openai') {
      return this.analyzeFileOpenAI(params);
    } else {
      return this.analyzeFileOllama(params);
    }
  }

  async batchAnalyze(files: string[], promptTemplate?: string): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    for (const filePath of files) {
      try {
        const suggestion = await this.analyzeFile({ filePath, promptTemplate });
        results.set(filePath, suggestion);
      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error);
        results.set(filePath, path.basename(filePath));
      }
    }
    
    return results;
  }
}

export const aiService = new AIService();
