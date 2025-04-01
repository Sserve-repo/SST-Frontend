"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImagePlus, Trash2, Eye } from "lucide-react";
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
import {
  getProductCategories,
  getProductCategoryItemsById,
} from "@/actions/vendors";
import { createProduct, getPromotions } from "@/actions/dashboard/vendors";
import { Promotion } from "@/types/promotions";

type ProductCategory = {
  id: string;
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
      message: "Discount Id is required when Apply Discount is selected.",
      path: ["discountId"],
    }
  );

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setInventoryItems: any;
}

export function AddProductDialog({
  open,
  onOpenChange,
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
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Add product logic here
    try {
      setLoading(true);
      const formData = new FormData();
      // formData.append("user_email", "");
      formData.append("title", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock_level", values.stock);
      formData.append("shipping_cost", values.shippingCost);
      formData.append("product_category_id", values.category);
      formData.append("product_category_items_id", values.subCategory);
      formData.append("discount_id", values?.discountId as any);

      // Assuming images[0] and images[1] are File objects from an input element
      images.map((image, index) => {
        formData.append(`images[${index}]`, image.file as any);
      });

      const response = await createProduct(formData);
      if (!response?.ok) {
        setLoading(false);
        throw Error("Error creating product");
      }

      window.location.href = "/vendor/dashboard/inventory";
      onOpenChange(false);
      form.reset();
      setImages([]);
      setLoading(false);
    } catch (error: any) {
      throw Error("Internal server error occured: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProductCategory = async () => {
    const response = await getProductCategories();
    if (response && response.ok) {
      const data = await response.json();
      setProductCategories(data.data["Products Category"]);
    }
  };

  const handlefetchProductCatItems = async (catId: string) => {
    const response = await getProductCategoryItemsById(catId);
    if (response && response.ok) {
      const data = await response.json();
      setProductCategoryItems(data.data["Products Category Item By ID"]);
    }
  };

  const handleFetchPromotions = async () => {
    try {
      const response = await getPromotions();
      if (!response?.ok) {
        throw Error("Error fetching promotions");
      }

      const data = await response.json();
      console.log({ data });

      const transformedPromotions = data?.data?.productDiscount.map(
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
        }) => {
          return {
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
          };
        }
      );

      setPromotions(transformedPromotions || []);
    } catch (error) {
      console.error("internal server error occured.", error);
    }
  };

  useEffect(() => {
    form.register("applyDiscount");
    handleFetchProductCategory();
    handleFetchPromotions();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory. Click create when you&lsquo;re
            done.
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
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name of product" {...field} />
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
                      <FormLabel>Product Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlefetchProductCatItems(value);
                        }}
                        // defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategories.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="h-11 rounded-lg px-3"
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            );
                          })}
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
                      <FormLabel>Product Sub-category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategoryItems.map((item, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className="h-11 rounded-lg px-3"
                                value={item.id.toString()}
                              >
                                {item.name}
                              </SelectItem>
                            );
                          })}
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
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input
                            type="number"
                            step="0.01"
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
                      <FormLabel>Shipping Costs</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input
                            type="number"
                            step="0.01"
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
                    <FormLabel>Set Stock Levels</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter no. of items/products"
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
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your product..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label>Upload Product Images</Label>
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
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Label
                            htmlFor={`image-${index}`}
                            className="flex flex-col items-center gap-2 text-center"
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
                name="applyDiscount"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.setValue("applyDiscount", checked === true);
                          setApplyDiscount(checked === true);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Apply discount to this product</FormLabel>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {promotions.map((promotion) => (
                            <SelectItem
                              key={promotion.id}
                              value={promotion.id.toString()}
                            >
                              {promotion.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Discard
              </Button>
              <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline">
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
                        <div className="text-muted-foreground">Category</div>
                        <div>{form.watch("category") || "Not set"}</div>
                        <div className="text-muted-foreground">
                          Sub-category
                        </div>
                        <div>{form.watch("subCategory") || "Not set"}</div>
                        <div className="text-muted-foreground">Stock</div>
                        <div>{form.watch("stock") || "0"} units</div>
                        <div className="text-muted-foreground">Shipping</div>
                        <div>${form.watch("shippingCost") || "0.00"}</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Submitting..." : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
