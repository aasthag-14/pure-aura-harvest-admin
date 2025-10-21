"use client";
import { BRANDS, YES_NO } from "@/constants";
import { InventoryFormData } from "@/types/inventory";
import { Collection } from "@/types/collection";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateInventoryFormProps {
  onClose: () => void;
  formData?: InventoryFormData;
  isEdit?: boolean;
}

type YES_NO = "Yes" | "No";

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
  sku: string;
  id: string;
  isBestSeller?: YES_NO;
  isNewArrival?: YES_NO;
  inStock?: YES_NO;
  shortDescription?: string;
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
  sku: "",
  id: "",
  isBestSeller: "No",
  isNewArrival: "No",
  inStock: "Yes",
  shortDescription: "",
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

export default function InventoryForm({
  onClose,
  formData,
  isEdit,
}: CreateInventoryFormProps) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function loadCollections() {
      try {
        const res = await fetch("/api/collections", { cache: "no-store" });
        const json = (await res.json()) as Collection[];
        setCollections(json || []);
      } catch (e) {
        console.error(e);
        setCollections([]);
      }
    }
    loadCollections();
  }, []);

  useEffect(() => {
    if (formData?.category) {
      const exists = collections.some((c) => c.id === formData.category);
      setIsCustomCategory(!exists);
    }
  }, [collections, formData?.category]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InventoryForm>({
    defaultValues: getInitialValues(formData),
  });

  const price = watch("price");
  const discount = watch("discount");

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

            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                SKU *
              </label>
              <input
                id="sku"
                type="text"
                {...register("sku", {
                  required: "SKU is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.sku ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter product sku"
                aria-invalid={errors.sku ? "true" : "false"}
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.sku.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ID *
              </label>
              <input
                id="id"
                type="text"
                {...register("id", {
                  required: "ID is required to create a slug",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.id ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter product id: lemongrass-hanging-car-perfume"
                aria-invalid={errors.id ? "true" : "false"}
              />
              {errors.id && (
                <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Short Description *
              </label>
              <input
                id="shortDescription"
                type="text"
                {...register("shortDescription", {
                  required: "Short Description is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.shortDescription
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Enter product short description"
                aria-invalid={errors.shortDescription ? "true" : "false"}
              />
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shortDescription.message}
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
                {Object.values(BRANDS).map((brand) => (
                  <option key={brand.name} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="isBestSeller"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Is Bestseller ?
              </label>
              <select
                id="isBestSeller"
                {...register("isBestSeller")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
                  errors.isBestSeller
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select</option>
                {YES_NO.map((isBestSeller) => (
                  <option key={isBestSeller} value={isBestSeller}>
                    {isBestSeller}
                  </option>
                ))}
              </select>
              {errors.isBestSeller && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.isBestSeller.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="isNewArrival"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Is New Arrival ?
              </label>
              <select
                id="isNewArrival"
                {...register("isNewArrival")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
                  errors.isNewArrival
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select</option>
                {YES_NO.map((isNewArrival) => (
                  <option key={isNewArrival} value={isNewArrival}>
                    {isNewArrival}
                  </option>
                ))}
              </select>
              {errors.isNewArrival && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.isNewArrival.message}
                </p>
              )}
            </div>

            {/* in stock */}
            <div>
              <label
                htmlFor="inStock"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Is In Stock ?
              </label>
              <select
                id="inStock"
                {...register("inStock")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
                  errors.inStock
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select</option>
                {YES_NO.map((inStock) => (
                  <option key={inStock} value={inStock}>
                    {inStock}
                  </option>
                ))}
              </select>
              {errors.inStock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.inStock.message}
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
                  {collections.map((c) => (
                    <option key={c._id || c.id} value={c.id}>
                      {c.title}
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
