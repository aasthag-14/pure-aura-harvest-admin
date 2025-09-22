import { InventoryFormData, InventoryItem } from "@/types/inventory";
import { useState, useMemo } from "react";
import Modal from "./Modal";
import CreateInventory from "./CreateInventory";
import { useAppData } from "@/context/AppDataContext";

export default function InventoryTab({
  inventory,
}: {
  inventory: InventoryItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<keyof InventoryItem>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setRefetch } = useAppData();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(inventory.map((item) => item.category))];
    return ["All", ...cats];
  }, [inventory]);

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    const filtered = inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort inventory
    filtered.sort((a, b) => {
      let aValue = a[sortBy] as string;
      let bValue = b[sortBy] as string;

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [inventory, searchTerm, selectedCategory, sortBy, sortOrder]);

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (stock <= 10)
      return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    if (stock <= 50)
      return { status: "Medium Stock", color: "bg-blue-100 text-blue-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const toggleSort = (field: keyof InventoryItem) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateInventory = async (data: InventoryFormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to create inventory: ${res.statusText}`);
      }

      await res.json();
      setIsLoading(false);
      setRefetch(true);

      closeModal();

      // Optional: show toast or reset form
    } catch (error) {
      console.error("Error creating inventory:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h2>
          <p className="text-gray-600">
            Manage your product inventory with {inventory.length} total items
          </p>
        </div>
        <div>
          <button
            onClick={openModal}
            className="bg-blue-700 text-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            + Create
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort("name")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                sortBy === "name"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Name
              {sortBy === "name" && (
                <svg
                  className={`w-3 h-3 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => toggleSort("stock")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                sortBy === "stock"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Stock
              {sortBy === "stock" && (
                <svg
                  className={`w-3 h-3 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => toggleSort("price")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                sortBy === "price"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Price
              {sortBy === "price" && (
                <svg
                  className={`w-3 h-3 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredInventory.length} of {inventory.length} items
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Inventory Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item.stock);

          return (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 font-medium text-sm mt-1">
                    {item.brand}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color} flex-shrink-0 ml-3`}
                >
                  {stockStatus.status}
                </span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {item.category}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock Quantity</span>
                  <span
                    className={`font-bold text-lg ${
                      item.stock === 0
                        ? "text-red-600"
                        : item.stock <= 10
                        ? "text-yellow-600"
                        : "text-gray-900"
                    }`}
                  >
                    {item.stock}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unit Price</span>
                  <span className="font-bold text-lg text-green-600">
                    ₹{item.price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="font-bold text-lg text-gray-600">
                    {item.discount > 0 ? `${item.discount}%` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Selling Price</span>
                  <div>
                    <span className="text-xl text-[#393831] font-bold">
                      ₹
                      {item.discount > 0
                        ? +Math.round(+item.price * (1 - item.discount / 100))
                        : item.price}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-sm text-[#393831]/60 line-through">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Total Value
                  </span>
                  <span className="font-bold text-xl text-gray-900">
                    ₹{(item.stock * item.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {/* <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  Edit Item
                </button>
                <button className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div> */}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateInventory
          onClose={closeModal}
          onSubmit={handleCreateInventory}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
