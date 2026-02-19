import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/lib/authContext"
import { apiRequest } from "@/lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Loader2,
  User,
  Package,
  ShoppingBag,
  Edit2,
  Save,
  X,
} from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    loadDashboardData()
    updateCartCount()
  }, [isAuthenticated])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      if (user) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        })
      }

      const ordersData = await apiRequest("/api/orders")
      setRecentOrders(ordersData?.orders?.slice(0, 3) || [])
    } catch (error) {
      console.error("Failed to load dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)
  }

  // ✅ REAL PROFILE SAVE
  const handleSaveProfile = async () => {
    try {
      await apiRequest("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
        }),
      })

      alert("Profile updated successfully!")
      setEditMode(false)
      loadDashboardData()
    } catch (error) {
      alert("Failed to update profile")
    }
  }

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl text-blue-900 font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your profile and track your orders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROFILE */}
            <Card className="bg-white border border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>

                  {!editMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMode(false)}
                        className="border-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-6">

                <div>
                  <Label className="text-gray-700">Full Name</Label>
                  {editMode ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.name || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700">Email</Label>
                  <p className="text-gray-900">{profileData.email}</p>
                </div>

                <div>
                  <Label className="text-gray-700">Phone</Label>
                  {editMode ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.phone || "Not set"}
                    </p>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* RECENT ORDERS */}
            <Card className="bg-white border border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Package className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                  <Link to="/orders">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                    <p className="text-gray-600">No orders yet</p>
                    <Link to="/products">
                      <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order._id} className="border border-blue-100 p-4 rounded mb-3 bg-blue-50">
                      <div className="flex justify-between">
                        <span className="text-gray-800">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-blue-700 font-semibold">
                          ₹{order.totalAmount?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            <Card className="bg-white border border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 p-6">
                <Link to="/products">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Products
                  </Button>
                </Link>

                <Link to="/cart">
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                    View Cart ({cartCount})
                  </Button>
                </Link>

                <Link to="/orders">
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                    My Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-900">
                  Account
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Member since</p>
                <p className="font-medium text-gray-900">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>

                <Button
                  variant="destructive"
                  className="w-full mt-6"
                  onClick={logout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}