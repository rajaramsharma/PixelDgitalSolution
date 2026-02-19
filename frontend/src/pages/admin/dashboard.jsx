import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/authContext"
import { apiRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableHead, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import AdminProducts from "@/components/admin/admin-products"
import AdminOrders from "@/components/admin/admin-orders"

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        pendingOrders: 0,
        activeItems: 0,
        recentOrders: 0,
        recentRevenue: 0,
    })
    const [orders, setOrders] = useState([])
    const [expandedOrder, setExpandedOrder] = useState(null)

    useEffect(() => {
        // If auth loading is done but not authenticated, redirect
        if (isAuthenticated === false) {
            navigate("/admin/login")
            return
        }

        if (isAuthenticated && user?.role !== "admin") {
            navigate("/")
            return
        }

        if (isAuthenticated) {
            loadStats()
        }
    }, [isAuthenticated, user, navigate])

    const loadStats = async () => {
        try {
            const [ordersData, productsData] = await Promise.all([
                apiRequest("/api/orders"),
                apiRequest("/api/products?category=all"),
            ])

            const allOrders = ordersData.orders || []
            const products = productsData.products || []

            // Set orders for the management tab
            setOrders(allOrders)

            // Calculate recent orders (last 7 days) for stats
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            const recentOrders = allOrders.filter(order => new Date(order.createdAt) >= sevenDaysAgo)

            setStats({
                totalOrders: allOrders.length,
                totalRevenue: allOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                totalProducts: products.length,
                pendingOrders: allOrders.filter((order) => order.status === "pending").length,
                activeItems: products.filter(p => p.isActive).length,
                recentOrders: recentOrders.length,
                recentRevenue: recentOrders.reduce((sum, order) => sum + order.totalAmount, 0),
            })
        } catch (error) {
            console.error("[v0] Failed to load stats:", error)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await apiRequest(`/api/orders/${orderId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            })
            await loadStats() // Reload to get updated data
            alert("Order status updated successfully!")
        } catch (error) {
            alert(error.message || "Failed to update order status")
        }
    }

    // Initial loading state
    if (isAuthenticated === null) return null // Waiting for auth check

    if (!isAuthenticated || user?.role !== "admin") {
        return null
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        System Control
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-none font-sans">Dashboard Overview</h1>
                    <p className="text-gray-600 font-normal text-sm">Real-time statistics and operational metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm text-sm font-semibold flex items-center gap-3">
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </div>
                        <span className="text-gray-700 tracking-tight text-xs font-medium">Live System</span>
                    </div>
                    <Button onClick={loadStats} variant="outline" size="icon" className="rounded-xl h-10 w-10 bg-white hover:bg-blue-50 border-blue-200 shadow-sm transition-all">
                        <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-blue-600`} />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-40 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500 opacity-70" />
                </div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden group hover:border-blue-300 transition-all duration-300">
                            <CardHeader className="pb-2 pt-6 px-6">
                                <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0">
                                <div className="text-2xl font-bold text-gray-900 leading-none font-sans">Rs {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wide">Overall Revenue</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden group hover:border-blue-300 transition-all duration-300">
                            <CardHeader className="pb-2 pt-6 px-6">
                                <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Recent Revenue</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0">
                                <div className="text-2xl font-bold text-gray-900 leading-none font-sans">Rs {stats.recentRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wide">Last 7 days</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-orange-200 shadow-lg shadow-orange-100 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl overflow-hidden group transition-all duration-300">
                            <CardHeader className="pb-2 pt-6 px-6">
                                <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-white/80">Pending Orders</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0">
                                <div className="text-2xl font-bold text-white leading-none font-sans">{stats.pendingOrders}</div>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <p className="text-[10px] text-white/90 font-medium uppercase tracking-wide">Awaiting Processing</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden group hover:border-blue-300 transition-all duration-300">
                            <CardHeader className="pb-2 pt-6 px-6">
                                <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Total Products</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0">
                                <div className="text-2xl font-bold text-gray-900 leading-none font-sans">{stats.totalProducts}</div>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wide">Active: {stats.activeItems}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
                        <Tabs defaultValue="orders" className="w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                                <TabsList className="bg-gray-100 p-1 rounded-lg h-10">
                                    <TabsTrigger value="orders" className="rounded-md px-5 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-colors">
                                        Orders
                                    </TabsTrigger>
                                    <TabsTrigger value="management" className="rounded-md px-5 font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-colors">
                                        Order Management
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="rounded-lg h-9 px-5 font-semibold text-sm border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                        Export Record
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6">
                                <TabsContent value="orders" className="mt-0 ring-0 outline-none">
                                    <AdminOrders onUpdate={loadStats} />
                                </TabsContent>

                                <TabsContent value="management" className="mt-0 ring-0 outline-none">
                                    <div className="space-y-4">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</TableHead>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</TableHead>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</TableHead>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
                                                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {orders.map((order) => (
                                                        <tr key={order._id} className="hover:bg-gray-50">
                                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderNumber}</TableCell>
                                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user?.name || "Unknown"}</TableCell>
                                                            <TableCell className="px-6 py-4 text-sm text-gray-500">
                                                                <div className="space-y-1">
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="flex items-center gap-2">
                                                                            <span>{item.product?.name || "Custom Product"} x{item.quantity}</span>
                                                                            {item.customization?.designImage && (
                                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Design</span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rs {order.totalAmount.toFixed(2)}</TableCell>
                                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                                <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                        order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {order.status.toUpperCase()}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                                    className="rounded-lg border-gray-300 hover:bg-gray-100 text-xs h-8 mr-2"
                                                                >
                                                                    View
                                                                </Button>
                                                                <Select
                                                                    value={order.status}
                                                                    onValueChange={(value) => updateOrderStatus(order._id, value)}
                                                                >
                                                                    <SelectTrigger className="w-24 h-8 text-xs border-gray-300">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="pending">Pending</SelectItem>
                                                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                                                        <SelectItem value="processing">Processing</SelectItem>
                                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {expandedOrder && (
                                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Order Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-medium text-gray-700 text-xs mb-1">Shipping Address</h5>
                                                        <p className="text-xs text-gray-600">{orders.find(o => o._id === expandedOrder)?.shippingAddress.name}</p>
                                                        <p className="text-xs text-gray-600">{orders.find(o => o._id === expandedOrder)?.shippingAddress.street}</p>
                                                        <p className="text-xs text-gray-600">{orders.find(o => o._id === expandedOrder)?.shippingAddress.city}, {orders.find(o => o._id === expandedOrder)?.shippingAddress.state} {orders.find(o => o._id === expandedOrder)?.shippingAddress.zipCode}</p>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-gray-700 text-xs mb-1">Contact</h5>
                                                        <p className="text-xs text-gray-600">Phone: {orders.find(o => o._id === expandedOrder)?.shippingAddress.phone}</p>
                                                        <p className="text-xs text-gray-600">Email: {orders.find(o => o._id === expandedOrder)?.user?.email || "N/A"}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <h5 className="font-medium text-gray-700 text-xs mb-2">Items</h5>
                                                    <div className="space-y-2">
                                                        {orders.find(o => o._id === expandedOrder)?.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border">
                                                                <div>
                                                                    <p className="text-xs font-medium">{item.product?.name || "Custom Product"}</p>
                                                                    <p className="text-xs text-gray-600">Qty: {item.quantity} | Price: Rs {(item.price * item.quantity).toFixed(2)}</p>
                                                                </div>
                                                                {item.customization?.designImage && (
                                                                    <div className="w-12 h-12 relative rounded overflow-hidden border border-gray-200">
                                                                        <img
                                                                            src={item.customization.designImage}
                                                                            alt="Design Preview"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </>
            )}
        </div>
    )
}
