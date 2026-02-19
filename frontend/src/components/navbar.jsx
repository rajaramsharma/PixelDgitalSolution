import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/authContext"
import { ShoppingCart, Menu, X, User, LogOut, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const location = useLocation()
  const pathname = location.pathname
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const isActive = (path) => pathname === path

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
    }

    updateCount()
    window.addEventListener("storage", updateCount)
    window.addEventListener("cart-updated", updateCount)

    return () => {
      window.removeEventListener("storage", updateCount)
      window.removeEventListener("cart-updated", updateCount)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Pixel Digital Solution Logo"
              width={45}
              height={45}
              className="rounded-md"
            />
            <span className="font-bold text-lg text-blue-800">
              Pixel Digital Solution
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-blue-700" : "text-gray-600"
              } hover:text-blue-600`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`text-sm font-medium transition-colors ${
                isActive("/products") ? "text-blue-700" : "text-gray-600"
              } hover:text-blue-600`}
            >
              Products
            </Link>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center space-x-3">

            {/* CART */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
                <ShoppingCart className="h-5 w-5 text-blue-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                    <User className="h-5 w-5 text-blue-700" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-blue-100">

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-blue-700 hover:bg-blue-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-700 hover:bg-blue-600 text-white rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-blue-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-blue-100">

            <Link
              to="/"
              className="block text-sm font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/products"
              className="block text-sm font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/orders"
                  className="block text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>

                <button
                  onClick={logout}
                  className="block text-sm font-medium text-red-500 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="w-full text-blue-700">
                    Sign In
                  </Button>
                </Link>

                <Link to="/register">
                  <Button className="w-full bg-blue-700 text-white rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
