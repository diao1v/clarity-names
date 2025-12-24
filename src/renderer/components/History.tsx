import { useState, useEffect } from 'react';
import { History as HistoryIcon, Undo2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';

interface HistoryItem {
  id: number;
  originalPath: string;
  newPath: string;
  timestamp: Date;
  aiModel: string | null;
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const data = await trpc.getHistory.query({ limit: 50, offset: 0 });
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (id: number) => {
    try {
      // @ts-ignore
      const result = await trpc.undoRename.mutate(id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'File rename has been undone',
        });
        loadHistory(); // Reload history
      } else {
        toast({
          title: 'Error',
          description: 'Failed to undo rename. File may have been moved or deleted.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to undo rename:', error);
      toast({
        title: 'Error',
        description: 'Failed to undo rename',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          Rename History
        </CardTitle>
        <CardDescription>
          View and undo recent file rename operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No rename history yet
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="text-muted-foreground truncate">
                      {getFileName(item.originalPath)}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium truncate">
                      {getFileName(item.newPath)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(item.timestamp)}
                    {item.aiModel && ` • ${item.aiModel}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUndo(item.id)}
                  className="ml-4 gap-2"
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
