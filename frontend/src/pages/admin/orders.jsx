import AdminOrders from "@/components/admin/admin-orders"

export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order Management</h1>
                <p className="text-gray-500">View and update the status of customer orders.</p>
            </div>
            <AdminOrders />
        </div>
    )
}
