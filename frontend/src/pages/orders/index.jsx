import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/authContext"
import { apiRequest } from "@/lib/api"
import { Loader2, Package, X } from "lucide-react"

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-700 border-blue-300",
    processing: "bg-purple-100 text-purple-700 border-purple-300",
    shipped: "bg-cyan-100 text-cyan-700 border-cyan-300",
    delivered: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
}

export default function OrdersPage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalImage, setModalImage] = useState("")

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login")
            return
        }
        if (isAuthenticated) {
            loadOrders()
        }
    }, [isAuthenticated, navigate])

    const loadOrders = async () => {
        try {
            const data = await apiRequest("/api/orders")
            setOrders(data.orders || [])
        } catch (error) {
            console.error("Failed to load orders:", error)
        } finally {
            setLoading(false)
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
            <div className="flex items-center justify-center py-20 min-h-[60vh] bg-gradient-to-b from-blue-50 to-white">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 pb-20">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-8">
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <Card className="bg-white border border-blue-100 shadow-md">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Package className="h-16 w-16 text-blue-400 mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-gray-900">
                                No orders yet
                            </h2>
                            <p className="text-gray-600">
                                Start shopping to see your orders here
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card
                                key={order._id}
                                className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <CardContent className="p-5">

                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b border-blue-100 pb-4">
                                        <div>
                                            <h3 className="font-semibold text-base text-blue-900 mb-1">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <p className="text-xs text-gray-600">
                                                Placed on {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <Badge
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusColors[order.status]}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-lg font-bold text-blue-700">
                                                ₹{order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3 mb-4">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4 items-start bg-blue-50 p-3 rounded-lg border border-blue-100"
                                            >

                                                {/* Images */}
                                                <div className="flex gap-2 shrink-0">
                                                    {item.product?.images?.front && (
                                                        <div
                                                            onClick={() => openModal(item.product.images.front)}
                                                            className="w-14 h-14 rounded-md overflow-hidden border border-blue-200 bg-white hover:scale-105 transition-transform cursor-pointer"
                                                        >
                                                            <img
                                                                src={item.product.images.front}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    )}

                                                    {item.customization?.designImage && (
                                                        <div
                                                            onClick={() => openModal(item.customization.designImage)}
                                                            className="w-14 h-14 rounded-md overflow-hidden border border-blue-300 bg-white hover:scale-105 transition-transform cursor-pointer relative"
                                                        >
                                                            <img
                                                                src={item.customization.designImage}
                                                                alt="Custom Design"
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[8px] text-center font-bold py-0.5">
                                                                DESIGN
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900 truncate pr-2">
                                                                {item.product?.name || "Product"}
                                                            </p>
                                                            <p className="text-xs text-gray-600 mt-0.5">
                                                                Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <span className="font-semibold text-sm text-blue-700">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {item.customization && (
                                                        <div className="mt-2 text-xs text-gray-600 space-y-1 bg-white p-2 rounded border border-blue-100">
                                                            {item.customization.texts?.length > 0 &&
                                                                item.customization.texts.map((t, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-[10px] text-blue-800 mr-1"
                                                                    >
                                                                        "{t.text}" ({t.color})
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-xs text-right text-gray-500">
                                        Total includes tax and shipping
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div className="relative max-w-3xl w-full mx-4">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <img
                            src={modalImage}
                            alt="Product View"
                            className="object-contain rounded-lg max-h-[80vh] w-auto mx-auto bg-white p-4"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}