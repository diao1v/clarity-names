import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { trpc } from '@/lib/trpc';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    ollamaUrl: 'http://localhost:11434',
    selectedModel: 'openai' as 'openai' | 'ollama',
    openaiModel: 'gpt-4-turbo-preview',
    ollamaModel: 'llama2',
    theme: 'system' as 'light' | 'dark' | 'system',
  });

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await trpc.getSettings.query();
      setSettings((prev) => ({
        ...prev,
        ...data,
        openaiApiKey: '', // Don't load the actual key
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await trpc.updateSettings.mutate({
        ...settings,
        openaiApiKey: settings.openaiApiKey || undefined,
      });
      applyTheme(settings.theme);
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Settings
          </CardTitle>
          <CardDescription>Configure your AI models and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">AI Models</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>AI Model Provider</Label>
                  <Select
                    value={settings.selectedModel}
                    onValueChange={(value: 'openai' | 'ollama') =>
                      setSettings({ ...settings, selectedModel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.selectedModel === 'openai' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="openai-key">OpenAI API Key</Label>
                      <Input
                        id="openai-key"
                        type="password"
                        placeholder="sk-..."
                        value={settings.openaiApiKey}
                        onChange={(e) =>
                          setSettings({ ...settings, openaiApiKey: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Your API key is stored securely and encrypted
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="openai-model">OpenAI Model</Label>
                      <Select
                        value={settings.openaiModel}
                        onValueChange={(value) =>
                          setSettings({ ...settings, openaiModel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {settings.selectedModel === 'ollama' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ollama-url">Ollama URL</Label>
                      <Input
                        id="ollama-url"
                        placeholder="http://localhost:11434"
                        value={settings.ollamaUrl}
                        onChange={(e) =>
                          setSettings({ ...settings, ollamaUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ollama-model">Ollama Model</Label>
                      <Input
                        id="ollama-model"
                        placeholder="llama2"
                        value={settings.ollamaModel}
                        onChange={(e) =>
                          setSettings({ ...settings, ollamaModel: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') =>
                      setSettings({ ...settings, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
