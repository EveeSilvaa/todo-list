
import React from "react";
import { cn } from "@/lib/utils";
import { TaskCategory } from "@/lib/types";

interface CategoryBadgeProps {
  category: TaskCategory;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  // Mapping of category to display label
  const categoryLabels: Record<TaskCategory, string> = {
    work: "Work",
    personal: "Personal",
    health: "Health",
    finance: "Finance",
    other: "Other",
  };

  // Mapping of category to background color
  const categoryColors: Record<TaskCategory, string> = {
    work: "bg-category-work text-white",
    personal: "bg-category-personal text-white",
    health: "bg-category-health text-white",
    finance: "bg-category-finance text-white",
    other: "bg-category-other text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all",
        categoryColors[category],
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  );
};

export default CategoryBadge;
