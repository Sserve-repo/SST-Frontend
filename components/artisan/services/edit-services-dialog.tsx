"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
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
  updateServiceListing,
  getServiceCategories,
  getServiceCategoryItemsById,
  getServiceDetails,
} from "@/actions/dashboard/artisans";
import type { Service } from "@/types/services";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Service title must be at least 2 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  subCategory: z.string().min(1, { message: "Sub-category is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  duration: z.string().min(1, { message: "Duration is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  status: z.enum(["0", "1"]).default("0"),
  start_time: z.string().min(1, { message: "Start time is required." }),
  end_time: z.string().min(1, { message: "End time is required." }),
  home_service_availability: z.enum(["0", "1"]).default("0"),
});

interface EditServicesDialogProps {
  serviceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (service: Service) => void;
}

export function EditServicesDialog({
  serviceId,
  open,
  onOpenChange,
  onUpdate,
}: EditServicesDialogProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [serviceCategoryItems, setServiceCategoryItems] = useState<any[]>([]);
  const [images, setImages] = useState<
    { file: File | null; preview: string }[]
  >([]);
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
      start_time: "",
      end_time: "",
      home_service_availability: "0",
    },
  });

  // Fetch fresh service data from API
  const fetchServiceData = useCallback(async () => {
    if (!serviceId || !open) return;

    try {
      setLoading(true);
      console.log("Fetching fresh service data for ID:", serviceId);

      const response = await getServiceDetails(serviceId);
      if (response?.ok) {
        const data = await response.json();
        console.log("Fetched service details for edit:", data);

        if (data.status && data.data) {
          const serviceData = data.data.serviceListing || data.data;
          setService(serviceData);
        } else {
          throw new Error(data.message || "Failed to fetch service details");
        }
      } else {
        throw new Error("Failed to fetch service details");
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      toast({
        title: "Error",
        description: "Failed to load service details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [serviceId, open, toast]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  // Initialize form with service data
  useEffect(() => {
    const init = async () => {
      if (service) {
        console.log("Initializing form with service data:", service);

        // Fetch categories first
        handleFetchServiceCategories();

        // Extract category ID from API response - use direct field names from API
        const categoryId =
          service.service_category_id?.toString() ||
          service.service_category?.id?.toString() ||
          service.category_id?.toString() ||
          "";
        const subCategoryId =
          service.service_category_items_id?.toString() ||
          service.service_category_item?.id?.toString() ||
          service.sub_category_id?.toString() ||
          "";

        console.log(
          "Extracted category ID:",
          categoryId,
          "subCategory ID:",
          subCategoryId
        );

        // Fetch subcategories if category exists
        if (categoryId) {
          await handleFetchServiceCategoryItems(categoryId);
        }

        form.reset({
          title: service.title || service.name || "",
          category: categoryId,
          subCategory: subCategoryId,
          price: String(service.price || ""),
          duration: String(service.service_duration || service.duration || ""),
          description: service.description || "",
          status: String(service.status) === "1" ? "1" : "0", // Ensure it's "0" or "1"
          start_time: service.start_time || "",
          end_time: service.end_time || "",
          home_service_availability:
            String(service.home_service_availability) === "1" ? "1" : "0",
        });

        // Handle service images from API response
        const serviceImages: { file: File | null; preview: string }[] = [];
        if (service.image && service.image.trim() !== "") {
          serviceImages.push({ file: null, preview: service.image });
        }
        if (service.service_images && Array.isArray(service.service_images)) {
          service.service_images.forEach((img: any) => {
            if (img.image && img.image !== service.image) {
              serviceImages.push({ file: null, preview: img.image });
            }
          });
        }
        // Legacy images support
        if (service.images && Array.isArray(service.images)) {
          service.images.forEach((img: string) => {
            if (img && !serviceImages.some((si) => si.preview === img)) {
              serviceImages.push({ file: null, preview: img });
            }
          });
        }

        setImages(serviceImages);
        console.log("Set service images:", serviceImages);
      }
    };
    init();
  }, [service, form]);

  const handleFetchServiceCategories = async () => {
    try {
      const response = await getServiceCategories();
      if (response && response.ok) {
        const data = await response.json();
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
      formData.append("start_time", values.start_time);
      formData.append("end_time", values.end_time);
      formData.append(
        "home_service_availability",
        values.home_service_availability
      );

      // Add images
      images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images[${index}]`, image.file);
        }
      });

      if (!service) {
        console.error("No service data available for update");
        return;
      }

      const response = await updateServiceListing(service.id, formData);

      if (response?.ok) {
        const result = await response.json();
        if (result.status) {
          toast({
            title: "Success",
            description: "Service updated successfully",
          });
          // Create updated service object with form values
          const updatedService: Service = {
            ...service,
            name: values.title,
            title: values.title,
            category_id: parseInt(values.category),
            sub_category_id: parseInt(values.subCategory),
            price: parseFloat(values.price),
            duration: parseInt(values.duration),
            description: values.description,
            status: values.status === "1" ? "active" : "inactive",
            start_time: values.start_time,
            end_time: values.end_time,
            updatedAt: new Date(),
          };
          onUpdate(updatedService);
          onOpenChange(false);
        } else {
          throw new Error(result.message || "Failed to update service");
        }
      } else {
        throw new Error("Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetchServiceCategories();
  }, []);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Make changes to your service. Click save when you&apos;re done.
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
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
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
                          <SelectValue placeholder="Select status" />
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
              <FormField
                control={form.control}
                name="home_service_availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Service Available</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
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
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
