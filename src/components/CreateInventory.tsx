"use client";
import { BRANDS, existingCategories } from "@/constants";
import { InventoryFormData } from "@/types/inventory";
import { useState } from "react";

interface CreateInventoryFormProps {
  onSubmit: (data: InventoryFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function CreateInventory({
  onSubmit,
  onClose,
  isLoading = false,
}: CreateInventoryFormProps) {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: "",
    brand: "",
    category: "",
    price: 0,
    stock: 0,
    discount: 0,
    description: "",
    // sku: "",
    minStockLevel: 10,
    details: [],
    benefits: [],
  });

  const [errors, setErrors] = useState<Partial<InventoryFormData>>({});
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<InventoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (+formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (+formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.minStockLevel && formData.minStockLevel < 0) {
      // newErrors.minStockLevel = "Minimum stock level cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof InventoryFormData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateTotalValue = () => {
    return (+formData.price * +formData.stock).toLocaleString();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Inventory Item
        </h1>
        <p className="text-gray-600">
          Fill in the details below to add a new product to your inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
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
                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
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
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new category name"
                />
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
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
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Enter product description (optional)"
              />
            </div>
            {/* Product Details */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Details (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.details?.join("\n")}
                onChange={(e) =>
                  handleInputChange("details", e.target.value?.split("\n"))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="e.g., Made with organic ingredients&#10;No added preservatives"
              />
            </div>
            {/* Benefits */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.benefits?.join("\n")}
                onChange={(e) =>
                  handleInputChange("benefits", e.target.value.split("\n"))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="e.g., Boosts immunity&#10;Improves digestion"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Pricing & Stock
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <input
                type="number"
                min="0"
                value={formData.discount}
                onChange={(e) =>
                  handleInputChange("discount", parseInt(e.target.value) || 0)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.discount
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="10"
              />
              {errors.discount && (
                <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
              )}
              {formData.discount > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {`Selling price = ${+Math.round(
                    +Math.round(+formData.price * (1 - formData.discount / 100))
                  )}`}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.stock ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>
            {/* Minimum Stock Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock Alert
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStockLevel}
                onChange={(e) =>
                  handleInputChange(
                    "minStockLevel",
                    parseInt(e.target.value) || 0
                  )
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.minStockLevel
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="10"
              />
              {errors.minStockLevel && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minStockLevel}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Alert when stock falls below this level
              </p>
            </div>
          </div>

          {/* Total Value Display */}
          {+formData.price > 0 && +formData.stock > 0 && (
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
            className={`flex-1 md:flex-none md:px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors cursor-pointer ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Inventory Item"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
