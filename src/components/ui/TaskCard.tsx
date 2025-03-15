
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Task, SubTask } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";
import PriorityIndicator from "./PriorityIndicator";
import { format } from "date-fns";
import { Calendar, Check, Edit, Trash2, ChevronDown, ChevronUp, Clock, Repeat, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  className,
  style,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const isCompleted = task.status === "completed";
  
  const handleStatusToggle = () => {
    onToggleStatus(task.id);
  };
  
  const handleEdit = () => {
    onEdit(task.id);
  };
  
  const handleDelete = () => {
    onDelete(task.id);
  };

  const toggleSubtasks = () => {
    setShowSubtasks(!showSubtasks);
  };

  // Format date in a human-readable way
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
                     
    const isTomorrow = date.getDate() === tomorrow.getDate() && 
                       date.getMonth() === tomorrow.getMonth() && 
                       date.getFullYear() === tomorrow.getFullYear();
    
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    
    return format(date, "MMM d, yyyy");
  };

  // Format recurrence in a readable way
  const formatRecurrence = (recurrence: string) => {
    switch (recurrence) {
      case "daily": return "Every day";
      case "weekly": return "Every week";
      case "monthly": return "Every month";
      case "custom": return "Custom";
      default: return "";
    }
  };

  // Handle subtask toggle
  const handleSubtaskToggle = (subtaskId: string) => {
    // In a real implementation, this would update the subtask status
    console.log(`Toggle subtask: ${subtaskId}`);
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const hasTags = task.tags && task.tags.length > 0;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all duration-300 animate-scale-in",
        "hover:shadow-md hover:bg-card hover:border-primary/20",
        "dark:hover:bg-card/50 dark:hover:border-primary/20",
        isCompleted ? "opacity-70 bg-muted/50" : "bg-background",
        className
      )}
      style={style}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleStatusToggle}
            className={cn(
              "transition-all duration-300 h-5 w-5",
              isCompleted 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-input"
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 
              className={cn(
                "font-medium text-foreground line-clamp-2 transition-all duration-300",
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            <div className="flex-shrink-0">
              <PriorityIndicator priority={task.priority} />
            </div>
          </div>
          
          {task.description && (
            <p 
              className={cn(
                "text-sm text-muted-foreground mb-3 line-clamp-2 transition-all duration-300",
                isCompleted && "line-through"
              )}
            >
              {task.description}
            </p>
          )}
          
          {/* Tags */}
          {hasTags && (
            <div className="flex flex-wrap gap-1 mt-2 mb-2">
              {task.tags?.map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs py-0 px-2 gap-1 border-l-4" 
                  style={{ borderLeftColor: tag.color }}
                >
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center flex-wrap gap-2 mt-3">
            <CategoryBadge category={task.category} />
            
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            
            {task.recurrence && task.recurrence !== 'none' && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Repeat className="h-3.5 w-3.5" />
                <span>{formatRecurrence(task.recurrence)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtasks */}
      {hasSubtasks && (
        <div className="mt-3 pl-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSubtasks}
            className="h-6 p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            {showSubtasks ? (
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 mr-1" />
            )}
            {task.subtasks?.length} subtask{task.subtasks?.length !== 1 ? 's' : ''}
          </Button>
          
          {showSubtasks && (
            <div className="mt-2 space-y-2">
              {task.subtasks?.map((subtask: SubTask) => (
                <div key={subtask.id} className="flex items-start gap-2">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      subtask.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 px-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
