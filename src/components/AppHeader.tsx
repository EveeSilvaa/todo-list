
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks } from "lucide-react";

interface AppHeaderProps {
  onAddTask: () => void;
  tasksCount: {
    total: number;
    completed: number;
  };
}

const AppHeader: React.FC<AppHeaderProps> = ({ onAddTask, tasksCount }) => {
  const progressPercentage = tasksCount.total > 0
    ? Math.round((tasksCount.completed / tasksCount.total) * 100)
    : 0;

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto py-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
              <ListChecks className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">TaskMaster</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {tasksCount.total > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span>{progressPercentage}% complete</span>
              </div>
            )}
            
            <Button 
              onClick={onAddTask} 
              size="sm"
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
