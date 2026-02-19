import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Edit, Trash2, Tag } from "lucide-react"

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

export default function AdminCategories({ onUpdate }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await apiRequest("/api/categories")
      setCategories(data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      slug: slugify(formData.name),
    }

    try {
      if (editingCategory) {
        await apiRequest(`/api/categories/${editingCategory._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      } else {
        await apiRequest("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      }

      setDialogOpen(false)
      resetForm()
      loadCategories()
      onUpdate?.()
    } catch {
      alert("Failed to save category")
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive ?? true,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return
    await apiRequest(`/api/categories/${id}`, { method: "DELETE" })
    loadCategories()
    onUpdate?.()
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      isActive: true,
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Categories</h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isActive: v })
                  }
                />
                <Label>Active</Label>
              </div>

              <Button className="w-full">
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat._id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {cat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {cat.description || "No description"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Slug: {cat.slug}
              </p>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => handleEdit(cat)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleDelete(cat._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
