import AdminCategories from "@/components/admin/admin-categories"

export default function AdminCategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Category Management</h1>
                <p className="text-gray-500">Organize your product inventory with categories.</p>
            </div>
            <AdminCategories />
        </div>
    )
}
