
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Task } from "@/lib/types";
import { exportTasks, importTasks } from "@/lib/tasks";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

interface ImportExportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ tasks, onImport }) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const taskJson = exportTasks(tasks);
    const blob = new Blob([taskJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tasks exported",
      description: `${tasks.length} tasks have been exported.`,
    });
  };

  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonText = event.target?.result as string;
        setImportText(jsonText);
        setImportDialogOpen(true);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError('Failed to read the file. Please try again.');
        toast({
          title: "Import error",
          description: "Failed to read the file. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      setImportError('Failed to read the file. Please try again.');
      toast({
        title: "Import error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    try {
      setImportError(null);
      const importedTasks = importTasks(importText);
      
      if (!Array.isArray(importedTasks) || importedTasks.length === 0) {
        throw new Error('No valid tasks found in the import data');
      }
      
      onImport(importedTasks);
      setIsImportDialogOpen(false);
      setImportText('');
      
      toast({
        title: "Tasks imported",
        description: `${importedTasks.length} tasks have been imported.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format. Please check your import data.';
      setImportError(errorMessage);
    }
  };

  const setImportDialogOpen = (open: boolean) => {
    setIsImportDialogOpen(open);
    if (!open) {
      setImportText('');
      setImportError(null);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportFile}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>
      
      <Dialog open={isImportDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Tasks</DialogTitle>
            <DialogDescription>
              Paste your task JSON data below or edit the loaded file content.
            </DialogDescription>
          </DialogHeader>
          
          {importError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="min-h-[200px] font-mono text-xs"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleImportSubmit}>
              Import Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportExport;
