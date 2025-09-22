"use client";
import { BRANDS, existingCategories } from "@/constants";
import { InventoryFormData } from "@/types/inventory";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CreateInventoryFormProps {
  onClose: () => void;
  formData?: InventoryFormData;
  isEdit?: boolean;
}

interface InventoryForm {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  discount: number;
  minStockLevel: number;
  description: string;
  details: string;
  benefits: string;
  images: string;
}

const defaultValues: InventoryForm = {
  name: "",
  brand: "",
  category: "",
  price: 0,
  stock: 0,
  discount: 0,
  minStockLevel: 10,
  description: "",
  details: "",
  benefits: "",
  images: "",
};

const getInitialValues = (formData?: InventoryFormData): InventoryForm => {
  return {
    ...defaultValues,
    ...formData,
    details: formData?.details?.join("\n") || "",
    benefits: formData?.benefits?.join("\n") || "",
    images: formData?.images?.join("\n") || "",
  };
};

export default function CreateInventory({
  onClose,
  formData,
  isEdit,
}: CreateInventoryFormProps) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InventoryForm>({
    defaultValues: getInitialValues(formData),
  });

  const price = watch("price");
  const stock = watch("stock");
  const discount = watch("discount");

  const calculateTotalValue = (): string => {
    const total = (price || 0) * (stock || 0);
    return total.toLocaleString();
  };

  const calculateSellingPrice = (): number => {
    const discountAmount = ((discount || 0) / 100) * (price || 0);
    return Math.round((price || 0) - discountAmount);
  };

  const validatePrice = (value: number) => {
    if (!value || value <= 0) {
      return "Price must be greater than 0";
    }
    return true;
  };

  const validateStock = (value: number) => {
    if (value === undefined || value === null || value < 0) {
      return "Stock cannot be negative";
    }
    return true;
  };

  const validateDiscount = (value: number) => {
    if (value && (value < 0 || value > 100)) {
      return "Discount must be between 0 and 100";
    }
    return true;
  };

  const validateMinStock = (value: number) => {
    if (value && value < 0) {
      return "Minimum stock cannot be negative";
    }
    return true;
  };

  const validateImageUrls = (value: string) => {
    if (!value) return true;
    const urls = value.split("\n").filter(Boolean);
    for (const url of urls) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(url) && !url.startsWith("/")) {
        return "Please enter valid URLs or file paths";
      }
    }
    return true;
  };

  const onSubmit = async (data: InventoryForm) => {
    try {
      setIsLoading(true);

      // Transform textarea values to arrays
      const processedData: InventoryFormData = {
        ...data,
        details:
          typeof data.details === "string"
            ? (data.details as string).split("\n").filter(Boolean)
            : data.details || [],
        benefits:
          typeof data.benefits === "string"
            ? (data.benefits as string).split("\n").filter(Boolean)
            : data.benefits || [],
        images:
          typeof data.images === "string"
            ? (data.images as string).split("\n").filter(Boolean)
            : data.images || [],
      };

      if (isEdit) {
        await axios.put(`/api/inventory/${formData?._id}`, processedData);
        onClose();
        return;
      }

      await axios.post("/api/inventory", processedData);

      onClose();
    } catch (error) {
      console.error("Error creating inventory:", error);
      // You might want to show a toast here like in your example
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Inventory Item" : "Add New Inventory Item"}
        </h1>
        <p className="text-gray-600">
          Fill in the details below to{" "}
          {isEdit ? "edit an existing product" : "add a new product"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Basic
            Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Product name is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter product name"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand *
              </label>
              <select
                id="brand"
                {...register("brand", {
                  required: "Brand is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
                  errors.brand ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select a brand</option>
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !isCustomCategory
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Select Existing
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCustomCategory
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Create New
                </button>
              </div>

              {isCustomCategory ? (
                <input
                  type="text"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new category name"
                />
              ) : (
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {existingCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="Enter product description (optional)"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Details (one per line)
              </label>
              <textarea
                id="details"
                rows={3}
                {...register("details")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="e.g., Made with organic ingredients&#10;No added preservatives"
              />
            </div>

            {/* Benefits */}
            <div className="md:col-span-2">
              <label
                htmlFor="benefits"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Benefits (one per line)
              </label>
              <textarea
                id="benefits"
                rows={3}
                {...register("benefits")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="e.g., Boosts immunity&#10;Improves digestion"
              />
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Images (URLs, one per line)
              </label>
              <textarea
                id="images"
                rows={3}
                {...register("images", {
                  validate: validateImageUrls,
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                  errors.images ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="e.g., /images/products/moringa.jpeg"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Stock Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Pricing
            & Stock
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Unit Price (₹) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  validate: validatePrice,
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="0.00"
                aria-invalid={errors.price ? "true" : "false"}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Discount (%)
              </label>
              <input
                id="discount"
                type="number"
                min="0"
                max="100"
                {...register("discount", {
                  valueAsNumber: true,
                  validate: validateDiscount,
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.discount
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="0"
                aria-invalid={errors.discount ? "true" : "false"}
              />
              {errors.discount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discount.message}
                </p>
              )}
              {discount > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Selling price: ₹{calculateSellingPrice()}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Initial Stock Quantity *
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                {...register("stock", {
                  required: "Stock quantity is required",
                  valueAsNumber: true,
                  validate: validateStock,
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.stock ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="0"
                aria-invalid={errors.stock ? "true" : "false"}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Minimum Stock Level */}
            <div>
              <label
                htmlFor="minStockLevel"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Minimum Stock Alert
              </label>
              <input
                id="minStockLevel"
                type="number"
                min="0"
                {...register("minStockLevel", {
                  valueAsNumber: true,
                  validate: validateMinStock,
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.minStockLevel
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="10"
                aria-invalid={errors.minStockLevel ? "true" : "false"}
              />
              {errors.minStockLevel && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minStockLevel.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Alert when stock falls below this level
              </p>
            </div>
          </div>

          {/* Total Value */}
          {price > 0 && stock > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-800">
                  Total Inventory Value:
                </span>
                <span className="text-2xl font-bold text-green-900">
                  ₹{calculateTotalValue()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 md:flex-none md:px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            }`}
          >
            {isLoading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Inventory Item"
              : "Create Inventory Item"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
