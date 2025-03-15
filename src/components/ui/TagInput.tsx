
import React, { useState } from "react";
import { TaskTag } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Tag as TagIcon, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TAG_COLORS } from "@/lib/tasks";

interface TagInputProps {
  tags: TaskTag[];
  onAddTag: (name: string, color: string) => void;
  onRemoveTag: (id: string) => void;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  className,
}) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag(newTagName.trim(), newTagColor);
      setNewTagName("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="pl-2 pr-1 py-1 h-6 gap-1 border-l-4 text-xs items-center"
            style={{ borderLeftColor: tag.color }}
          >
            <TagIcon className="h-3 w-3" />
            {tag.name}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveTag(tag.id)}
              className="h-4 w-4 p-0 ml-1 hover:bg-background"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </Button>
          </Badge>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Add New Tag</h3>
              <div className="space-y-2">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                  className="h-8 text-sm"
                  onKeyDown={handleKeyDown}
                />
                <div>
                  <p className="text-xs mb-2">Select color:</p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={cn(
                          "w-5 h-5 rounded-full",
                          newTagColor === color && "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="w-full mt-2"
                  disabled={!newTagName.trim()}
                  onClick={handleAddTag}
                >
                  Add Tag
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagInput;
