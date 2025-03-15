
// Task priority options
export type TaskPriority = "high" | "medium" | "low";

// Task category options
export type TaskCategory = "work" | "personal" | "health" | "finance" | "other";

// Task status options
export type TaskStatus = "pending" | "completed";

// Task recurrence options
export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly" | "custom";

// Task tag type
export type TaskTag = {
  id: string;
  name: string;
  color: string;
};

// Subtask type
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Attachment type
export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  createdAt: Date;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // New fields
  recurrence?: TaskRecurrence;
  recurrenceEndDate?: Date | null;
  tags?: TaskTag[];
  order?: number;
  subtasks?: SubTask[];
  attachments?: Attachment[];
  completedAt?: Date | null;
}

// Task filter options
export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  search?: string;
  sortBy?: "dueDate" | "priority" | "createdAt" | "title" | "order";
  sortDirection?: "asc" | "desc";
  tags?: string[];
}

// Pomodoro timer settings
export interface PomodoroSettings {
  workDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  longBreakInterval: number; // number of pomodoros before a long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

// Task statistics
export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  tasksByCategory: Record<TaskCategory, number>;
  tasksByPriority: Record<TaskPriority, number>;
  tasksCompletedByDay: Record<string, number>;
}
