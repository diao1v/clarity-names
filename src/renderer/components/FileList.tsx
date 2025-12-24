import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FileText, Sparkles, Check, X, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface FileItem {
  path: string;
  name: string;
  suggestedName: string;
  status: 'pending' | 'analyzing' | 'ready' | 'renaming' | 'done' | 'error';
  error?: string;
}

interface FileListProps {
  files: File[];
  onRenameComplete?: () => void;
}

export function FileList({ files, onRenameComplete }: FileListProps) {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      const items: FileItem[] = files.map((file) => ({
        // @ts-ignore - File has path property in Electron
        path: file.path || file.name,
        name: file.name,
        suggestedName: '',
        status: 'pending',
      }));
      setFileItems(items);
    }
  }, [files]);

  const loadTemplates = async () => {
    try {
      const data = await trpc.getTemplates.query();
      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplate(data[0].template);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const analyzeFiles = async () => {
    setIsAnalyzing(true);
    
    for (let i = 0; i < fileItems.length; i++) {
      const item = fileItems[i];
      
      setFileItems((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'analyzing' } : f))
      );

      try {
        const result = await trpc.analyzeFile.mutate({
          filePath: item.path,
          promptTemplate: selectedTemplate,
        });

        setFileItems((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, suggestedName: result.suggestion, status: 'ready' }
              : f
          )
        );
      } catch (error) {
        setFileItems((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Analysis failed',
                }
              : f
          )
        );
      }
    }

    setIsAnalyzing(false);
  };

  const renameFile = async (index: number) => {
    const item = fileItems[index];
    
    setFileItems((prev) =>
      prev.map((f, idx) => (idx === index ? { ...f, status: 'renaming' } : f))
    );

    try {
      const result = await trpc.renameFile.mutate({
        originalPath: item.path,
        newName: item.suggestedName,
      });

      if (result.status === 'success') {
        setFileItems((prev) =>
          prev.map((f, idx) => (idx === index ? { ...f, status: 'done' } : f))
        );
      } else {
        setFileItems((prev) =>
          prev.map((f, idx) =>
            idx === index ? { ...f, status: 'error', error: result.error } : f
          )
        );
      }
    } catch (error) {
      setFileItems((prev) =>
        prev.map((f, idx) =>
          idx === index
            ? {
                ...f,
                status: 'error',
                error: error instanceof Error ? error.message : 'Rename failed',
              }
            : f
        )
      );
    }
  };

  const renameAll = async () => {
    for (let i = 0; i < fileItems.length; i++) {
      if (fileItems[i].status === 'ready') {
        await renameFile(i);
      }
    }

    if (onRenameComplete) {
      onRenameComplete();
    }
  };

  const updateSuggestion = (index: number, newName: string) => {
    setFileItems((prev) =>
      prev.map((f, idx) => (idx === index ? { ...f, suggestedName: newName } : f))
    );
  };

  if (fileItems.length === 0) {
    return null;
  }

  const hasReadyFiles = fileItems.some((f) => f.status === 'ready');

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label>Prompt Template</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.template}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={analyzeFiles}
          disabled={isAnalyzing || fileItems.every((f) => f.status !== 'pending')}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Analyze Files
        </Button>
        {hasReadyFiles && (
          <Button onClick={renameAll} variant="default" className="gap-2">
            Rename All
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {fileItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border rounded-lg bg-card"
          >
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="text-sm text-muted-foreground truncate">
                {item.name}
              </div>
              {item.status === 'analyzing' && (
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              )}
              {(item.status === 'ready' || item.status === 'done') && (
                <Input
                  value={item.suggestedName}
                  onChange={(e) => updateSuggestion(index, e.target.value)}
                  disabled={item.status === 'done'}
                  className="font-medium"
                />
              )}
              {item.status === 'error' && (
                <div className="text-sm text-destructive">{item.error}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {item.status === 'done' && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {item.status === 'error' && (
                <X className="h-5 w-5 text-destructive" />
              )}
              {item.status === 'ready' && (
                <Button
                  size="sm"
                  onClick={() => renameFile(index)}
                  disabled={!item.suggestedName}
                >
                  Rename
                </Button>
              )}
              {item.status === 'renaming' && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
