"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";
import { carsAPI, uploadAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Car, ArrowLeft, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const { data: carResponse, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carsAPI.getById(id),
    enabled: !!id,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => api.get("/brands"),
  });

  const car = carResponse?.data?.data;

  const [carData, setCarData] = useState({
    title: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    description: "",
    condition: "used",
    bodyType: "sedan",
    fuelType: "petrol",
    transmission: "manual",
    engineCapacity: "",
    mileage: "",
    kmDriven: "",
    color: "",
    doors: 4,
    seats: 5,
    owners: 1,
    location: {
      city: "",
      state: "",
    },
    features: [] as string[],
    negotiable: true,
    status: "active",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length + existingImages.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setImageFiles([...imageFiles, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (car) {
      setCarData({
        title: car.title || "",
        brand: car.brand?._id || car.brand || "",
        model: car.model || "",
        year: car.year || new Date().getFullYear(),
        price: car.price?.toString() || "",
        description: car.description || "",
        condition: car.condition || "used",
        bodyType: car.bodyType || "sedan",
        fuelType: car.fuelType || "petrol",
        transmission: car.transmission || "manual",
        engineCapacity: car.engineCapacity?.toString() || "",
        mileage: car.mileage?.toString() || "",
        kmDriven: car.kmDriven?.toString() || "",
        color: car.color || "",
        doors: car.doors || 4,
        seats: car.seats || 5,
        owners: car.owners || 1,
        location: {
          city: car.location?.city || "",
          state: car.location?.state || "",
        },
        features: car.features || [],
        negotiable: car.negotiable !== undefined ? car.negotiable : true,
        status: car.status || "active",
      });
      setExistingImages(car.images || []);
    }
  }, [car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || user?.role !== "dealer") {
      toast.error("Only dealers can edit cars");
      return;
    }

    if (existingImages.length === 0 && imageFiles.length === 0) {
      toast.error("Please keep at least one image");
      return;
    }

    setLoading(true);
    try {
      let finalImages = [...existingImages];

      // If there are new images, upload them first
      if (imageFiles.length > 0) {
        toast.loading("Uploading new images...");
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        const uploadResponse = await uploadAPI.uploadImages(formData);
        const uploadedImages = uploadResponse.data.data;
        
        toast.dismiss();
        toast.success("Images uploaded successfully!");

        // Combine existing and new images
        finalImages = [...existingImages, ...uploadedImages];
      }

      // Update car with all data
      const carPayload = {
        title: carData.title,
        brand: carData.brand,
        model: carData.model,
        year: Number(carData.year),
        price: Number(carData.price),
        description: carData.description,
        condition: carData.condition,
        bodyType: carData.bodyType,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        engineCapacity: Number(carData.engineCapacity) || undefined,
        mileage: Number(carData.mileage) || undefined,
        kmDriven: Number(carData.kmDriven) || undefined,
        color: carData.color,
        doors: Number(carData.doors),
        seats: Number(carData.seats),
        owners: Number(carData.owners),
        location: carData.location,
        features: carData.features,
        images: finalImages, // Combined existing + new images
        negotiable: carData.negotiable,
        status: carData.status,
      };

      await carsAPI.update(id, carPayload);
      
      toast.success("Car updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await carsAPI.delete(id);
      toast.success("Car deleted successfully!");
      setDeleteDialog(false);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete car");
    } finally {
      setDeleting(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setCarData({ ...carData, features: [...carData.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setCarData({
      ...carData,
      features: carData.features.filter((_, i) => i !== index),
    });
  };

  if (!isAuthenticated || user?.role !== "dealer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Only dealers can access this page</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Car not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Edit Car
              </h1>
              <p className="text-gray-600 mt-2">Update your car listing</p>
            </div>
            <button
              onClick={() => setDeleteDialog(true)}
              disabled={deleting}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Car
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Car className="w-6 h-6 mr-2 text-blue-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={carData.title}
                  onChange={(e) => setCarData({ ...carData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={carData.brand}
                  onChange={(e) => setCarData({ ...carData, brand: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Brand</option>
                  {brandsData?.data?.data?.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={carData.model}
                  onChange={(e) => setCarData({ ...carData, model: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={carData.year}
                  onChange={(e) => setCarData({ ...carData, year: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={carData.price}
                  onChange={(e) => setCarData({ ...carData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={carData.condition}
                  onChange={(e) => setCarData({ ...carData, condition: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="certified">Certified Pre-Owned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={carData.status}
                  onChange={(e) => setCarData({ ...carData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={carData.description}
                onChange={(e) => setCarData({ ...carData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                <select
                  value={carData.bodyType}
                  onChange={(e) => setCarData({ ...carData, bodyType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="coupe">Coupe</option>
                  <option value="convertible">Convertible</option>
                  <option value="wagon">Wagon</option>
                  <option value="van">Van</option>
                  <option value="truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  value={carData.fuelType}
                  onChange={(e) => setCarData({ ...carData, fuelType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="cng">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <select
                  value={carData.transmission}
                  onChange={(e) => setCarData({ ...carData, transmission: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="semi-automatic">Semi-Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engine Capacity (cc)
                </label>
                <input
                  type="number"
                  min="0"
                  value={carData.engineCapacity}
                  onChange={(e) => setCarData({ ...carData, engineCapacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage (km/l)
                </label>
                <input
                  type="number"
                  min="0"
                  value={carData.mileage}
                  onChange={(e) => setCarData({ ...carData, mileage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Driven
                </label>
                <input
                  type="number"
                  min="0"
                  value={carData.kmDriven}
                  onChange={(e) => setCarData({ ...carData, kmDriven: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={carData.color}
                  onChange={(e) => setCarData({ ...carData, color: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doors</label>
                <input
                  type="number"
                  min="2"
                  max="5"
                  value={carData.doors}
                  onChange={(e) => setCarData({ ...carData, doors: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  min="2"
                  max="9"
                  value={carData.seats}
                  onChange={(e) => setCarData({ ...carData, seats: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owners</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={carData.owners}
                  onChange={(e) => setCarData({ ...carData, owners: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={carData.location.city}
                  onChange={(e) =>
                    setCarData({
                      ...carData,
                      location: { ...carData.location, city: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={carData.location.state}
                  onChange={(e) =>
                    setCarData({
                      ...carData,
                      location: { ...carData.location, state: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-blue-600" />
              Car Images
            </h2>
            <div className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Current Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url || image}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    {imageFiles.length > 0 ? "Add more images" : "Upload new images"}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to 10MB (Max 10 images total)
                  </p>
                </label>
              </div>

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">New Images to Upload</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {carData.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-blue-900 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Options</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={carData.negotiable}
                  onChange={(e) => setCarData({ ...carData, negotiable: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Price is negotiable</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Car"}
            </button>
          </div>
        </form>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Car"
          message="Are you sure you want to delete this car? This action cannot be undone and all associated data will be permanently removed."
          confirmText="Delete Car"
          cancelText="Cancel"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
}
