import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { apiRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  /* ===============================
     LOAD DATA (ONCE)
  =============================== */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load categories
        const catData = await apiRequest("/api/categories")
        const categoryList = Array.isArray(catData)
          ? catData
          : catData.categories || []
        setCategories(categoryList)

        // Load ALL products once
        const prodData = await apiRequest("/api/products")
        const productList = Array.isArray(prodData)
          ? prodData
          : prodData.products || []

        setAllProducts(productList)
        setProducts(productList)

      } catch (error) {
        console.error("Load error:", error)
        setCategories([])
        setProducts([])
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /* ===============================
     CATEGORY FILTER (FRONTEND SAFE)
  =============================== */
  useEffect(() => {
    if (selectedCategory === "all") {
      setProducts(allProducts)
    } else {
      const filtered = allProducts.filter((product) => {
        // Case 1: category stored as populated object
        if (typeof product.category === "object") {
          return product.category?.slug === selectedCategory
        }

        // Case 2: category stored as string
        return product.category === selectedCategory
      })

      setProducts(filtered)
    }
  }, [selectedCategory, allProducts])

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl text-blue-900 font-bold mb-2">
            Our Products
          </h1>
          <p className="text-blue-700">
            Choose from our wide range of customizable products
          </p>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={
              selectedCategory === "all"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
            }
          >
            All Products
          </Button>

          {categories.map((category) => (
            <Button
              key={category._id}
              variant={
                selectedCategory === category.slug ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category.slug)}
              className={
                selectedCategory === category.slug
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-blue-700">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
