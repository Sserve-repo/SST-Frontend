"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  onRemove: (value: string) => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLoading(true)
      // In a real application, you would upload these files to your storage
      // For this example, we'll create object URLs
      const urls = acceptedFiles.map((file) => URL.createObjectURL(file))
      onChange([...value, ...urls])
      setLoading(false)
    },
    [value, onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 5,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition
          ${isDragActive ? "border-primary" : "border-gray-300"}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImagePlus className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">Drag & drop images here, or click to select</p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((url) => (
            <div key={url} className="relative group">
              <img src={url || "/placeholder.svg"} alt="Service" className="h-24 w-full rounded-md object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                onClick={() => onRemove(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

