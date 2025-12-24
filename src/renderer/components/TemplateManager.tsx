import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: number;
  name: string;
  template: string;
  description: string | null;
}

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    template: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // @ts-ignore
      const data = await trpc.getTemplates.query();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.template) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in the template name and pattern',
        variant: 'destructive',
      });
      return;
    }

    try {
      // @ts-ignore
      await trpc.createTemplate.mutate(newTemplate);
      setNewTemplate({ name: '', template: '', description: '' });
      setIsAdding(false);
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to create template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    try {
      // @ts-ignore
      await trpc.deleteTemplate.mutate(id);
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prompt Templates
            </CardTitle>
            <CardDescription>
              Manage custom filename templates for AI generation
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg space-y-4 bg-accent/20">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Date-Who-Topic"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-pattern">Template Pattern</Label>
              <Input
                id="template-pattern"
                placeholder="e.g., YYYY-MM-DD_{who}_{topic}"
                value={newTemplate.template}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, template: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Use placeholders like {'{who}'}, {'{topic}'}, {'{description}'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-desc">Description (Optional)</Label>
              <Input
                id="template-desc"
                placeholder="e.g., Format: 2024-01-15_john_meeting-notes"
                value={newTemplate.description}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTemplate} size="sm">
                Save Template
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewTemplate({ name: '', template: '', description: '' });
                }}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">
                  {template.template}
                </div>
                {template.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTemplate(template.id)}
                className="ml-4"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
