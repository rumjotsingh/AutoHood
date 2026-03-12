"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { brandsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";

const initialForm = {
  name: "",
  country: "",
  website: "",
  description: "",
  isFeatured: false,
  isActive: true,
};

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const { data: brandsData, isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => brandsAPI.getAdminAll({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: typeof initialForm) => brandsAPI.create(payload),
    onSuccess: () => {
      toast.success("Brand created");
      setFormData(initialForm);
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: typeof initialForm }) => brandsAPI.update(id, payload),
    onSuccess: () => {
      toast.success("Brand updated");
      setEditingId(null);
      setFormData(initialForm);
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => brandsAPI.delete(id),
    onSuccess: () => {
      toast.success("Brand deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData });
      return;
    }

    createMutation.mutate(formData);
  };

  const handleEdit = (brand: any) => {
    setEditingId(brand._id);
    setFormData({
      name: brand.name || "",
      country: brand.country || "",
      website: brand.website || "",
      description: brand.description || "",
      isFeatured: Boolean(brand.isFeatured),
      isActive: brand.isActive !== false,
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="glass-card rounded-3xl p-6 h-fit">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Brand" : "Create Brand"}</h2>
            <p className="text-sm text-gray-600">Manage core brand catalog data.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            placeholder="Brand name"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
            required
          />
          <input
            value={formData.country}
            onChange={(event) => setFormData((current) => ({ ...current, country: event.target.value }))}
            placeholder="Country"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
            required
          />
          <input
            value={formData.website}
            onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))}
            placeholder="Website"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
          />
          <textarea
            value={formData.description}
            onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
            placeholder="Description"
            className="min-h-32 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
          />

          <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(event) => setFormData((current) => ({ ...current, isFeatured: event.target.checked }))}
            />
            Featured brand
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(event) => setFormData((current) => ({ ...current, isActive: event.target.checked }))}
            />
            Active brand
          </label>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Save Changes" : "Create Brand"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialForm);
                }}
                className="rounded-2xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Brand Catalog</h2>
            <p className="text-sm text-gray-600">{brandsData?.data?.pagination?.totalItems || 0} brands available.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Brand</th>
                <th className="pb-3 pr-4 font-medium">Country</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Cars</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={5}>Loading brands...</td>
                </tr>
              ) : (
                brandsData?.data?.data?.map((brand: any) => (
                  <tr key={brand._id} className="border-b border-gray-100 align-top">
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-gray-900">{brand.name}</p>
                      <p className="text-xs text-gray-500">{brand.website || "No website"}</p>
                    </td>
                    <td className="py-4 pr-4 text-gray-700">{brand.country}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${brand.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"}`}>
                          {brand.isActive ? "Active" : "Inactive"}
                        </span>
                        {brand.isFeatured && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-gray-700">{brand.stats?.totalCars || 0}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(brand)} className="rounded-xl border border-gray-200 p-2 text-gray-700 hover:bg-white">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(brand._id)}
                          className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}