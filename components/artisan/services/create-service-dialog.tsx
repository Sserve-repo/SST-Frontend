"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImagePlus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  createServiceListing,
  getServiceCategories,
  getServiceCategoryItemsById,
} from "@/actions/dashboard/artisans";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Service title must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  subCategory: z.string().min(1, {
    message: "Sub-category is required.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  status: z.enum(["0", "1"]).default("0"),
});

interface CreateServiceDialogProps {
  children: React.ReactNode;
  onSubmit: () => void;
}

export function CreateServiceDialog({
  children,
  onSubmit,
}: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [serviceCategoryItems, setServiceCategoryItems] = useState<any[]>([]);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      price: "",
      duration: "",
      description: "",
      status: "0",
    },
  });

  const handleFetchServiceCategories = async () => {
    try {
      const response = await getServiceCategories();
      if (response && response.ok) {
        const data = await response.json();
        console.log("Service categories data:", data);
        setServiceCategories(data.data["Service Category"] || []);
      }
    } catch (error) {
      console.error("Error fetching service categories:", error);
    }
  };

  const handleFetchServiceCategoryItems = async (catId: string) => {
    try {
      const response = await getServiceCategoryItemsById(catId);
      if (response && response.ok) {
        const data = await response.json();
        console.log("Service category items data:", data);
        setServiceCategoryItems(data.data["Service Category Item By ID"] || []);
      }
    } catch (error) {
      console.error("Error fetching service category items:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("category_id", values.category);
      formData.append("sub_category_id", values.subCategory);
      formData.append("price", values.price);
      formData.append("service_duration", values.duration);
      formData.append("description", values.description);
      formData.append("status", values.status);

      // Add images
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
      });

      const response = await createServiceListing(formData);

      if (response?.ok) {
        const result = await response.json();
        if (result.status) {
          toast({
            title: "Success",
            description: "Service created successfully",
          });
          setOpen(false);
          form.reset();
          setImages([]);
          onSubmit();
        } else {
          throw new Error(result.message || "Failed to create service");
        }
      } else {
        throw new Error("Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      handleFetchServiceCategories();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>
            Add a new service to your offerings. Fill in all the required
            information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleFetchServiceCategoryItems(value);
                          form.setValue("subCategory", ""); // Reset subcategory
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(serviceCategories) &&
                            serviceCategories.map((item) => (
                              <SelectItem
                                key={item.id}
                                className="h-11 rounded-lg px-3"
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Sub-category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub-category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(serviceCategoryItems) &&
                            serviceCategoryItems.map((item) => (
                              <SelectItem
                                key={item.id}
                                className="h-11 rounded-lg px-3"
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            className="pl-6"
                            placeholder="0.00"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px]"
                        placeholder="Describe your service..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label>Service Images</Label>
                <div className="mt-2 grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const image = images[index];
                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative flex aspect-square items-center justify-center rounded-lg border-2 border-dashed",
                          image
                            ? "border-muted bg-muted/30"
                            : "border-muted-foreground/25"
                        )}
                      >
                        {image ? (
                          <>
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={`Service ${index + 1}`}
                              className="absolute h-full w-full rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -right-2 -top-2 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Label
                            htmlFor={`image-${index}`}
                            className="flex flex-col items-center gap-2 text-center cursor-pointer"
                          >
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Click to Upload
                              <br />
                              or drag and drop
                            </span>
                            <Input
                              id={`image-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </Label>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Max. file size: 25MB. Supported formats: JPEG, PNG, WebP
                </p>
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Draft</SelectItem>
                        <SelectItem value="1">Active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
