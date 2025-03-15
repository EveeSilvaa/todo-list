
import { 
  Task, 
  TaskFilter, 
  TaskPriority, 
  TaskCategory, 
  TaskStatus, 
  TaskStatistics,
  TaskRecurrence,
  SubTask,
  TaskTag,
  Attachment
} from "./types";

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Create a new task
export const createTask = (
  title: string,
  description: string = "",
  priority: TaskPriority = "medium",
  category: TaskCategory = "other",
  dueDate: Date | null = null,
  recurrence: TaskRecurrence = "none",
  recurrenceEndDate: Date | null = null,
  tags: TaskTag[] = [],
  subtasks: SubTask[] = [],
  attachments: Attachment[] = []
): Task => {
  const now = new Date();
  return {
    id: generateId(),
    title,
    description,
    status: "pending",
    priority,
    category,
    dueDate,
    createdAt: now,
    updatedAt: now,
    recurrence,
    recurrenceEndDate,
    tags,
    subtasks,
    attachments,
    order: now.getTime(),  // Default order based on creation time
  };
};

// Update a task
export const updateTask = (task: Task, updates: Partial<Task>): Task => {
  return {
    ...task,
    ...updates,
    updatedAt: new Date(),
  };
};

// Toggle task status (completed/pending)
export const toggleTaskStatus = (task: Task): Task => {
  const newStatus: TaskStatus = task.status === "completed" ? "pending" : "completed";
  const updatedTask = updateTask(task, { 
    status: newStatus,
    completedAt: newStatus === "completed" ? new Date() : undefined
  });
  
  // Handle recurring tasks
  if (newStatus === "completed" && task.recurrence && task.recurrence !== "none") {
    // Create the next occurrence
    createNextRecurringTask(updatedTask);
  }
  
  return updatedTask;
};

// Delete a task from task list
export const deleteTask = (tasks: Task[], taskId: string): Task[] => {
  return tasks.filter((task) => task.id !== taskId);
};

// Create next recurring task
export const createNextRecurringTask = (completedTask: Task): Task | null => {
  if (!completedTask.recurrence || completedTask.recurrence === "none") {
    return null;
  }
  
  if (completedTask.recurrenceEndDate && new Date() > completedTask.recurrenceEndDate) {
    return null; // Recurrence end date has passed
  }
  
  // Calculate next due date
  let nextDueDate: Date | null = null;
  
  if (completedTask.dueDate) {
    nextDueDate = new Date(completedTask.dueDate);
    
    switch (completedTask.recurrence) {
      case "daily":
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case "weekly":
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case "monthly":
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case "custom":
        // For custom recurrence, we'd need additional logic
        // For now, default to weekly
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
    }
  } else {
    // If no due date was set, create one based on current date
    nextDueDate = new Date();
    
    switch (completedTask.recurrence) {
      case "daily":
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case "weekly":
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case "monthly":
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case "custom":
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
    }
  }
  
  // Create next task
  const nextTask: Task = {
    ...completedTask,
    id: generateId(),
    status: "pending",
    dueDate: nextDueDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: undefined,
    // Reset subtasks to uncompleted state
    subtasks: completedTask.subtasks?.map(subtask => ({
      ...subtask,
      id: generateId(),
      completed: false,
      createdAt: new Date()
    }))
  };
  
  // Load current tasks, add new recurring task, and save
  const currentTasks = loadTasks();
  const updatedTasks = [...currentTasks, nextTask];
  saveTasks(updatedTasks);
  
  return nextTask;
};

// Toggle subtask completion status
export const toggleSubtaskStatus = (task: Task, subtaskId: string): Task => {
  if (!task.subtasks) return task;
  
  const updatedSubtasks = task.subtasks.map(subtask => 
    subtask.id === subtaskId 
      ? { ...subtask, completed: !subtask.completed } 
      : subtask
  );
  
  return updateTask(task, { subtasks: updatedSubtasks });
};

// Add a subtask to a task
export const addSubtask = (task: Task, title: string): Task => {
  const newSubtask: SubTask = {
    id: generateId(),
    title,
    completed: false,
    createdAt: new Date()
  };
  
  const subtasks = task.subtasks ? [...task.subtasks, newSubtask] : [newSubtask];
  return updateTask(task, { subtasks });
};

// Remove a subtask from a task
export const removeSubtask = (task: Task, subtaskId: string): Task => {
  if (!task.subtasks) return task;
  
  const subtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
  return updateTask(task, { subtasks });
};

// Add a tag to a task
export const addTag = (task: Task, tagName: string, tagColor: string): Task => {
  const newTag: TaskTag = {
    id: generateId(),
    name: tagName,
    color: tagColor
  };
  
  const tags = task.tags ? [...task.tags, newTag] : [newTag];
  return updateTask(task, { tags });
};

// Remove a tag from a task
export const removeTag = (task: Task, tagId: string): Task => {
  if (!task.tags) return task;
  
  const tags = task.tags.filter(tag => tag.id !== tagId);
  return updateTask(task, { tags });
};

// Add an attachment to a task
export const addAttachment = (
  task: Task, 
  name: string, 
  type: string, 
  url: string, 
  size: number
): Task => {
  const newAttachment: Attachment = {
    id: generateId(),
    name,
    type,
    url,
    size,
    createdAt: new Date()
  };
  
  const attachments = task.attachments ? [...task.attachments, newAttachment] : [newAttachment];
  return updateTask(task, { attachments });
};

// Remove an attachment from a task
export const removeAttachment = (task: Task, attachmentId: string): Task => {
  if (!task.attachments) return task;
  
  const attachments = task.attachments.filter(attachment => attachment.id !== attachmentId);
  return updateTask(task, { attachments });
};

// Filter tasks
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter((task) => {
    // Filter by status
    if (filter.status && task.status !== filter.status) {
      return false;
    }

    // Filter by priority
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }

    // Filter by category
    if (filter.category && task.category !== filter.category) {
      return false;
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      if (!task.tags || task.tags.length === 0) {
        return false;
      }
      
      const taskTagIds = task.tags.map(tag => tag.id);
      if (!filter.tags.some(tagId => taskTagIds.includes(tagId))) {
        return false;
      }
    }

    // Filter by search
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchTerm);
      const descMatch = task.description?.toLowerCase().includes(searchTerm) || false;
      
      // Also search in subtasks
      const subtaskMatch = task.subtasks?.some(subtask => 
        subtask.title.toLowerCase().includes(searchTerm)
      ) || false;
      
      // And tags
      const tagMatch = task.tags?.some(tag => 
        tag.name.toLowerCase().includes(searchTerm)
      ) || false;
      
      if (!titleMatch && !descMatch && !subtaskMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });
};

// Sort tasks
export const sortTasks = (
  tasks: Task[],
  sortBy: "dueDate" | "priority" | "createdAt" | "title" | "order" = "createdAt",
  sortDirection: "asc" | "desc" = "desc"
): Task[] => {
  const priorityValue = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    // Get values based on sort field
    switch (sortBy) {
      case "dueDate":
        valueA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        valueB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        break;
      case "priority":
        valueA = priorityValue[a.priority];
        valueB = priorityValue[b.priority];
        break;
      case "createdAt":
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      case "title":
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case "order":
        valueA = a.order || Number.MAX_SAFE_INTEGER;
        valueB = b.order || Number.MAX_SAFE_INTEGER;
        break;
      default:
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
    }

    // Sort direction
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

// Reorder tasks
export const reorderTasks = (tasks: Task[], startIndex: number, endIndex: number): Task[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  // Update order property for all tasks
  return result.map((task, index) => ({
    ...task,
    order: index
  }));
};

// Calculate task statistics
export const calculateTaskStatistics = (tasks: Task[]): TaskStatistics => {
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  
  // Calculate overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter(task => 
    task.status === "pending" && 
    task.dueDate && 
    new Date(task.dueDate) < now
  ).length;
  
  // Calculate completion rate
  const completionRate = tasks.length > 0 ? completedTasks / tasks.length : 0;
  
  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<TaskCategory, number>);
  
  // Group tasks by priority
  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<TaskPriority, number>);
  
  // Count tasks completed by day (last 30 days)
  const tasksCompletedByDay: Record<string, number> = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  tasks
    .filter(task => 
      task.status === "completed" && 
      task.completedAt && 
      new Date(task.completedAt) >= thirtyDaysAgo
    )
    .forEach(task => {
      if (task.completedAt) {
        const dateStr = task.completedAt.toISOString().split('T')[0];
        tasksCompletedByDay[dateStr] = (tasksCompletedByDay[dateStr] || 0) + 1;
      }
    });
  
  return {
    totalTasks: tasks.length,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionRate,
    tasksByCategory,
    tasksByPriority,
    tasksCompletedByDay
  };
};

// Export tasks to JSON format
export const exportTasks = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2);
};

// Import tasks from JSON format
export const importTasks = (json: string): Task[] => {
  try {
    const tasks = JSON.parse(json);
    
    // Validate and convert date strings to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      recurrenceEndDate: task.recurrenceEndDate ? new Date(task.recurrenceEndDate) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      // Also convert dates in subtasks and attachments
      subtasks: task.subtasks?.map((subtask: any) => ({
        ...subtask,
        createdAt: new Date(subtask.createdAt)
      })),
      attachments: task.attachments?.map((attachment: any) => ({
        ...attachment,
        createdAt: new Date(attachment.createdAt)
      }))
    }));
  } catch (error) {
    console.error('Failed to parse imported tasks:', error);
    return [];
  }
};

// Local storage keys
const TASKS_STORAGE_KEY = "todo_app_tasks";

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  const tasksJSON = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!tasksJSON) return [];

  try {
    const tasks = JSON.parse(tasksJSON);
    // Convert string dates to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      recurrenceEndDate: task.recurrenceEndDate ? new Date(task.recurrenceEndDate) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      // Also convert dates in subtasks and attachments
      subtasks: task.subtasks?.map((subtask: any) => ({
        ...subtask,
        createdAt: new Date(subtask.createdAt)
      })),
      attachments: task.attachments?.map((attachment: any) => ({
        ...attachment,
        createdAt: new Date(attachment.createdAt)
      }))
    }));
  } catch (error) {
    console.error("Failed to parse tasks from localStorage:", error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

// Category options with labels
export const CATEGORY_OPTIONS = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
];

// Priority options with labels
export const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

// Status options with labels
export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

// Recurrence options with labels
export const RECURRENCE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

// Sort options with labels
export const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
  { value: "order", label: "Custom Order" },
];

// Sample tag colors
export const TAG_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#84cc16", // Lime
  "#10b981", // Emerald
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

// Sample tags
export const SAMPLE_TAGS = [
  { id: "tag1", name: "Home", color: "#ef4444" },
  { id: "tag2", name: "Office", color: "#3b82f6" },
  { id: "tag3", name: "Urgent", color: "#f97316" },
  { id: "tag4", name: "Ideas", color: "#8b5cf6" },
  { id: "tag5", name: "Shopping", color: "#10b981" },
];

// Sample tasks for testing
export const generateSampleTasks = (): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: "sample1",
      title: "Complete project proposal",
      description: "Finish the proposal for the new client project",
      status: "pending",
      priority: "high",
      category: "work",
      dueDate: tomorrow,
      createdAt: now,
      updatedAt: now,
      order: 0,
      tags: [SAMPLE_TAGS[0], SAMPLE_TAGS[2]],
      subtasks: [
        {
          id: "sub1",
          title: "Research competition",
          completed: true,
          createdAt: now
        },
        {
          id: "sub2",
          title: "Create wireframes",
          completed: false,
          createdAt: now
        }
      ]
    },
    {
      id: "sample2",
      title: "Go for a run",
      description: "30 minutes morning run",
      status: "completed",
      priority: "medium",
      category: "health",
      dueDate: null,
      createdAt: new Date(now.setHours(now.getHours() - 2)),
      updatedAt: new Date(now.setHours(now.getHours() - 1)),
      completedAt: new Date(now.setHours(now.getHours() - 1)),
      order: 1,
      recurrence: "daily",
      tags: [SAMPLE_TAGS[3]]
    },
    {
      id: "sample3",
      title: "Pay electricity bill",
      description: "Online payment through banking app",
      status: "pending",
      priority: "high",
      category: "finance",
      dueDate: nextWeek,
      createdAt: new Date(now.setHours(now.getHours() - 5)),
      updatedAt: new Date(now.setHours(now.getHours() - 5)),
      order: 2,
      tags: [SAMPLE_TAGS[2], SAMPLE_TAGS[4]]
    },
  ];
};
