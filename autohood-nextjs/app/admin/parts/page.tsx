"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, uploadAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Package, Search, Trash2, Plus, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatPrice } from "@/lib/utils";

export default function AdminPartsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; partId: string; partName: string }>({
    isOpen: false,
    partId: "",
    partName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPart, setEditingPart] = useState<any>(null);
  const [partForm, setPartForm] = useState({
    name: "",
    category: "engine",
    price: "",
    description: "",
    stock: "",
    sku: "",
  });
  const [partImages, setPartImages] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const { data: partsData, isLoading } = useQuery({
    queryKey: ["admin-parts", categoryFilter, search],
    queryFn: () => api.get("/parts", { 
      params: { 
        category: categoryFilter === "all" ? undefined : categoryFilter,
        search 
      } 
    }),
  });

  const handleDeletePart = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/parts/${deleteDialog.partId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-parts"] });
      toast.success("Part deleted successfully");
      setDeleteDialog({ isOpen: false, partId: "", partName: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete part");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleStockMutation = useMutation({
    mutationFn: ({ partId, inStock }: any) => 
      api.put(`/parts/${partId}`, { inStock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-parts"] });
      toast.success("Stock status updated");
    },
  });

  const parts = partsData?.data?.data || [];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + partImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const uploadResponse = await uploadAPI.uploadImages(formData);
      const uploadedImages = uploadResponse.data.data;

      setPartImages([...partImages, ...uploadedImages]);
      
      // Create previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      toast.success("Images uploaded successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setPartImages(partImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmitPart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (partImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const submitData = {
      ...partForm,
      price: Number(partForm.price),
      stock: Number(partForm.stock),
      images: partImages.map((img, index) => ({
        ...img,
        isPrimary: index === 0,
      })),
    };

    try {
      if (editingPart) {
        await api.put(`/parts/${editingPart._id}`, submitData);
        toast.success("Part updated successfully");
      } else {
        await api.post("/parts", submitData);
        toast.success("Part created successfully");
      }
      
      queryClient.invalidateQueries({ queryKey: ["admin-parts"] });
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save part");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingPart(null);
    setPartForm({
      name: "",
      category: "engine",
      price: "",
      description: "",
      stock: "",
      sku: "",
    });
    setPartImages([]);
    setImagePreviews([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-6 md:py-8 pb-20 md:pb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-900 hover:text-gray-700 mb-4 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Parts Management</h1>
            <p className="text-sm md:text-base text-gray-600">Manage all auto parts inventory</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all flex items-center text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
            <span className="hidden md:inline">Add Part</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-2xl p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="engine">Engine</option>
              <option value="transmission">Transmission</option>
              <option value="brakes">Brakes</option>
              <option value="suspension">Suspension</option>
              <option value="electrical">Electrical</option>
              <option value="body">Body</option>
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="wheels">Wheels</option>
              <option value="lighting">Lighting</option>
              <option value="cooling">Cooling</option>
              <option value="exhaust">Exhaust</option>
              <option value="fuel-system">Fuel System</option>
              <option value="steering">Steering</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Parts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No parts found</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {parts.map((part: any) => (
                <div key={part._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex gap-4 p-4">
                    {part.images?.[0]?.url && (
                      <img
                        src={part.images[0].url}
                        alt={part.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{part.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 capitalize">{part.category}</p>
                      <p className="font-semibold text-gray-900 mb-1">{formatPrice(part.price)}</p>
                      <p className="text-xs text-gray-600">{part.stockQuantity} units</p>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-4 space-y-2">
                    <button
                      onClick={() => toggleStockMutation.mutate({ partId: part._id, inStock: !part.inStock })}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                        part.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {part.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                    
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, partId: part._id, partName: part.name })}
                      className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Part</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parts.map((part: any) => (
                      <tr key={part._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {part.images?.[0]?.url && (
                              <img
                                src={part.images[0].url}
                                alt={part.name}
                                className="w-12 h-12 rounded-lg object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-800">{part.name}</div>
                              <div className="text-sm text-gray-500">{part.brand?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                            {part.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {formatPrice(part.price)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {part.stockQuantity} units
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStockMutation.mutate({ partId: part._id, inStock: !part.inStock })}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              part.inStock
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {part.inStock ? "In Stock" : "Out of Stock"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, partId: part._id, partName: part.name })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, partId: "", partName: "" })}
          onConfirm={handleDeletePart}
          title="Delete Part"
          message={`Are you sure you want to delete ${deleteDialog.partName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          loading={isDeleting}
        />

        {/* Add/Edit Part Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto my-8">
              <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {editingPart ? "Edit Part" : "Add New Part"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitPart} className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={partForm.name}
                      onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={partForm.category}
                      onChange={(e) => setPartForm({ ...partForm, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    >
                      <option value="engine">Engine</option>
                      <option value="transmission">Transmission</option>
                      <option value="brakes">Brakes</option>
                      <option value="suspension">Suspension</option>
                      <option value="electrical">Electrical</option>
                      <option value="body">Body</option>
                      <option value="interior">Interior</option>
                      <option value="exterior">Exterior</option>
                      <option value="wheels">Wheels</option>
                      <option value="lighting">Lighting</option>
                      <option value="cooling">Cooling</option>
                      <option value="exhaust">Exhaust</option>
                      <option value="fuel-system">Fuel System</option>
                      <option value="steering">Steering</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={partForm.price}
                      onChange={(e) => setPartForm({ ...partForm, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={partForm.stock}
                      onChange={(e) => setPartForm({ ...partForm, stock: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={partForm.sku}
                      onChange={(e) => setPartForm({ ...partForm, sku: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                      placeholder="e.g., PART-12345"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={partForm.description}
                    onChange={(e) => setPartForm({ ...partForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images <span className="text-red-500">*</span> (Max 5)
                  </label>
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-gray-900 text-white text-xs px-2 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {imagePreviews.length < 5 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-900 transition-colors">
                      <input
                        type="file"
                        id="part-images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label htmlFor="part-images" className="cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          {uploading ? "Uploading..." : "Upload Images"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || partImages.length === 0}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 text-sm"
                  >
                    {editingPart ? "Update Part" : "Add Part"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
