import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/authContext"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      login(response.token, response.user)

      if (response.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 
      bg-gradient-to-br from-blue-50 via-white to-blue-100">

      <Card className="w-full max-w-md shadow-2xl border border-blue-100 
        rounded-2xl bg-white/90 backdrop-blur-md">

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-800">
            Welcome Back
          </CardTitle>

          <CardDescription className="text-center text-blue-500">
            Sign in to Pixel Digital Solution
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label className="text-blue-700 font-medium" htmlFor="email">
                Email
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 border-blue-200 focus:border-blue-500 
                    focus:ring-blue-500 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label className="text-blue-700 font-medium" htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 border-blue-200 focus:border-blue-500 
                    focus:ring-blue-500 rounded-xl"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-blue-400 hover:text-blue-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 
                px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 
                text-white rounded-xl shadow-md transition-all duration-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

          </form>

          {/* SIGN UP */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              to="/register"
              className="text-blue-700 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
