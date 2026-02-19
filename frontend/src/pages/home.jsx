import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { apiRequest } from "@/lib/api"
import WhatsAppButton from "@/components/WhatsAppButton"
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    loadFeaturedProducts()
    updateCartCount()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const data = await apiRequest("/api/products?limit=6")
      setFeaturedProducts(data.products.slice(0, 6))
    } catch (error) {
      console.error("Failed to load products:", error)
    }
  }

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)
  }

  return (
    <div className="min-h-screen bg-blue-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100 to-white">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 backdrop-blur-sm border border-blue-200 mb-6">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">
                Premium Custom Products
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900 leading-tight">
              Transform Your Ideas Into{" "}
              <span className="text-blue-600">Custom Products</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-800/70 mb-10 max-w-2xl mx-auto">
              Create personalized ID cards, cups, t-shirts, hoodies, banners and more.
              Professional quality printing with your unique designs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                >
                  Browse Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link to="/products/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Create Custom Design
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: Sparkles,
              title: "Easy Customization",
              color: "blue",
              text: "Simple tools to add your text, images, and choose colors for any product",
            },
            {
              icon: Shield,
              title: "Quality Guaranteed",
              color: "green",
              text: "Premium materials and professional printing for long-lasting products",
            },
            {
              icon: Zap,
              title: "Fast Delivery",
              color: "purple",
              text: "Quick production and reliable delivery right to your door",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${item.color}-50 text-${item.color}-600 mb-6`}>
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="10K+" label="Happy Customers" color="blue" />
            <Stat value="50K+" label="Products Sold" color="green" />
            <Stat value="4.9★" label="Customer Rating" color="purple" />
            <Stat value="24/7" label="Support Available" color="orange" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Find the perfect products for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["T-Shirts", "Hoodies", "ID Cards", "Cups", "Banners", "Other"].map(
              (cat, idx) => (
                <Link
                  key={idx}
                  to={`/products?category=${cat.toLowerCase()}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="text-3xl mb-3">📦</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{cat}</h3>
                  <p className="text-sm text-gray-500">X products</p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl text-blue-900 font-bold mb-6">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ✅ WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  )
}

function Stat({ value, label, color }) {
  return (
    <div>
      <div className={`text-3xl md:text-4xl font-bold text-${color}-600 mb-2`}>
        {value}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  )
}
