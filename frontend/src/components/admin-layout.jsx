import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingBag, ShoppingCart, Home, LogOut, Tag } from "lucide-react"
import { useAuth } from "@/lib/authContext"

export default function AdminLayout() {
    const { user, loading, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            navigate("/admin/login")
        }
    }, [user, loading, navigate])

    if (loading || !user || user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Inventory', icon: ShoppingBag, path: '/admin/inventory' },
        { name: 'Categories', icon: Tag, path: '/admin/categories' },
        { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    ]

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Admin Sidebar */}
            <aside className={`w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex flex-col fixed lg:sticky top-0 h-screen transition-all duration-300 z-50 overflow-hidden shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo Section */}
                <div className="px-6 py-6">
                    <Link to="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white border border-blue-300/30 shadow-lg group-hover:rotate-3 transition-all duration-500">
                            <span className="text-lg font-bold">P</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-bold tracking-tight text-white">PIXEL</span>
                            <span className="text-blue-200 text-[10px] font-semibold tracking-[0.15em] uppercase mt-0.5">ADMIN PANEL</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Section */}
                <nav className="flex-grow px-3 space-y-1 pt-4">
                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-blue-300 opacity-80 border-b border-blue-800/50">
                        Main Menu
                    </div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path
                        return (
                            <Link key={item.name} to={item.path}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 h-11 group hover:bg-white/10 transition-all rounded-lg border-none ${isActive ? 'text-white bg-blue-800/30' : 'text-blue-200'}`}
                                >
                                    <item.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                                    <span className={`font-medium text-sm tracking-tight ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                                    )}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Identity Section */}
                <div className="p-4">
                    <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-700/30 backdrop-blur-sm shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold border border-blue-500 text-sm shadow-inner">
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-900 flex items-center justify-center border-2 border-blue-900">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-semibold text-white truncate tracking-tight capitalize">{user?.name || 'Root Admin'}</p>
                                <p className="text-[9px] text-blue-300 font-medium uppercase mt-0.5">Administrator</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Link to="/">
                                <Button variant="secondary" className="w-full justify-start gap-2.5 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none rounded-lg transition-all font-medium text-xs uppercase tracking-wide shadow-md">
                                    <Home className="h-3.5 w-3.5" />
                                    <span>Public Site</span>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2.5 h-9 hover:bg-red-500/20 hover:text-red-300 text-red-200 transition-colors rounded-lg font-medium text-xs uppercase tracking-wide"
                                onClick={logout}
                            >
                                <LogOut className="h-3.5 w-3.5 opacity-70" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Workspace Area */}
            <div className="flex-grow flex flex-col min-w-0">
                <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex lg:hidden items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">P</div>
                        <span className="font-bold text-xl tracking-tight">PIXEL</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg border border-gray-300 shadow-sm h-10 w-10 bg-white hover:bg-gray-50 transition-all"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <LayoutDashboard className="h-5 w-5 text-gray-800" />
                    </Button>
                </header>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <main className="p-6 md:p-8 lg:p-12 bg-gray-50 min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
