import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/authContext"
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
    const navigate = useNavigate()
    const { login, user, loading: authLoading } = useAuth()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Redirect if already logged in as admin
    useEffect(() => {
        if (user && user.role === "admin") {
            navigate("/admin")
        }
    }, [user, navigate])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError("")
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await apiRequest("/api/auth/admin-login", {
                method: "POST",
                body: JSON.stringify(formData),
            })

            if (response.user.role !== "admin") {
                setError("Access denied. These credentials are not for an administrator.")
                setLoading(false)
                return
            }

            login(response.token, response.user)
            navigate("/admin")
        } catch (err) {
            setError(err.message || "Invalid administrative credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
            <Card className="w-full max-w-md border-t-4 border-t-blue-600 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Admin Portal</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                        Secure access for Pixel Digital Solution administrators
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-600 tracking-wider">Administrator Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@pixeldigital.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 h-11 bg-white border-slate-200 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-600 tracking-wider">Security Token / Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 pr-10 h-11 bg-white border-slate-200 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200" disabled={loading}>
                            {loading ? "Verifying Authority..." : "Access Control Panel"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center justify-center gap-2 group transition-colors">
                            <span className="opacity-70 group-hover:opacity-100 transition-opacity">←</span>
                            Return to Public Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
