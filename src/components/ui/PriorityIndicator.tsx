
import React from "react";
import { cn } from "@/lib/utils";
import { TaskPriority } from "@/lib/types";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface PriorityIndicatorProps {
  priority: TaskPriority;
  showLabel?: boolean;
  className?: string;
}

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  showLabel = false,
  className,
}) => {
  // Mapping priority to icon and color
  const priorityConfig: Record<
    TaskPriority,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    high: {
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-priority-high",
      label: "High",
    },
    medium: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-priority-medium",
      label: "Medium",
    },
    low: {
      icon: <Info className="h-4 w-4" />,
      color: "text-priority-low",
      label: "Low",
    },
  };

  const { icon, color, label } = priorityConfig[priority];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        color,
        className
      )}
    >
      {icon}
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
};

export default PriorityIndicator;
