import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/authContext"
import { Trash2, ShoppingBag, ArrowRight, X, Pencil, Package, Sparkles, Shield } from "lucide-react"

export default function CartPage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [cart, setCart] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)

    // Zoom Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalImage, setModalImage] = useState("")

    const openModal = (image) => {
        setModalImage(image)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalImage("")
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }
        loadCart()
    }, [isAuthenticated, navigate])

    const loadCart = () => {
        const cartData = JSON.parse(localStorage.getItem("cart") || "[]")
        setCart(cartData)
        calculateTotal(cartData)
    }

    const calculateTotal = (cartData) => {
        const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setTotalAmount(total)
    }

    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index)
        setCart(updatedCart)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        window.dispatchEvent(new Event("cart-updated"))
        calculateTotal(updatedCart)
    }

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return
        const updatedCart = [...cart]
        updatedCart[index].quantity = newQuantity
        setCart(updatedCart)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        window.dispatchEvent(new Event("cart-updated"))
        calculateTotal(updatedCart)
    }

    const proceedToCheckout = () => {
        navigate("/checkout")
    }

    const editItem = (item, index) => {
        navigate(`/products/${item.productId}?editIndex=${index}`)
    }

    if (!isAuthenticated) return null

    return (
        <div className="min-h-screen bg-blue-50 pb-20">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-blue-900 mb-6">Shopping Cart ({cart.length} items)</h1>

                {cart.length === 0 ? (
                    <div className="max-w-md mx-auto mt-12">
                        <Card className="border-0 shadow-sm bg-white">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="p-4 bg-blue-50 rounded-full mb-4">
                                    <ShoppingBag className="h-10 w-10 text-blue-400" />
                                </div>
                                <h2 className="text-lg font-semibold mb-1 text-blue-900">Your cart is empty</h2>
                                <p className="text-sm text-blue-700 mb-6 text-center">
                                    Browse our products and find something you love.
                                </p>
                                <Button
                                    className="gap-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8"
                                    onClick={() => navigate("/products")}
                                >
                                    Start Shopping
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="flex-1 w-full space-y-4">
                            <Card className="border border-blue-200 shadow-sm overflow-hidden bg-white">
                                <div className="divide-y divide-blue-100">
                                    {cart.map((item, index) => (
                                        <div key={index} className="p-4 sm:p-5 hover:bg-blue-50/50 transition-colors rounded-lg">
                                            <div className="flex gap-4 sm:gap-6">
                                                {/* Product Image */}
                                                <div className="flex flex-col gap-2">
                                                    <div
                                                        className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white border border-blue-200 rounded-md overflow-hidden cursor-zoom-in relative group"
                                                        onClick={() => item.product.images?.front && openModal(item.product.images.front)}
                                                    >
                                                        {item.product.images?.front ? (
                                                            <img
                                                                src={item.product.images.front}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-blue-200">
                                                                <Package className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                        {item.customization?.designImage && (
                                                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                                                                <div className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                                    FRONT
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {item.product.images?.back && (
                                                        <div
                                                            className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white border border-blue-200 rounded-md overflow-hidden cursor-zoom-in relative group"
                                                            onClick={() => openModal(item.product.images.back)}
                                                        >
                                                            <img
                                                                src={item.product.images.back}
                                                                alt={`${item.product.name} Back`}
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                                                                <div className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                                    BACK
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h3 className="font-semibold text-blue-900 text-base leading-tight mb-1 truncate pr-4">
                                                                {item.product.name}
                                                            </h3>
                                                            <p className="text-xs text-blue-700 capitalize mb-2">{item.product.category?.replace('-', ' ')}</p>

                                                            {item.customization && (
                                                                <div className="flex flex-wrap gap-2 text-xs text-blue-800">
                                                                    {item.customization.texts?.length > 0 ? (
                                                                        item.customization.texts.map((t, i) => (
                                                                            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100">
                                                                                "{t.text}" <span className="text-[10px] text-blue-400 ml-1">({t.color})</span>
                                                                            </span>
                                                                        ))
                                                                    ) : item.customization.text && (
                                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100">
                                                                            "{item.customization.text}"
                                                                        </span>
                                                                    )}

                                                                    {item.customization.logo && (
                                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                                                            <Sparkles className="h-3 w-3" /> Logo
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <div className="font-bold text-blue-900 text-lg">
                                                                RS {(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                            {item.quantity > 1 && (
                                                                <div className="text-xs text-blue-600">
                                                                    RS {item.price.toFixed(2)} each
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center border border-blue-200 rounded-md h-8">
                                                                <button
                                                                    className="px-2.5 h-full hover:bg-blue-50 text-blue-400 disabled:opacity-50"
                                                                    onClick={() => updateQuantity(index, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-sm text-blue-900 font-medium">{item.quantity}</span>
                                                                <button
                                                                    className="px-2.5 h-full hover:bg-blue-50 text-blue-400"
                                                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => editItem(item, index)}
                                                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                                                            >
                                                                <Pencil className="h-3 w-3" /> Edit
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(index)}
                                                            className="text-xs text-red-500 hover:text-red-900 flex items-center gap-1 p-1"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-white border-t border-blue-100">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/products")}
                                        className="w-full sm:w-auto text-xs h-9 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    >
                                        <ArrowRight className="h-3 w-3 mr-2 rotate-180" /> Continue Shopping
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-80 shrink-0">
                            <div className="sticky top-6">
                                <Card className="border border-blue-200 shadow-sm bg-white">
                                    <CardHeader className="pb-3 border-b border-blue-100 bg-blue-50/50">
                                        <CardTitle className="text-base font-semibold text-blue-900">Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4 text-blue-900">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Subtotal</span>
                                                <span className="font-medium text-blue-900">RS {totalAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Shipping</span>
                                                <span className="text-green-600 font-medium">Free</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Tax</span>
                                                <span className="text-blue-500 italic">Calculated at checkout</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-blue-100">
                                            <div className="flex justify-between items-end mb-4">
                                                <span className="text-base font-semibold text-blue-700">Total</span>
                                                <span className="text-xl font-bold text-blue-900">RS {totalAmount.toFixed(2)}</span>
                                            </div>

                                            <Button
                                                className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                                size="lg"
                                                onClick={proceedToCheckout}
                                            >
                                                Checkout
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>

                                            <div className="mt-4 flex flex-col gap-2 text-[10px] text-blue-700 text-center">
                                                <p className="flex items-center justify-center gap-1">
                                                    <Shield className="h-3 w-3" /> Secure checkout powered by Stripe
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Zoom Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <img
                        src={modalImage}
                        alt="Zoomed Product"
                        className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
