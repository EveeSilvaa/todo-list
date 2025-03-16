import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto py-3 px-3 sm:py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 text-primary">
              <ListChecks className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold">TaskMaster</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {tasksCount.total > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-24 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span>{progressPercentage}% complete</span>
              </div>
            )}
            
            {isMobile ? (
              <>
                <Button 
                  onClick={onAddTask} 
                  size="icon"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New Task</span>
                </Button>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Button 
                  onClick={onAddTask} 
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </Button>
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
