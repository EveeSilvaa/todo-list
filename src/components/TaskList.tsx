
import React from "react";
import { Task, TaskFilter } from "@/lib/types";
import TaskCard from "./ui/TaskCard";
import EmptyState from "./EmptyState";
import { filterTasks, sortTasks } from "@/lib/tasks";
import { Draggable } from "react-beautiful-dnd";

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  onToggleStatus: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onAddTask: () => void;
  isDraggable?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleStatus,
  onEdit,
  onDelete,
  onAddTask,
  isDraggable = false,
}) => {
  // Filter and sort tasks based on current filter criteria
  const filteredTasks = filterTasks(tasks, filter);
  const sortedTasks = sortTasks(
    filteredTasks,
    filter.sortBy || "createdAt",
    filter.sortDirection || "desc"
  );

  // If there are no tasks at all
  if (tasks.length === 0) {
    return (
      <EmptyState
        message="No tasks yet"
        subMessage="Start by creating your first task"
        onAddTask={onAddTask}
      />
    );
  }

  // If there are tasks, but none match the current filters
  if (sortedTasks.length === 0) {
    return (
      <EmptyState
        message="No matching tasks"
        subMessage="Try adjusting your filters or create a new task"
        onAddTask={onAddTask}
      />
    );
  }

  return (
    <div className="space-y-3">
      {sortedTasks.map((task, index) => (
        isDraggable ? (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
                  opacity: snapshot.isDragging ? 0.8 : 1
                }}
              >
                <TaskCard
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              </div>
            )}
          </Draggable>
        ) : (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          />
        )
      ))}
    </div>
  );
};

export default TaskList;
