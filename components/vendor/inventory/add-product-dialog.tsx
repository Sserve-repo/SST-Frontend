"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trash2, Eye, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
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
  createProduct,
  getPromotions,
} from "@/actions/dashboard/vendors";
import type { Promotion } from "@/types/promotions";

type ProductCategory = {
  id: string | number;
  name: string;
};

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    category: z.string().min(1, {
      message: "Category is required.",
    }),
    subCategory: z.string().min(1, {
      message: "Sub-category is required.",
    }),
    discountId: z.string().optional(),
    price: z.string().min(1, {
      message: "Price is required.",
    }),
    shippingCost: z.string().min(1, {
      message: "Shipping cost is required.",
    }),
    stock: z.string().min(1, {
      message: "Stock level is required.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    applyDiscount: z.boolean().default(false),
    status: z.enum(["draft", "published"]).default("draft"),
  })
  .refine(
    (data) => {
      if (data.applyDiscount && !data.discountId) {
        return false;
      }
      return true;
    },
    {
      message: "Discount is required when Apply Discount is selected.",
      path: ["discountId"],
    }
  );

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddProductDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddProductDialogProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [productCategoryItems, setProductCategoryItems] = useState<
    ProductCategory[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      subCategory: "",
      price: "",
      shippingCost: "",
      stock: "",
      description: "",
      discountId: "",
      applyDiscount: false,
      status: "draft",
    },
  });

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
      if (prev[index]) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return updated;
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock_level", values.stock);
      formData.append("shipping_cost", values.shippingCost);
      formData.append("product_category_id", values.category);
      formData.append("product_category_items_id", values.subCategory);
      formData.append("status", values.status === "published" ? "1" : "0");

      if (values.applyDiscount && values.discountId) {
        formData.append("discount_id", values.discountId);
      }

      // Always add at least one image, even if it's empty
      if (images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`images[${index}]`, image.file);
        });
      } else {
        // Add a placeholder to satisfy the API requirement
        const emptyFile = new File([""], "placeholder.jpg", {
          type: "image/jpeg",
        });
        formData.append("images[0]", emptyFile);
      }

      const response = await createProduct(formData);

      if (!response || !response.ok) {
        const errorData = await response?.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();

      if (result.status) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });

        form.reset();
        setImages([]);
        setApplyDiscount(false);
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(result.message || "Failed to create product");
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProductCategory = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getProductCategories();

      if (response && response.ok) {
        const data = await response.json();
        setProductCategories(data.data?.["Products Category"] || []);
      } else {
        throw new Error("Failed to fetch categories");
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
  };

  const handlefetchProductCatItems = async (catId: string) => {
    try {
      setSubCategoriesLoading(true);
      const response = await getProductCategoryItemsById(catId);

      if (response && response.ok) {
        const data = await response.json();
        setProductCategoryItems(
          data.data?.["Products Category Item By ID"] || []
        );
      } else {
        throw new Error("Failed to fetch subcategories");
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
  };

  const handleFetchPromotions = async () => {
    try {
      const response = await getPromotions();

      if (!response?.ok) {
        throw new Error("Failed to fetch promotions");
      }

      const data = await response.json();
      const transformedPromotions =
        data?.data?.productDiscount?.map(
          (pd: {
            id: any;
            discount_name: string;
            discount_type: string;
            discount_value: any;
            start_date: any;
            end_date: any;
            status: string;
            usage_limit: any;
            description: any;
          }) => ({
            id: pd.id,
            code: pd?.discount_name?.toUpperCase(),
            type: pd?.discount_type?.toLowerCase(),
            value: pd.discount_value,
            serviceName: pd.discount_name,
            startDate: pd.start_date,
            endDate: pd.end_date,
            status: pd?.status?.toLowerCase(),
            usageLimit: pd?.usage_limit,
            usageCount: pd?.usage_limit,
            description: pd.description,
          })
        ) || [];

      setPromotions(transformedPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset();
      setImages([]);
      setApplyDiscount(false);
      setProductCategoryItems([]);
      handleFetchProductCategory();
      handleFetchPromotions();
    }
  }, [open, form]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory. Fill in all required fields and
            click create.
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
                      <Input placeholder="Enter product name" {...field} />
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
                          form.setValue("subCategory", "");
                          handlefetchProductCatItems(value);
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
                      <FormLabel>Sub-category *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          subCategoriesLoading || !form.watch("category")
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                subCategoriesLoading
                                  ? "Loading..."
                                  : !form.watch("category")
                                  ? "Select category first"
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

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Level *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter stock quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product in detail..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="text-sm font-medium">
                  Product Images (Optional)
                </Label>
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

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="applyDiscount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setApplyDiscount(checked === true);
                            if (!checked) {
                              form.setValue("discountId", "");
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Apply discount to this product</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Select an existing promotion to apply to this product
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {applyDiscount && (
                  <FormField
                    control={form.control}
                    name="discountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Discount</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a discount" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {promotions.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                No active promotions available
                              </div>
                            ) : (
                              promotions.map((promotion) => (
                                <SelectItem
                                  key={promotion.id}
                                  value={promotion.id.toString()}
                                >
                                  <div className="flex flex-col">
                                    <span>{promotion.code}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {promotion.type === "percentage"
                                        ? `${promotion.value}% off`
                                        : `$${promotion.value} off`}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t">
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
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {form.watch("name") || "Product Name"}
                      </h3>
                      <p className="text-2xl font-bold">
                        ${form.watch("price") || "0.00"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {form.watch("description") ||
                          "No description provided."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Stock</div>
                        <div>{form.watch("stock") || "0"} units</div>
                        <div className="text-muted-foreground">Shipping</div>
                        <div>${form.watch("shippingCost") || "0.00"}</div>
                        <div className="text-muted-foreground">Status</div>
                        <div className="capitalize">{form.watch("status")}</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
