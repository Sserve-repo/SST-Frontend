"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface ProfileImageUploadProps {
  value: string
  onChange: (value: string) => void
}

export function ProfileImageUpload({ value, onChange }: ProfileImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLoading(true)
      // In a real application, you would upload the file to your storage
      // For this example, we'll create an object URL
      const url = URL.createObjectURL(acceptedFiles[0])
      onChange(url)
      setLoading(false)
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  })

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={value} alt="Profile picture" />
        <AvatarFallback>{loading ? "..." : value ? "Profile" : "Upload"}</AvatarFallback>
      </Avatar>

      <div {...getRootProps()} className="flex flex-col items-start gap-2">
        <input {...getInputProps()} />
        <Button type="button" variant="outline">
          <Camera className="h-4 w-4 mr-2" />
          Change Picture
        </Button>
        <p className="text-sm text-gray-500">
          {isDragActive ? "Drop the image here" : "Click to upload or drag and drop"}
        </p>
      </div>
    </div>
  )
}

