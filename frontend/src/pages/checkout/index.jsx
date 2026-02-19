import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/authContext"
import { apiRequest } from "@/lib/api"
import {
  Loader2,
  CheckCircle2,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Sparkles
} from "lucide-react"


export default function CheckoutPage() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [orderNumber, setOrderNumber] = useState("")

    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    })

    const [notes, setNotes] = useState("")

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login")
            return
        }

        const cartData = JSON.parse(localStorage.getItem("cart") || "[]")
        if (cartData.length === 0) {
            navigate("/cart")
            return
        }

        setCart(cartData)

        if (user) {
            setShippingAddress((prev) => ({
                ...prev,
                name: user.name || "",
                phone: user.phone || "",
            }))
        }
    }, [isAuthenticated, user, navigate])

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const handleInputChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        })
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()

        if (cart.length === 0) {
            alert("Your cart is empty")
            return
        }

        setLoading(true)

        try {
            const orderData = {
                items: cart.map((item) => ({
                    product: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    customization: item.customization,
                })),
                totalAmount: calculateTotal(),
                shippingAddress,
                paymentMethod: "cod",
                notes,
            }

            const response = await apiRequest("/api/orders", {
                method: "POST",
                body: JSON.stringify(orderData),
            })

            console.log("Order API Response:", response); // Debug log

            // Handle different possible response formats
            let orderNum;
            if (response.orderNumber) {
                orderNum = response.orderNumber;
            } else if (response.order && response.order.orderNumber) {
                orderNum = response.order.orderNumber;
            } else if (response.data && response.data.orderNumber) {
                orderNum = response.data.orderNumber;
            } else {
                orderNum = "ORD-" + Date.now(); // Fallback order number
                console.warn("Order number not found in expected response format. Using fallback:", orderNum);
            }

            console.log("Setting order number:", orderNum); // Debug log
            setOrderNumber(orderNum);
            setOrderPlaced(true)
            localStorage.removeItem("cart")
            window.dispatchEvent(new Event("cart-updated"))
        } catch (error) {
            alert(error.message || "Failed to place order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Waiting for authentication
    if (isAuthenticated === null) return null

    if (!isAuthenticated && !loading) return null // Will redirect in useEffect

if (orderPlaced) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="border-b border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                Order Confirmed
              </h1>
              <p className="text-gray-600">
                Your order has been placed successfully
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg bg-white border border-blue-100">
            <CardContent className="flex flex-col items-center text-center py-12">

              <div className="p-6 rounded-full bg-green-100 mb-8">
                <CheckCircle2 className="h-20 w-20 text-green-600" />
              </div>

              <h2 className="text-4xl font-bold text-blue-900 mb-4">
                Thank You!
              </h2>

              <p className="text-gray-600 mb-8 max-w-md">
                We’ve received your order and started processing it.
              </p>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">ORDER NUMBER</p>
                <p className="text-3xl font-bold text-blue-700">
                  {orderNumber}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                  onClick={() => navigate("/orders")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Orders
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/products")}
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Continue Shopping
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



return (
<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">

{/* Header */}
<div className="border-b border-blue-100 bg-white">
  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-full">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Secure Checkout
          </h1>
          <p className="text-gray-600">
            Complete your order with confidence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Shield className="h-4 w-4 text-green-600" />
          Secure Payment
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Truck className="h-4 w-4 text-blue-600" />
          Fast Delivery
        </div>
      </div>

    </div>
  </div>
</div>

            <div className="container mx-auto px-4 py-8">
                <form onSubmit={handlePlaceOrder}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gray-800 border-b">
                                    <CardTitle className="flex items-center gap-2 text-gray-50">
                                        <User className="h-5 w-5" />
                                        Customer Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-black">
                                            <Label htmlFor="name" className="flex items-center gap-2 text-white">
                                                <User className="h-4 w-4 text-gray-500" />
                                                Full Name *
                                            </Label>
                                            <Input 
                                                id="name" 
                                                name="name" 
                                                value={shippingAddress.name} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="h-11"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="space-y-2 text-black">
                                            <Label htmlFor="phone" className="flex items-center gap-2 text-white">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={shippingAddress.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Address */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gray-800 border-b">
                                    <CardTitle className="flex items-center gap-2 text-gray-50">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2 text-black">
                                        <Label htmlFor="street" className="flex items-center gap-2 text-white">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            Street Address *
                                        </Label>
                                        <Input
                                            id="street"
                                            name="street"
                                            value={shippingAddress.street}
                                            onChange={handleInputChange}
                                            required
                                            className="h-11"
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-black">
                                            <Label htmlFor="city" className="flex items-center gap-2 text-white">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                City *
                                            </Label>
                                            <Input 
                                                id="city" 
                                                name="city" 
                                                value={shippingAddress.city} 
                                                onChange={handleInputChange} 
                                                required 
                                                className="h-11"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="space-y-2 text-black">
                                            <Label htmlFor="state" className="flex items-center gap-2 text-white">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                State/Province *
                                            </Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={shippingAddress.state}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-black">
                                            <Label htmlFor="zipCode" className="flex items-center gap-2 text-white">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                Zip Code *
                                            </Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                value={shippingAddress.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                                placeholder="12345"
                                            />
                                        </div>
                                        <div className="space-y-2 text-black">
                                            <Label htmlFor="country" className="flex items-center gap-2 text-white">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                Country *
                                            </Label>
                                            <Input
                                                id="country"
                                                name="country"
                                                value={shippingAddress.country}
                                                onChange={handleInputChange}
                                                required
                                                className="h-11"
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Notes */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gray-700 border-b">
                                    <CardTitle className="flex items-center gap-2 text-gray-50">
                                        <Mail className="h-5 w-5" />
                                        Additional Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 text-black">
                                    <Textarea
                                        placeholder="Any special delivery instructions, gift wrapping requests, or other notes..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        className="resize-none"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        We'll do our best to accommodate your requests
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-6">
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="bg-gray-700 text-white rounded-t-lg -mb-2">
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-50">Items in your order</h3>
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                {cart.map((item, index) => (
                                                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                                        {item.product.images?.front && (
                                                            <img
                                                                src={item.product.images.front}
                                                                alt={item.product.name}
                                                                className="w-12 h-12 object-cover rounded border"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                            </p>
                                                            {item.customization?.text && (
                                                                <p className="text-xs text-blue-600 mt-1 truncate">
                                                                    Text: {item.customization.text}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="font-semibold text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-base">
                                                <span className="text-gray-300">Subtotal</span>
                                                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-base">
                                                <span className="text-gray-300">Shipping</span>
                                                <span className="font-medium text-green-600">Free</span>
                                            </div>
                                            <div className="flex justify-between text-base">
                                                <span className="text-gray-300">Tax</span>
                                                <span className="text-gray-400">Calculated at checkout</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-xl font-bold text-gray-50">Total</span>
                                                <span className="text-2xl font-bold text-primary text-gray-50">${calculateTotal().toFixed(2)}</span>
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Shield className="h-5 w-5 text-blue-600" />
                                                    <span className="font-semibold text-blue-800">Payment Method</span>
                                                </div>
                                                <p className="text-blue-700 font-medium">Cash on Delivery (COD)</p>
                                                <p className="text-sm text-blue-600 mt-1">
                                                    Pay when your order is delivered
                                                </p>
                                            </div>

                                            <Button 
                                                type="submit" 
                                                className="w-full gap-2 bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 shadow-lg"
                                                size="lg" 
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Processing Order...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        Place Order Securely
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Trust Indicators */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border text-center shadow-sm">
                                        <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-gray-700">Secure</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border text-center shadow-sm">
                                        <Truck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-gray-700">Fast Delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
