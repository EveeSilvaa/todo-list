
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskPriority, TaskCategory } from "@/lib/types";
import { createTask, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from "@/lib/tasks";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isOpen,
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [category, setCategory] = useState<TaskCategory>(task?.category || "other");
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null);
  const [titleError, setTitleError] = useState("");
  
  // Reset form on open or task change
  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || "");
      setDescription(task?.description || "");
      setPriority(task?.priority || "medium");
      setCategory(task?.category || "other");
      setDueDate(task?.dueDate || null);
      setTitleError("");
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    
    // Create or update the task
    const updatedTask = task
      ? { ...task, title, description, priority, category, dueDate, updatedAt: new Date() }
      : createTask(title, description, priority, category, dueDate);
    
    onSubmit(updatedTask);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-background border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
              className={titleError ? "border-destructive" : ""}
              placeholder="Task title"
              autoFocus
            />
            {titleError && (
              <div className="flex items-center text-destructive text-sm mt-1">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                {titleError}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium">
                Priority
              </label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <Select value={category} onValueChange={(value) => setCategory(value as TaskCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="block text-sm font-medium">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
