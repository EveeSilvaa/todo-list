
import React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  onAddTask?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No tasks yet",
  subMessage = "Create your first task to get started",
  onAddTask,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <div className="bg-secondary/50 dark:bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <ClipboardList className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">{message}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {subMessage}
      </p>
      {onAddTask && (
        <Button 
          onClick={onAddTask}
          className="animate-pulse-light dark:animate-pulse-dark"
        >
          Create a Task
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
