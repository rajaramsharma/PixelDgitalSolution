import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/lib/authContext"
import { Mail, Loader2, Shield } from "lucide-react"

export default function VerifyOTPPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const email = searchParams.get("email")

    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    useEffect(() => {
        if (!email) {
            navigate("/register")
        }
    }, [email, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP")
            return
        }

        setLoading(true)

        try {
            const response = await apiRequest("/api/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({ email, otp }),
            })

            login(response.token, response.user)
            navigate("/")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setError("")
        setResending(true)

        try {
            await apiRequest("/api/auth/resend-otp", {
                method: "POST",
                body: JSON.stringify({ email }),
            })

            alert("OTP resent successfully! Please check your email.")
        } catch (err) {
            setError(err.message)
        } finally {
            setResending(false)
        }
    }

    if (!email) return null

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <Card className="w-full max-w-md border-0 shadow-2xl bg-gray-900 text-white">
                <CardHeader className="space-y-3 text-center border-b border-gray-700">
                    <div className="flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-bold">
                        Verify Your Email
                    </CardTitle>

                    <CardDescription className="text-gray-400">
                        We’ve sent a secure 6-digit code to
                        <br />
                        <span className="font-semibold text-gray-200">{email}</span>
                    </CardDescription>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        Secure Verification
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-gray-300">
                                Enter OTP
                            </Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="••••••"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                    setError("")
                                }}
                                className="h-12 text-center text-2xl tracking-widest bg-gray-800 border-gray-700 text-white focus:border-primary"
                                maxLength={6}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 gap-2 bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Email Securely"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400 mb-2">
                            Didn’t receive the code?
                        </p>
                        <Button
                            variant="link"
                            onClick={handleResendOTP}
                            disabled={resending}
                            className="text-primary"
                        >
                            {resending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                "Resend OTP"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
