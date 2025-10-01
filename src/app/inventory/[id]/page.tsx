"use client";

import InventoryForm from "@/components/InventoryForm";
import Modal from "@/components/Modal";
import { Product } from "@/types/product";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const res = await axios.get(`/api/inventory/${id}`);
        setProduct(res.data);
      };
      fetchProduct();
    }
  }, [id]);

  const handleEdit = () => {
    openEditModal();
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `Delete "${product?.name}"? This action cannot be undone.`
    );
    if (!ok) return;

    try {
      await axios.delete(`/api/inventory/${id}`);
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleToggleActive = async () => {
    if (!product) return;
    axios.put(`/api/inventory/${id}`, { active: !product.active });
    setProduct({ ...product, active: !product.active });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/3">
          {product.images?.length > 0 ? (
            <Image
              width={500}
              height={500}
              src={`${process.env.NEXT_PUBLIC_APP_URL}${product.images?.[0]}`}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl shadows"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-xl">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-lg text-gray-500">{product.tagline}</p>
            )}
            <p className="mt-3 text-gray-700">{product.description}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg ${
                product?.active
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-medium transition`}
            >
              {product?.active ? "Deactivate" : "Activate"}
            </button>
            <button onClick={handleEdit} className="btn-primary">
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
            >
              Delete
            </button>
            <Link href="/" className="btn-secondary">
              Close
            </Link>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-8 grid gap-6">
        {product.benefits && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Benefits
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {product.benefits.map((b: string, idx: number) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {product.details && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Details
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {product.details.map((d: string, idx: number) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Render extra properties dynamically */}
        {Object.entries(product).map(([key, value]) => {
          if (
            [
              "_id",
              "id",
              "name",
              "description",
              "tagline",
              "price",
              "stock",
              "benefits",
              "details",
              "nutrition",
              "usage",
              "image",
              "images",
            ].includes(key)
          ) {
            return null;
          }

          if (Array.isArray(value)) {
            return (
              <div key={key}>
                <h2 className="text-lg font-semibold mb-2 capitalize text-gray-800">
                  {key}
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {value.map((item, idx) => (
                    <li key={idx}>
                      {typeof item === "string" ? item : JSON.stringify(item)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          if (typeof value === "object" && value !== null) {
            return (
              <div key={key}>
                <h2 className="text-lg font-semibold mb-2 capitalize text-gray-800">
                  {key}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  {Object.entries(value).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 p-2 rounded-lg text-sm">
                      <span className="font-medium capitalize">{k}: </span>
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={key}>
              <h2 className="text-lg font-semibold mb-2 capitalize text-gray-800">
                {key}
              </h2>
              <p className="text-gray-700">{String(value)}</p>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <InventoryForm
          onClose={closeModal}
          formData={{
            ...product,
            _id: product._id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            stock: product.stock,
            discount: product.discount || 0,
            minStockLevel: product.minStockLevel || 10,
            description: product.description,
            details: product.details,
            benefits: product.benefits,
            images: product.images,
            sku: product.sku,
            isBestSeller: product.isBestSeller,
            isNewArrival: product.isNewArrival,
            inStock: product.inStock,
            shortDescription: product.shortDescription,
          }}
          isEdit
        />
      </Modal>
    </div>
  );
};

export default ViewProduct;
