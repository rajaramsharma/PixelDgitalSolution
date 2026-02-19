import { Link } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }) {
  const isCustomizable = product.category !== "id-card"

  const handleOrderNow = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    cart.push({
      productId: product._id,
      product,
      quantity: 1,
      price: product.basePrice,
      images: product.images // Ensure images are saved
    })
    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
    alert(`${product.name} added to cart!`)
  }

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
      {/* IMAGE */}
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* BACK IMAGE */}
          {product.images?.back && (
            <img
              src={product.images.back}
              alt={`${product.name} back`}
              className="
                absolute inset-0 w-full h-full
                object-contain
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
                z-10
              "
            />
          )}

          {/* FRONT IMAGE */}
          {product.images?.front ? (
            <img
              src={product.images.front}
              alt={product.name}
              className="
                absolute inset-0 w-full h-full
                object-contain
                opacity-100
                transition-opacity duration-300
                group-hover:opacity-0
                z-20
              "
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </CardHeader>

      {/* INFO */}
      <CardContent className="p-4 text-black">
        <CardTitle className="mb-1 line-clamp-1">
          {product.name}
        </CardTitle>

        <p className="text-sm text-muted-foreground text-black line-clamp-2 mb-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-black text-primary">
            ${product.basePrice.toFixed(2)}
          </span>
          <span className="text-xs capitalize text-muted-foreground text-black">
            {product.category.replace("-", " ")}
          </span>
        </div>
      </CardContent>

      {/* ACTION */}
      <CardFooter className="p-4 pt-0 ">
        {isCustomizable ? (
          <Link to={`/products/${product._id}`} className="w-full">
            <Button className="w-full bg-green-500">Customize & Order</Button>
          </Link>
        ) : (
          <Button className="w-full" onClick={handleOrderNow}>
            Order Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
