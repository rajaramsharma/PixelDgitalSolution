import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/api"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"

export default function AdminProducts({ onUpdate }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    basePrice: 0,
    stock: 0,
    isActive: true,
    images: {
      front: "",
      back: "",
    },
    customizationOptions: {
      allowText: true,
      allowImage: true,
      allowColor: false,
    },
  })

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          apiRequest("/api/products?category=all"),
          apiRequest("/api/categories")
        ])
        setProducts(productsData.products || [])
        setCategories(categoriesData || [])

        if (categoriesData?.length > 0) {
          setFormData(prev => ({ ...prev, category: categoriesData[0].slug }))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /* ---------------- IMAGE UPLOAD (BASE64) ---------------- */
  const handleImageUpload = (side) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [side]: ev.target.result,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert("Product name is required")
      return
    }
    if (!formData.basePrice && formData.basePrice !== 0) {
      alert("Base price is required")
      return
    }
    if (!formData.images.front) {
      alert("Front view image is required")
      return
    }

    try {
      if (editingProduct) {
        await apiRequest(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        })
        alert("Product updated successfully!")
      } else {
        await apiRequest("/api/products", {
          method: "POST",
          body: JSON.stringify(formData),
        })
        alert("Product created successfully!")
      }

      setDialogOpen(false)
      resetForm()
      reloadProducts()
      onUpdate?.()
    } catch (err) {
      alert(err.message || "Failed to save product")
    }
  }

  const reloadProducts = async () => {
    const data = await apiRequest("/api/products?category=all")
    setProducts(data.products || [])
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      basePrice: product.basePrice,
      stock: product.stock,
      isActive: product.isActive,
      images: product.images || { front: "", back: "" },
      customizationOptions: product.customizationOptions,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return
    await apiRequest(`/api/products/${id}`, { method: "DELETE" })
    reloadProducts()
    onUpdate?.()
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      category: categories.length > 0 ? categories[0].slug : "",
      description: "",
      basePrice: 0,
      stock: 0,
      isActive: true,
      images: { front: "", back: "" },
      customizationOptions: {
        allowText: true,
        allowImage: true,
        allowColor: false,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    )
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Products</h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm h-9 px-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
            <DialogHeader className="p-5 pb-3 border-b border-gray-100 bg-gray-50/50">
              <DialogTitle className="text-lg font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {editingProduct ? "Make changes to your product here." : "Fill in the details to create a new product."}
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-5 space-y-6">
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-3 space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-600 rounded-full" />
                      Product Details
                    </h3>

                    <div className="grid gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium text-sm">Product Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="e.g. Classic Cotton T-Shirt"
                          className="h-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-700 font-medium text-sm">Category</Label>
                        <div className="space-y-2">
  <Label className="text-gray-700 font-medium text-sm">
    Category
  </Label>

  <div className="grid grid-cols-2 gap-3">
    {categories.map((cat) => (
      <label
        key={cat._id}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all
          ${
            formData.category === cat.slug
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white hover:border-blue-300"
          }
        `}
      >
        <input
          type="radio"
          name="category"
          value={cat.slug}
          checked={formData.category === cat.slug}
          onChange={() =>
            setFormData({ ...formData, category: cat.slug })
          }
          className="accent-blue-600"
        />
        {cat.name}
      </label>
    ))}
  </div>
</div>

                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-700 font-medium text-sm">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Detailed description of the product..."
                          className="min-h-[100px] bg-gray-50/50 border-gray-200 focus:bg-white transition-colors resize-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-4 bg-green-600 rounded-full" />
                      Inventory & Pricing
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-700 font-medium text-sm">Base Price (RS)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="1"
                          step="1"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                          className="h-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock" className="text-gray-700 font-medium text-sm">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          min="1"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          className="h-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Media & Status */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-4 bg-purple-600 rounded-full" />
                      Product Imagery
                    </h3>

                    <div className="space-y-3">
                      {/* Front Image Uploader */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium text-xs uppercase">Front View</Label>
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload("front")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          />
                          <div className={`
                            border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all h-32 bg-gray-50
                            ${formData.images.front ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300 hover:bg-white'}
                          `}>
                            {formData.images.front ? (
                              <img src={formData.images.front} alt="Front View" className="h-full object-contain" />
                            ) : (
                              <div className="space-y-1.5 text-gray-400">
                                <Plus className="h-6 w-6 mx-auto" />
                                <span className="text-xs font-medium">Upload Front Image</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Back Image Uploader */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium text-xs uppercase">Back View</Label>
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload("back")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          />
                          <div className={`
                            border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all h-32 bg-gray-50
                            ${formData.images.back ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300 hover:bg-white'}
                          `}>
                            {formData.images.back ? (
                              <img src={formData.images.back} alt="Back View" className="h-full object-contain" />
                            ) : (
                              <div className="space-y-1.5 text-gray-400">
                                <Plus className="h-6 w-6 mx-auto" />
                                <span className="text-xs font-medium">Upload Back Image</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-gray-900">Product Status</Label>
                        <p className="text-xs text-gray-500">
                          {formData.isActive ? "Visible in store" : "Hidden from store"}
                        </p>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-lg h-9 px-6 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg h-9 px-6 shadow-lg shadow-blue-500/20 text-sm"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p._id} className="group rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden bg-gray-100 group">
                {/* BACK IMAGE */}
                {p.images?.back && (
                  <img
                    src={p.images.back}
                    alt={`${p.name} back`}
                    className="
                      absolute inset-0 w-full h-full
                      object-contain
                      opacity-0
                      transition-all duration-300
                      group-hover:opacity-100
                      z-10
                    "
                  />
                )}

                {/* FRONT IMAGE */}
                {p.images?.front ? (
                  <img
                    src={p.images.front}
                    alt={p.name}
                    className="
                      absolute inset-0 w-full h-full
                      object-contain
                      opacity-100
                      transition-all duration-300
                      group-hover:opacity-0
                      z-20
                    "
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-3">
              <CardTitle className="text-base font-semibold text-gray-900">{p.name}</CardTitle>
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                {p.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  RS {p.basePrice.toFixed(2)}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.isActive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                  }`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>

            <CardFooter className="gap-2 p-3 bg-gray-50 border-t border-gray-100">
              <Button variant="outline" onClick={() => handleEdit(p)} className="flex-1 border-gray-300 hover:bg-gray-100 text-xs h-8">
                <Edit className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(p._id)}
                className="flex-1 border-gray-300 hover:bg-red-50 hover:border-red-300 text-red-600 text-xs h-8"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
