"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trash2, Eye, Upload } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  getProductCategories,
  getProductCategoryItemsById,
  updateProduct,
  getProductDetails,
} from "@/actions/dashboard/vendors";
import type { Product } from "@/types/product";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
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
  shippingCost: z.string().min(1, {
    message: "Shipping cost is required.",
  }),
  stock: z.string().min(1, {
    message: "Stock is required.",
  }),
  threshold: z.string().min(1, {
    message: "Low stock threshold is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  status: z.enum(["0", "1"]).default("0"),
});

interface EditProductDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (product: Product) => void;
}

export function EditProductDialog({
  productId,
  open,
  onOpenChange,
  onUpdate,
}: EditProductDialogProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [productCategoryItems, setProductCategoryItems] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const { toast } = useToast();

  const [images, setImages] = useState<
    { file: File | null; preview: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      subCategory: "",
      price: "",
      shippingCost: "",
      stock: "",
      threshold: "",
      description: "",
      status: "0",
    },
  });

  const handleFetchProductCategory = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await getProductCategories();
      if (response && response.ok) {
        const data = await response.json();
        setProductCategories(data.data["Products Category"] || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  }, [toast]);

  const handlefetchProductCatItems = useCallback(
    async (catId: string) => {
      try {
        setSubCategoriesLoading(true);
        const response = await getProductCategoryItemsById(catId);
        if (response && response.ok) {
          const data = await response.json();
          setProductCategoryItems(
            data.data["Products Category Item By ID"] || []
          );
        }
      } catch (error) {
        console.error("Error fetching category items:", error);
        toast({
          title: "Error",
          description: "Failed to load subcategories",
          variant: "destructive",
        });
      } finally {
        setSubCategoriesLoading(false);
      }
    },
    [toast]
  );

  // Fetch fresh product data from API
  const fetchProductData = useCallback(async () => {
    if (!productId || !open) return;

    try {
      setLoading(true);
      console.log("Fetching fresh product data for ID:", productId);

      const response = await getProductDetails(productId);
      if (response?.ok) {
        const data = await response.json();
        console.log("Fetched product details for edit:", data);

        if (data.status && data.data) {
          const productData = data.data.productListing || data.data;
          setProduct(productData);
        } else {
          throw new Error(data.message || "Failed to fetch product details");
        }
      } else {
        throw new Error("Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [productId, open, toast]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  useEffect(() => {
    const init = async () => {
      if (product && open) {
        console.log("Initializing edit form with product data:", product);

        // Fetch categories first
        handleFetchProductCategory();

        // Extract category ID from API response - prioritize direct field names from API
        const categoryId =
          product.product_category_id?.toString() ||
          product.category?.id?.toString() ||
          "";
        const subCategoryId =
          product.product_category_items_id?.toString() ||
          product.subcategory?.id?.toString() ||
          "";

        console.log(
          "Extracted category ID:",
          categoryId,
          "subCategory ID:",
          subCategoryId
        );

        if (categoryId) {
          await handlefetchProductCatItems(categoryId);
        }

        form.reset({
          name: product.title || "",
          category: categoryId,
          subCategory: subCategoryId.toString() || "",
          price: String(product.price || ""),
          shippingCost: String(product.shipping_cost || ""),
          stock: String(product.stock_level || ""),
          threshold: "5", // Default threshold
          description: product.description || "",
          status: String(product.status) === "1" ? "1" : "0", // Ensure it's "0" or "1"
        });

        // Handle product images from API response - ensure we always have at least one image
        const productImages: { file: File | null; preview: string }[] = [];

        // Add main product image if it exists
        if (product.image && product.image.trim() !== "") {
          productImages.push({ file: null, preview: product.image });
        }

        // Handle product_images array from API
        if (product.product_images && Array.isArray(product.product_images)) {
          product.product_images.forEach((img: any) => {
            if (img.image && img.image !== product.image) {
              productImages.push({ file: null, preview: img.image });
            }
          });
        }

        // If no images, add an empty image slot to prevent the API error
        if (productImages.length === 0) {
          productImages.push({ file: null, preview: "" });
        }

        setImages(productImages);
        console.log("Set product images:", productImages);
      }
    };

    init();
  }, [
    product,
    open,
    form,
    handleFetchProductCategory,
    handlefetchProductCatItems,
  ]);

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
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index] && prev[index].preview.startsWith("blob:")) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return updated;
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", values.name);
      formData.append("product_category_id", values.category);
      formData.append("product_category_items_id", values.subCategory);
      formData.append("price", values.price);
      formData.append("shipping_cost", values.shippingCost);
      formData.append("stock_level", values.stock);
      formData.append("threshold", values.threshold);
      formData.append("description", values.description);
      formData.append("status", values.status);

      // Handle images - send only new file uploads
      // For edit operations, we should only send new images, not existing ones
      const newImages = images.filter((image) => image.file !== null);

      if (newImages.length === 0 && images.length > 0) {
        const existingImage = images[0]; // fallback to first existing image
        const response = await fetch(existingImage.preview);
        const blob = await response.blob();
        const filename = `existing-image-${Date.now()}.jpg`; // backend might expect a name
        formData.append("images[0]", blob, filename);
      } else {
        newImages.forEach((image, index) => {
          if (image.file) {
            formData.append(`images[${index}]`, image.file);
          }
        });
      }

      // Only append new image files to FormData
      newImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`images[${index}]`, image.file);
        }
      });

      // Don't send anything for existing images in edit mode
      // The backend should preserve existing images automatically

      if (!product) {
        console.error("No product data available for update");
        return;
      }

      const response = await updateProduct(String(product.id), formData);

      if (response?.ok) {
        const result = await response.json();
        if (result.status) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          });

          // Create updated product object
          const updatedProduct: Product = {
            ...product,
            title: values.name,
            product_category_id: parseInt(values.category),
            product_category_items_id: parseInt(values.subCategory),
            price: values.price,
            shipping_cost: values.shippingCost,
            stock_level: parseInt(values.stock),
            description: values.description,
            updated_at: new Date().toISOString(),
          };

          onUpdate(updatedProduct);
          onOpenChange(false);
        } else {
          throw new Error(result.message || "Failed to update product");
        }
      } else {
        const errorData = await response?.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      handleFetchProductCategory();
    }
  }, [open, handleFetchProductCategory]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview.startsWith("blob:")) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <FormLabel>Product Category *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlefetchProductCatItems(value);
                          form.setValue("subCategory", "");
                        }}
                        disabled={categoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                categoriesLoading
                                  ? "Loading..."
                                  : "Select category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategories.map((item) => (
                            <SelectItem
                              key={item.id}
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
                      <FormLabel>Product Sub-category *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={subCategoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                subCategoriesLoading
                                  ? "Loading..."
                                  : "Select sub-category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategoryItems.map((item) => (
                            <SelectItem
                              key={item.id}
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
                      <FormLabel>Product Price *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className="pl-6"
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
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className="pl-6"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Level *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Threshold *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
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
                    <FormLabel>Product Description *</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="text-sm font-medium">Product Images</Label>
                <div className="mt-2 grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const image = images[index];
                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                          image
                            ? "border-muted bg-muted/30"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                        )}
                      >
                        {image ? (
                          <>
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={`Product ${index + 1}`}
                              className="absolute h-full w-full rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/placeholder.svg?height=200&width=200";
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -right-2 -top-2 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <Label
                            htmlFor={`image-${index}`}
                            className="flex flex-col items-center gap-2 text-center cursor-pointer p-4"
                          >
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Upload Image
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
                  Upload up to 5 images. Max file size: 25MB each. Supported
                  formats: JPEG, PNG, WebP
                </p>
              </div>

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Draft</SelectItem>
                        <SelectItem value="1">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline" disabled={loading}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Product Preview</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {images.length > 0 && (
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={images[0].preview || "/placeholder.svg"}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg?height=400&width=400";
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {form.watch("name")}
                      </h3>
                      <p className="text-2xl font-bold">
                        ${form.watch("price")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {form.watch("description")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Stock</div>
                        <div>{form.watch("stock")} units</div>
                        <div className="text-muted-foreground">Threshold</div>
                        <div>{form.watch("threshold")} units</div>
                        <div className="text-muted-foreground">Shipping</div>
                        <div>${form.watch("shippingCost")}</div>
                        <div className="text-muted-foreground">Status</div>
                        <div className="capitalize">
                          {form.watch("status") === "1" ? "Published" : "Draft"}
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
