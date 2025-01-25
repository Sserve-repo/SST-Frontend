"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import { useCallback } from "react";

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File, preview: string) => void;
  fallbackText?: string;
}

export function ProfileImageUpload({
  currentImage,
  onImageChange,
  fallbackText = "User",
}: ProfileImageUploadProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          onImageChange(file, result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentImage} alt="Profile picture" />
        <AvatarFallback className="bg-primary/10">
          {fallbackText.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="profile-image"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => document.getElementById("profile-image")?.click()}
        >
          <UploadCloud className="h-4 w-4" />
          Upload Photo
        </Button>
      </div>
    </div>
  );
}
