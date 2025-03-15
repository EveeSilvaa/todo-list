
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskFilter } from "@/lib/types";
import { Search, Filter, X, ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { PRIORITY_OPTIONS, CATEGORY_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from "@/lib/tasks";

interface SearchFilterProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filter,
  onFilterChange,
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    filter.sortDirection || "desc"
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ 
      ...filter, 
      status: value ? (value as any) : undefined 
    });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({ 
      ...filter, 
      priority: value ? (value as any) : undefined 
    });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ 
      ...filter, 
      category: value ? (value as any) : undefined 
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ 
      ...filter, 
      sortBy: value as any,
      sortDirection
    });
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    onFilterChange({ 
      ...filter, 
      sortDirection: newDirection 
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: filter.search,
      sortBy: "createdAt",
      sortDirection: "desc"
    });
  };

  const hasActiveFilters = filter.status || filter.priority || filter.category;

  return (
    <div className={className}>
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filter.search || ""}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-2 h-2" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortDirection}
          title={`Sort ${sortDirection === "asc" ? "ascending" : "descending"}`}
        >
          {sortDirection === "asc" ? (
            <ArrowUpZA className="h-4 w-4" />
          ) : (
            <ArrowDownAZ className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {showFilters && (
        <div className="p-4 bg-card border rounded-lg mb-4 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="h-8 px-2"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filter.status || ""} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={filter.priority || ""} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any priority</SelectItem>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filter.category || ""} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any category</SelectItem>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select 
                value={filter.sortBy || "createdAt"} 
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Date created" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
