"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, uploadAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Tag, Search, Trash2, Edit, Plus, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminBrandsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; brandId: string; brandName: string }>({
    isOpen: false,
    brandId: "",
    brandName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [brandForm, setBrandForm] = useState({
    name: "",
    country: "",
    description: "",
    logo: null as any,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const { data: brandsData, isLoading } = useQuery({
    queryKey: ["admin-brands", search],
    queryFn: () => api.get("/brands", { params: { search } }),
  });

  const handleDeleteBrand = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/brands/${deleteDialog.brandId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Brand deleted successfully");
      setDeleteDialog({ isOpen: false, brandId: "", brandName: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  const createBrandMutation = useMutation({
    mutationFn: (data: any) => api.post("/brands", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Brand created successfully");
      setBrandForm({ name: "", country: "", description: "", logo: null });
      setLogoFile(null);
      setLogoPreview("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create brand");
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/brands/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Brand updated successfully");
      setEditingBrand(null);
      setBrandForm({ name: "", country: "", description: "", logo: null });
      setLogoFile(null);
      setLogoPreview("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update brand");
    },
  });

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary immediately
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("images", file);

      const uploadResponse = await uploadAPI.uploadImages(formData);
      const uploadedImage = uploadResponse.data.data[0];

      setBrandForm({ ...brandForm, logo: uploadedImage });
      toast.success("Logo uploaded successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload logo");
      setLogoFile(null);
      setLogoPreview("");
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setBrandForm({ ...brandForm, logo: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: any = {
      name: brandForm.name,
      country: brandForm.country,
      description: brandForm.description,
    };

    if (brandForm.logo) {
      submitData.logo = brandForm.logo;
    }

    if (editingBrand) {
      updateBrandMutation.mutate({ id: editingBrand._id, data: submitData });
    } else {
      createBrandMutation.mutate(submitData);
    }
  };

  const startEdit = (brand: any) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      country: brand.country,
      description: brand.description || "",
      logo: brand.logo || null,
    });
    if (brand.logo?.url) {
      setLogoPreview(brand.logo.url);
    }
  };

  const cancelEdit = () => {
    setEditingBrand(null);
    setBrandForm({ name: "", country: "", description: "", logo: null });
    setLogoFile(null);
    setLogoPreview("");
  };

  const brands = brandsData?.data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8 pb-20 md:pb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Brand Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all car brands</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Brand Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Japan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brand tagline or description"
                  />
                </div>
                
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Logo
                  </label>
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-32 object-contain bg-gray-50 rounded-xl border-2 border-gray-200 p-4"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          {uploading ? "Uploading..." : "Upload Logo"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingBrand && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={createBrandMutation.isPending || updateBrandMutation.isPending || uploading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : editingBrand ? "Update Brand" : "Add Brand"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Brands List */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Brands Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : brands.length === 0 ? (
                <div className="p-12 text-center">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No brands found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brands.map((brand: any) => (
                    <div
                      key={brand._id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          {brand.logo?.url && (
                            <img
                              src={brand.logo.url}
                              alt={brand.name}
                              className="w-12 h-12 object-contain mr-3"
                            />
                          )}
                          <div>
                            <h3 className="font-bold text-gray-800">{brand.name}</h3>
                            <p className="text-sm text-gray-500">{brand.country}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(brand)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, brandId: brand._id, brandName: brand.name })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {brand.description && (
                        <p className="text-sm text-gray-600">{brand.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, brandId: "", brandName: "" })}
          onConfirm={handleDeleteBrand}
          title="Delete Brand"
          message={`Are you sure you want to delete ${deleteDialog.brandName}? This will affect all cars associated with this brand.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          loading={isDeleting}
        />
      </div>
    </div>
  );
}
