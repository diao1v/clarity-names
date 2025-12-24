import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { FileDropzone } from './components/FileDropzone';
import { FileList } from './components/FileList';
import { Settings } from './components/Settings';
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
    // Could show a success message or refresh the file list
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

        <div className="space-y-6">
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
        </div>

        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  );
}

export default App;
