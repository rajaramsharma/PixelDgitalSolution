import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-white text-blue-800 pb-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Pixel Digital Solution</h3>
                        <p className="text-blue-400 mb-4">Creating custom products with premium quality and fast delivery.</p>
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">f</div>
                            <div className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center">t</div>
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">i</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Products</h4>
                        <ul className="space-y-2 text-blue-500">
                            <li><Link to="/products?category=t-shirt" className="hover:text-blue-800">T-Shirts</Link></li>
                            <li><Link to="/products?category=hoodie" className="hover:text-blue-800">Hoodies</Link></li>
                            <li><Link to="/products?category=id-card" className="hover:text-blue-800">ID Cards</Link></li>
                            <li><Link to="/products?category=cup" className="hover:text-blue-800">Cups</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-blue-500">
                            <li><Link to="#" className="hover:text-blue-800">About Us</Link></li>
                            <li><Link to="#" className="hover:text-blue-800">Contact</Link></li>
                            <li><Link to="#" className="hover:text-blue-800">FAQ</Link></li>
                            <li><Link to="#" className="hover:text-blue-800">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-blue-500">
                            <li><Link to="#" className="hover:text-blue-800">Terms of Service</Link></li>
                            <li><Link to="#" className="hover:text-blue-800">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-blue-800">Return Policy</Link></li>
                            <li><Link to="#" className="hover:text-blue-800">Shipping Info</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-blue-200 mt-8 pt-20 text-center text-blue-400">
                    <p>© {new Date().getFullYear()} Pixel Digital Solution. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
