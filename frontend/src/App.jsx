import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/footer'

// Pages
import HomePage from './pages/home'
import ProductsPage from './pages/products/index'
import ProductDetailPage from './pages/products/[id]'
import CartPage from './pages/cart/index'
import CheckoutPage from './pages/checkout/index'
import OrdersPage from './pages/orders/index'
import Dashboard from "./pages/dashboard"

import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import VerifyOTPPage from './pages/auth/verify-otp'


// Admin Pages
import AdminDashboard from './pages/admin/dashboard'
import AdminInventoryPage from './pages/admin/inventory'
import AdminCategoriesPage from './pages/admin/categories'
import AdminOrdersPage from './pages/admin/orders'
import AdminLoginPage from './pages/admin/login'

// Layouts
import AdminLayout from './components/admin-layout'

// Public Layout Component
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

        {/* Admin Login Route (dedicated page) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
