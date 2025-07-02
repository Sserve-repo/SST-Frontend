"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "./image-upload";
import type { Service } from "@/types/services";

interface ServicesFormProps {
  service?: Service | null;
  onSubmit: (data: Partial<Service>) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function ServicesForm({
  service,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: ServicesFormProps) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    category: service?.category || "",
    price: service?.price || 0,
    duration: service?.duration || 60,
    location: service?.location || "",
    featured: service?.featured || false,
    availability: service?.availability || ["available"],
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: Partial<Service> = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      availability: formData.availability as Service["availability"],
    };

    if (images.length > 0) {
      // In a real app, you'd upload images first and get URLs
      submitData.images = images.map(
        (file, index) => `service-image-${Date.now()}-${index}.jpg`
      );
    }

    onSubmit(submitData);
  };

  const handleImageChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleImageRemove = (fileToRemove: File) => {
    setImages(images.filter((file) => file !== fileToRemove));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter service name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your service in detail"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beauty">Beauty & Grooming</SelectItem>
                  <SelectItem value="wellness">Health & Wellness</SelectItem>
                  <SelectItem value="fitness">Fitness & Training</SelectItem>
                  <SelectItem value="home">Home Services</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="education">
                    Education & Tutoring
                  </SelectItem>
                  <SelectItem value="events">Events & Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="0.00"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number(e.target.value) })
                }
                placeholder="60"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="location">Service Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Client's location, My studio"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Select
              value={String(formData.availability[0] || "")}
              onValueChange={(value) =>
                setFormData({ ...formData, availability: [value] })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked })
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="featured">Feature this service</Label>
          </div>

          <div>
            <Label>Service Images</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Upload high-quality images of your work or service setup
            </p>
            <ImageUpload
              value={images}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : service
              ? "Update Service"
              : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
