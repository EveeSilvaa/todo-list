import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import AppHeader from "@/components/AppHeader";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import SearchFilter from "@/components/SearchFilter";
import Statistics from "@/components/Statistics";
import PomodoroTimer from "@/components/PomodoroTimer";
import ImportExport from "@/components/ImportExport";
import { Task, TaskFilter, TaskStatistics } from "@/lib/types";
import { 
  loadTasks, 
  saveTasks, 
  toggleTaskStatus, 
  deleteTask,
  generateSampleTasks,
  reorderTasks,
  calculateTaskStatistics,
} from "@/lib/tasks";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, ListTodo, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tasks");
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedTasks = loadTasks();
    
    if (savedTasks.length === 0) {
      const sampleTasks = generateSampleTasks();
      setTasks(sampleTasks);
      saveTasks(sampleTasks);
    } else {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const stats = calculateTaskStatistics(tasks);
      setStatistics(stats);
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsFormOpen(true);
    }
  };

  const handleTaskSubmit = (task: Task) => {
    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? task : t))
      );
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } else {
      setTasks((prevTasks) => [task, ...prevTasks]);
      toast({
        title: "Task created",
        description: "Your new task has been created successfully.",
      });
    }
    
    setIsFormOpen(false);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = toggleTaskStatus(task);
          
          toast({
            title: updatedTask.status === "completed" ? "Task completed" : "Task reopened",
            description: updatedTask.status === "completed"
              ? "Great job! The task has been marked as completed."
              : "The task has been marked as pending.",
          });
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => deleteTask(prevTasks, taskId));
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    if (result.destination.index === result.source.index) return;
    
    setTasks(prevTasks => {
      const reordered = reorderTasks(
        prevTasks,
        result.source.index,
        result.destination.index
      );
      
      saveTasks(reordered);
      return reordered;
    });
    
    toast({
      title: "Task reordered",
      description: "The task order has been updated.",
    });
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(prevTasks => [...prevTasks, ...importedTasks]);
  };

  const handlePomodoroComplete = () => {
    console.log("Pomodoro completed!");
  };

  const tasksCount = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader onAddTask={handleAddTask} tasksCount={tasksCount} />
      
      <main className="flex-1 container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:max-w-4xl">
        <div className="flex flex-col space-y-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="tasks" className="flex items-center gap-1">
                  <ListTodo className="h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>Statistics</span>
                </TabsTrigger>
                <TabsTrigger value="pomodoro" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>Pomodoro</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                {activeTab === "tasks" && (
                  <>
                    <ImportExport tasks={tasks} onImport={handleImportTasks} />
                    {!isMobile && (
                      <Button onClick={handleAddTask} className="gap-1">
                        <PlusCircle className="h-4 w-4" />
                        Add Task
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <TabsContent value="tasks" className="space-y-4">
              <SearchFilter filter={filter} onFilterChange={setFilter} />
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <TaskList
                        tasks={tasks}
                        filter={filter}
                        onToggleStatus={handleToggleTaskStatus}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onAddTask={handleAddTask}
                        isDraggable={true}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </TabsContent>
            
            <TabsContent value="statistics">
              {statistics ? (
                <Statistics statistics={statistics} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    No task statistics available yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pomodoro">
              <div className="max-w-md mx-auto">
                <PomodoroTimer onComplete={handlePomodoroComplete} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <TaskForm
        task={editingTask}
        onSubmit={handleTaskSubmit}
        onCancel={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default Index;