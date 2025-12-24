import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/toaster';
import { FileDropzone } from './components/FileDropzone';
import { FileList } from './components/FileList';
import { Settings } from './components/Settings';
import { History } from './components/History';
import { TemplateManager } from './components/TemplateManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Apply initial theme
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(systemTheme ? 'dark' : 'light');
  }, []);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleRenameComplete = () => {
    // Reset files after successful rename
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Clarity Names</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered file renaming made simple
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="rename" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rename">Rename Files</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="rename" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Files</CardTitle>
                <CardDescription>
                  Drop your files here or click to browse. Supported formats: PDF, Images, TXT, DOCX
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileDropzone onFilesSelected={handleFilesSelected} />
              </CardContent>
            </Card>

            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>File Renaming</CardTitle>
                  <CardDescription>
                    Review and edit AI-generated filenames before applying
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileList files={files} onRenameComplete={handleRenameComplete} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <History />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>
        </Tabs>

        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <Toaster />
      </div>
    </div>
  );
}

export default App;
