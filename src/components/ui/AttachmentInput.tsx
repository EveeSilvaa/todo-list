
import React, { useState, useRef } from "react";
import { Attachment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Paperclip, File, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttachmentInputProps {
  attachments: Attachment[];
  onAddAttachment: (file: File) => void;
  onRemoveAttachment: (id: string) => void;
  className?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

const AttachmentInput: React.FC<AttachmentInputProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddAttachment(files[0]);
      // Reset the input value so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8"
        >
          <Paperclip className="h-4 w-4 mr-1" />
          Add Attachment
        </Button>
      </div>

      {attachments && attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between gap-2 border rounded-md p-2 text-sm bg-muted/30"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <File className="h-4 w-4 flex-shrink-0" />
                <div className="truncate">
                  <div className="font-medium truncate">{attachment.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.url, "_blank")}
                  className="h-7 w-7 p-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="h-7 w-7 p-0 text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentInput;
