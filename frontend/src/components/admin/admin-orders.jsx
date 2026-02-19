import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  shipped: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function AdminOrders({ onUpdate }) {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("recent")
  const [displayLimit, setDisplayLimit] = useState(3) // Default to showing 3 orders

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    // Apply filters when orders change or filters change
    applyFilters()
  }, [orders, statusFilter, dateFilter, displayLimit])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await apiRequest("/api/orders")
      setOrders(data.orders)
    } catch (error) {
      console.error("[v0] Failed to load orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Apply date filter
    const now = new Date()
    if (dateFilter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(order => new Date(order.createdAt) >= today)
    } else if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo)
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo)
    } else if (dateFilter === "recent") {
      // Show last 7 days by default
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo)
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Apply display limit
    const limitedOrders = filtered.slice(0, displayLimit)

    setFilteredOrders(limitedOrders)
  }

  const showMoreOrders = () => {
    setDisplayLimit(prev => prev + 5) // Show 5 more orders
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiRequest(`/api/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
      await loadOrders() // Reload to get updated data
      if (onUpdate) onUpdate()
      alert("Order status updated successfully!")
    } catch (error) {
      alert(error.message || "Failed to update order status")
    }
  }

  const openModal = (img) => {
    setModalImage(img)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalImage("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Recent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Last 7 Days</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="rounded-lg shadow-md border border-gray-200">
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-base">No orders found matching your filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredOrders.map((order) => (
            <Card key={order._id} className="rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-100 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900 mb-1">Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Customer: {order.user?.name || "Unknown"} ({order.user?.email || "N/A"})
                    </p>
                    <p className="text-xs text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[order.status]}`}>{order.status.toUpperCase()}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="rounded-lg border-gray-300 hover:bg-gray-100 text-xs h-8"
                    >
                      {expandedOrder === order._id ? "Hide Details" : "Show Details"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedOrder === order._id && (
                <CardContent className="space-y-4 p-5">
                  {/* Items with images */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex-1 flex items-center gap-4">
                            {/* Images */}
                            <div className="flex gap-2">
                              {/* Custom Design Image */}
                              {item.customization?.designImage && (
                                <div
                                  onClick={() => openModal(item.customization.designImage)}
                                  className="w-16 h-16 relative rounded-lg overflow-hidden border-2 border-blue-500 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                  title="Custom Design Preview"
                                >
                                  <div className="absolute inset-0 bg-gray-100/50 z-0" />
                                  <img
                                    src={item.customization.designImage}
                                    alt="Custom Design"
                                    className="absolute inset-0 w-full h-full object-contain z-10"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[9px] text-center py-0.5 z-20">
                                    FRONT
                                  </div>
                                </div>
                              )}

                              {/* Custom Back Design Image */}
                              {item.customization?.backDesignImage && (
                                <div
                                  onClick={() => openModal(item.customization.backDesignImage)}
                                  className="w-16 h-16 relative rounded-lg overflow-hidden border-2 border-purple-500 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                  title="Custom Back Design Preview"
                                >
                                  <div className="absolute inset-0 bg-gray-100/50 z-0" />
                                  <img
                                    src={item.customization.backDesignImage}
                                    alt="Custom Back Design"
                                    className="absolute inset-0 w-full h-full object-contain z-10"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-purple-500 text-white text-[9px] text-center py-0.5 z-20">
                                    BACK
                                  </div>
                                </div>
                              )}

                              {item.product?.images?.front && (
                                <div
                                  onClick={() => openModal(item.product.images.front)}
                                  className="w-14 h-14 relative rounded-lg overflow-hidden border border-gray-200 hover:scale-105 transition-transform cursor-pointer shadow-sm bg-white"
                                >
                                  <img
                                    src={item.product.images.front}
                                    alt={item.product.name + " front"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {item.product?.images?.back && (
                                <div
                                  onClick={() => openModal(item.product.images.back)}
                                  className="w-14 h-14 relative rounded-lg overflow-hidden border border-gray-200 hover:scale-105 transition-transform cursor-pointer shadow-sm bg-white"
                                >
                                  <img
                                    src={item.product.images.back}
                                    alt={item.product.name + " back"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.product?.name || "Product"}</p>
                              <p className="text-gray-600 text-xs">Quantity: {item.quantity}</p>
                              {item.customization && (
                                <div className="text-xs text-gray-500 mt-1 space-y-2">
                                  {/* Front Customization Details */}
                                  <div className="border-l-2 border-blue-200 pl-2">
                                    <p className="font-semibold text-xs text-blue-700 mb-1">Front View Details</p>

                                    {/* Texts */}
                                    {item.customization.texts && item.customization.texts.length > 0 ? (
                                      <div className="mb-1">
                                        <p className="font-semibold mb-1 text-[10px] text-gray-400">Texts:</p>
                                        <div className="space-y-1">
                                          {item.customization.texts.map((t, i) => (
                                            <div key={i} className="flex flex-col">
                                              <p>
                                                <span className="font-medium">"{t.text}"</span>
                                                <span className="text-[9px] ml-2">({t.font}, {t.color})</span>
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : item.customization.text && (
                                      <p><strong>Text:</strong> {item.customization.text}</p>
                                    )}

                                    {/* Logo */}
                                    {item.customization.logo && (
                                      <div className="mt-1">
                                        <p className="mb-1 text-[10px] text-gray-400"><strong>Logo:</strong></p>
                                        <div className="relative w-8 h-8 border rounded bg-white overflow-hidden cursor-pointer" onClick={() => openModal(item.customization.logo.preview || item.customization.logo)}>
                                          <img
                                            src={item.customization.logo.preview || item.customization.logo}
                                            alt="Front Logo"
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Back Customization Details */}
                                  {(item.customization.backTexts?.length > 0 || item.customization.backLogo) && (
                                    <div className="border-l-2 border-purple-200 pl-2 mt-2">
                                      <p className="font-semibold text-xs text-purple-700 mb-1">Back View Details</p>

                                      {/* Back Texts */}
                                      {item.customization.backTexts?.length > 0 && (
                                        <div className="mb-1">
                                          <p className="font-semibold mb-1 text-[10px] text-gray-400">Texts:</p>
                                          <div className="space-y-1">
                                            {item.customization.backTexts.map((t, i) => (
                                              <div key={i} className="flex flex-col">
                                                <p>
                                                  <span className="font-medium">"{t.text}"</span>
                                                  <span className="text-[9px] ml-2">({t.font}, {t.color})</span>
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Back Logo */}
                                      {item.customization.backLogo && (
                                        <div className="mt-1">
                                          <p className="mb-1 text-[10px] text-gray-400"><strong>Logo:</strong></p>
                                          <div className="relative w-8 h-8 border rounded bg-white overflow-hidden cursor-pointer" onClick={() => openModal(item.customization.backLogo.preview || item.customization.backLogo)}>
                                            <img
                                              src={item.customization.backLogo.preview || item.customization.backLogo}
                                              alt="Back Logo"
                                              className="w-full h-full object-contain"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Rs {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Shipping Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-xs border border-gray-100">
                      <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                      <p className="text-gray-700">{order.shippingAddress.phone}</p>
                      <p className="text-gray-700">{order.shippingAddress.street}</p>
                      <p className="text-gray-700">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-700">{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Order Notes</h4>
                      <p className="text-xs bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Update Status & Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm">Update Status</h4>
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order._id, value)}>
                        <SelectTrigger className="w-full sm:w-[180px] rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8">
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
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-blue-600">Rs {order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Show More Button */}
          {filteredOrders.length === displayLimit && orders.length > displayLimit && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={showMoreOrders}
                className="rounded-lg h-9 px-4 text-sm"
              >
                Show More Orders
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-3xl w-full mx-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt="Product Full View"
              className="object-contain rounded-lg max-h-[90vh] w-auto mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
