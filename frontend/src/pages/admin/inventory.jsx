import AdminProducts from "@/components/admin/admin-products"

export default function AdminInventoryPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Management</h1>
                <p className="text-gray-500">Manage your product listings and stock levels.</p>
            </div>
            <AdminProducts />
        </div>
    )
}
