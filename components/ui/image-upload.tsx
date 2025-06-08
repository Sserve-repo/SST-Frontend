"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value?: string | File;
  onChange: (file: File | null) => void;
  className?: string;
  maxSize?: number; // in MB
  accept?: string;
  preview?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  className,
  maxSize = 5,
  accept = "image/*",
  preview = true,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getPreviewUrl = () => {
    if (!value) return null;
    if (typeof value === "string") return value;
    return URL.createObjectURL(value);
  };

  const handleFile = (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    onChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removeImage = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className={cn("space-y-4", className)}>
      {preview && previewUrl && (
        <div className="relative group">
          <div className="relative aspect-square w-32 h-32 rounded-lg overflow-hidden border">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setError("Failed to load image")}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
            {previewUrl ? (
              <ImageIcon className="h-full w-full" />
            ) : (
              <Upload className="h-full w-full" />
            )}
          </div>
          <div className="text-sm">
            <span className="font-medium text-primary">Click to upload</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, GIF up to {maxSize}MB
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
