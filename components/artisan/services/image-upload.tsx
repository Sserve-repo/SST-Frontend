"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  value: File[]
  onChange: (value: File[]) => void
  onRemove: (file: File) => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  console.log({loading})

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setLoading(true)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      const filteredFiles = acceptedFiles.filter(file =>
        allowedTypes.includes(file.type)
      )
      onChange([...value, ...filteredFiles])
      setLoading(false)
    },
    [value, onChange]
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
          {value.map((file) => (
            <div key={file.name} className="relative group">
              <img
                src={URL.createObjectURL(file)} // ✅ preview
                alt="Service"
                className="h-24 w-full rounded-md object-cover"
                />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                onClick={() => onRemove(file)}
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
