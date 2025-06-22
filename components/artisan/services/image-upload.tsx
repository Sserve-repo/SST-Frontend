"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  value: File[];
  onChange: (value: File[]) => void;
  onRemove: (file: File) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLoading(true);
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const filteredFiles = acceptedFiles.filter(
        (file) => allowedTypes.includes(file.type) && file instanceof File
      );
      onChange([...value, ...filteredFiles]);
      setLoading(false);
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 5,
  });

  const createImagePreview = (file: File) => {
    try {
      if (file instanceof File && file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return "/assets/images/image-placeholder.png?height=96&width=96";
    } catch (error) {
      console.error("Error creating object URL:", error);
      return "/assets/images/image-placeholder.png?height=96&width=96";
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}
          ${loading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImagePlus className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            {loading
              ? "Processing..."
              : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, JPEG, WEBP up to 5 files
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group">
              <img
                src={createImagePreview(file) || "/assets/images/image-placeholder.png"}
                alt={`Service image ${index + 1}`}
                className="h-24 w-full rounded-md object-cover border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/assets/images/image-placeholder.png?height=96&width=96";
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(file);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
