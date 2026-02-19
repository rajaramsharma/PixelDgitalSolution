import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/authContext"
import { apiRequest } from "@/lib/api"
import { ArrowLeft, Plus, Type, Palette, Image as ImageIcon, Loader2, Trash2, MousePointer2 } from "lucide-react"
import html2canvas from "html2canvas"

export default function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editIndex = searchParams.get("editIndex")
    const { isAuthenticated, user } = useAuth()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false) // For save/cart actions
    const [activeSide, setActiveSide] = useState("front")
    const previewRef = useRef(null)

    // Dragging state
    const isDragging = useRef(false)
    const dragTarget = useRef(null) // { type: 'text' | 'logo', id: null }

    // Design State - Refactored for Front/Back
    const [designs, setDesigns] = useState({
        front: {
            texts: [],
            selectedTextId: null,
            logo: null,
            logoPreview: null,
            logoSize: 30,
            logoPos: { x: 50, y: 50 },
        },
        back: {
            texts: [],
            selectedTextId: null,
            logo: null,
            logoPreview: null,
            logoSize: 30,
            logoPos: { x: 50, y: 50 },
        }
    })

    // Helper to get current design based on active side
    const currentDesign = designs[activeSide]

    // Fonts
    const fonts = [

        { name: "Arial", value: "Arial" },
        { name: "Verdana", value: "Verdana" },
        { name: "Times New Roman", value: "Times New Roman" },
        { name: "Courier New", value: "Courier New" },
        { name: "Georgia", value: "Georgia" },

        { name: "Roboto", value: "'Roboto', sans-serif" },
        { name: "Open Sans", value: "'Open Sans', sans-serif" },
        { name: "Montserrat", value: "'Montserrat', sans-serif" },
        { name: "Lato", value: "'Lato', sans-serif" },
        { name: "Poppins", value: "'Poppins', sans-serif" },
        { name: "Oswald", value: "'Oswald', sans-serif" },
        { name: "Raleway", value: "'Raleway', sans-serif" },
        { name: "Nunito", value: "'Nunito', sans-serif" },
        { name: "Ubuntu", value: "'Ubuntu', sans-serif" },
        { name: "Merriweather", value: "'Merriweather', serif" },

        { name: "Playfair Display", value: "'Playfair Display', serif" },
        { name: "PT Serif", value: "'PT Serif', serif" },
        { name: "Libre Baskerville", value: "'Libre Baskerville', serif" },
        { name: "Cinzel", value: "'Cinzel', serif" },
        { name: "Cormorant", value: "'Cormorant', serif" },

        { name: "Lobster", value: "'Lobster', cursive" },
        { name: "Dancing Script", value: "'Dancing Script', cursive" },
        { name: "Pacifico", value: "'Pacifico', cursive" },
        { name: "Great Vibes", value: "'Great Vibes', cursive" },
        { name: "Satisfy", value: "'Satisfy', cursive" },
        { name: "Righteous", value: "'Righteous', cursive" },
        { name: "Bangers", value: "'Bangers', cursive" },
        { name: "Anton", value: "'Anton', sans-serif" },
        { name: "Fredoka", value: "'Fredoka', sans-serif" },
        { name: "Quicksand", value: "'Quicksand', sans-serif" },

        { name: "Kanit", value: "'Kanit', sans-serif" },
        { name: "Mulish", value: "'Mulish', sans-serif" },
        { name: "Rubik", value: "'Rubik', sans-serif" },
        { name: "Work Sans", value: "'Work Sans', sans-serif" },
        { name: "Cabin", value: "'Cabin', sans-serif" },
        { name: "Barlow", value: "'Barlow', sans-serif" },
        { name: "Fira Sans", value: "'Fira Sans', sans-serif" },
        { name: "Exo", value: "'Exo', sans-serif" },
        { name: "Manrope", value: "'Manrope', sans-serif" },
        { name: "Inter", value: "'Inter', sans-serif" },

        { name: "DM Sans", value: "'DM Sans', sans-serif" },
        { name: "Heebo", value: "'Heebo', sans-serif" },
        { name: "Hind", value: "'Hind', sans-serif" },
        { name: "Josefin Sans", value: "'Josefin Sans', sans-serif" },
        { name: "Karla", value: "'Karla', sans-serif" },
        { name: "Mukta", value: "'Mukta', sans-serif" },
        { name: "Noto Sans", value: "'Noto Sans', sans-serif" },
        { name: "Overpass", value: "'Overpass', sans-serif" },
        { name: "Signika", value: "'Signika', sans-serif" },
        { name: "Titillium Web", value: "'Titillium Web', sans-serif" },

        { name: "Varela Round", value: "'Varela Round', sans-serif" },
        { name: "Zilla Slab", value: "'Zilla Slab', serif" },
        { name: "Arvo", value: "'Arvo', serif" },
        { name: "Bitter", value: "'Bitter', serif" },
        { name: "Crimson Text", value: "'Crimson Text', serif" },

        { name: "Abril Fatface", value: "'Abril Fatface', cursive" },
        { name: "Amatic SC", value: "'Amatic SC', cursive" },
        { name: "Architects Daughter", value: "'Architects Daughter', cursive" },
        { name: "Caveat", value: "'Caveat', cursive" },
        { name: "Cookie", value: "'Cookie', cursive" },

        { name: "Gloria Hallelujah", value: "'Gloria Hallelujah', cursive" },
        { name: "Indie Flower", value: "'Indie Flower', cursive" },
        { name: "Kaushan Script", value: "'Kaushan Script', cursive" },
        { name: "Marck Script", value: "'Marck Script', cursive" },
        { name: "Permanent Marker", value: "'Permanent Marker', cursive" },

        { name: "Press Start 2P", value: "'Press Start 2P', cursive" },
        { name: "Shadows Into Light", value: "'Shadows Into Light', cursive" },
        { name: "Yellowtail", value: "'Yellowtail', cursive" },

        { name: "Archivo", value: "'Archivo', sans-serif" },
        { name: "Asap", value: "'Asap', sans-serif" },
        { name: "Chivo", value: "'Chivo', sans-serif" },
        { name: "Commissioner", value: "'Commissioner', sans-serif" },
        { name: "Encode Sans", value: "'Encode Sans', sans-serif" },

        { name: "Kumbh Sans", value: "'Kumbh Sans', sans-serif" },
        { name: "Lexend", value: "'Lexend', sans-serif" },
        { name: "Outfit", value: "'Outfit', sans-serif" },
        { name: "Public Sans", value: "'Public Sans', sans-serif" },
        { name: "Red Hat Display", value: "'Red Hat Display', sans-serif" },

        { name: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
        { name: "Urbanist", value: "'Urbanist', sans-serif" },
        { name: "Assistant", value: "'Assistant', sans-serif" },
        { name: "Baloo 2", value: "'Baloo 2', cursive" },
        { name: "Comfortaa", value: "'Comfortaa', cursive" },

        { name: "Economica", value: "'Economica', sans-serif" },
        { name: "Gudea", value: "'Gudea', sans-serif" },
        { name: "Jost", value: "'Jost', sans-serif" },
        { name: "M PLUS Rounded 1c", value: "'M PLUS Rounded 1c', sans-serif" },
        { name: "Sen", value: "'Sen', sans-serif" },

        { name: "Teko", value: "'Teko', sans-serif" },
        { name: "Viga", value: "'Viga', sans-serif" },
        { name: "Yanone Kaffeesatz", value: "'Yanone Kaffeesatz', sans-serif" }


    ]

    useEffect(() => {
        loadProduct()
    }, [id])

    // Load design if editing
    useEffect(() => {
        if (editIndex !== null && product) {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]")
            const itemToEdit = cart[parseInt(editIndex)]
            if (itemToEdit && itemToEdit.productId === id) {
                const cust = itemToEdit.customization
                // Check if it's the new format or old format
                if (cust.designs) {
                    setDesigns(cust.designs)
                } else {
                    // Legacy support
                    setDesigns(prev => ({
                        ...prev,
                        front: {
                            texts: cust.layers || [],
                            selectedTextId: null,
                            logo: null,
                            logoPreview: cust.logo || null,
                            logoSize: cust.logoSize || 30,
                            logoPos: cust.logoPos || { x: 50, y: 50 },
                        }
                    }))
                }
            }
        }
    }, [editIndex, product, id])

    // Helper to get currently selected text object
    const selectedText = currentDesign.texts.find(t => t.id === currentDesign.selectedTextId)

    const loadProduct = async () => {
        try {
            const data = await apiRequest(`/api/products/${id}`)
            setProduct(data?.product || null)
        } catch (error) {
            console.error("Failed to load product:", error)
        } finally {
            setLoading(false)
        }
    }

    // --- State Updaters ---

    const updateDesign = (side, updates) => {
        setDesigns(prev => ({
            ...prev,
            [side]: { ...prev[side], ...updates }
        }))
    }

    // --- Text Management Functions ---

    const addTextLayer = () => {
        const newText = {
            id: Date.now(),
            content: "New Text",
            font: "Arial",
            color: "#000000",
            size: 24,
            rotation: 0,
            x: 50,
            y: 50
        }

        updateDesign(activeSide, {
            texts: [...currentDesign.texts, newText],
            selectedTextId: newText.id
        })
    }

    const updateSelectedText = (key, value) => {
        if (!currentDesign.selectedTextId) return

        updateDesign(activeSide, {
            texts: currentDesign.texts.map(t =>
                t.id === currentDesign.selectedTextId ? { ...t, [key]: value } : t
            )
        })
    }

    const removeSelectedText = () => {
        if (!currentDesign.selectedTextId) return

        updateDesign(activeSide, {
            texts: currentDesign.texts.filter(t => t.id !== currentDesign.selectedTextId),
            selectedTextId: null
        })
    }

    const setSelectedTextId = (id) => {
        updateDesign(activeSide, { selectedTextId: id })
    }

    // --- Logo Management ---

    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (ev) => {
                updateDesign(activeSide, {
                    logo: file,
                    logoPreview: ev.target.result
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // --- Drag & Drop Logic ---

    const handleMouseDown = (e, type, id = null) => {
        e.stopPropagation()
        e.preventDefault()
        isDragging.current = true
        dragTarget.current = { type, id }

        if (type === 'text' && id) {
            setSelectedTextId(id)
        }
    }

    const handleMouseMove = (e) => {
        if (!isDragging.current || !previewRef.current) return

        const rect = previewRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        const clampedX = Math.max(0, Math.min(100, x))
        const clampedY = Math.max(0, Math.min(100, y))

        if (dragTarget.current.type === 'text') {
            updateDesign(activeSide, {
                texts: currentDesign.texts.map(t =>
                    t.id === dragTarget.current.id
                        ? { ...t, x: clampedX, y: clampedY }
                        : t
                )
            })
        } else if (dragTarget.current.type === 'logo') {
            updateDesign(activeSide, {
                logoPos: { x: clampedX, y: clampedY }
            })
        }
    }

    const handleMouseUp = () => {
        isDragging.current = false
        dragTarget.current = null
    }

    // --- Price Calculation ---
    const calculateTotalPrice = () => {
        if (!product) return 0
        let price = product.basePrice
        // Add logic for extra costs: $5 per text layer, $10 for logo
        // Calculate for BOTH sides
        price += designs.front.texts.length * 5
        if (designs.front.logoPreview) price += 10

        price += designs.back.texts.length * 5
        if (designs.back.logoPreview) price += 10

        return price
    }

    // --- Helper to convert canvas to blob ---
    const getCanvasBlob = (canvas) => {
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob)
            }, 'image/png')
        })
    }

    // --- Capture Specific Side ---
    const captureSide = async (side) => {
        // We need to ensure the correct side is rendered before capturing
        // This is tricky if we are on 'front' and want to capture 'back'.
        // For simplicity, we might force a switch or assume the user has to be on the side to save it?
        // BETTER APPROACH: Render hidden divs for both sides? Or just capture current?
        // Given complexity, let's force the view to switch if capturing both, or just capture active for "Save Design".
        // For "Add to Cart", we ideally want both.

        // Strategy: We can only capture what is currently in the DOM.
        // We will switch the view programmatically, wait for render, then capture.

        // Check if we need to capture this side (only if it has customizations)
        const hasCustoms = designs[side].texts.length > 0 || designs[side].logoPreview;
        // Also capture if it's the front, as we always want a main image.
        if (side !== 'front' && !hasCustoms) return null;

        // Force switch and wait (avoids stale state issues)
        setActiveSide(side);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Clean selection
        updateDesign(side, { selectedTextId: null });
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!previewRef.current) return null;

        const canvas = await html2canvas(previewRef.current, {
            useCORS: true,
            backgroundColor: null,
            onclone: (clonedDoc) => {
                const allElements = clonedDoc.querySelectorAll('*')
                allElements.forEach(el => {
                    el.style.setProperty('border-color', 'transparent', 'important')
                    el.style.setProperty('outline-color', 'transparent', 'important')
                })
            }
        });

        return canvas;
    }

    // --- Helper to Upload ---
    const uploadDualDesign = async (frontCanvas, backCanvas, finalPrice) => {
        const formData = new FormData()

        // Front Image
        const frontBlob = await getCanvasBlob(frontCanvas);
        formData.append('designImage', frontBlob, `front-${Date.now()}.png`);

        // Back Image (if exists)
        if (backCanvas) {
            const backBlob = await getCanvasBlob(backCanvas);
            formData.append('backDesignImage', backBlob, `back-${Date.now()}.png`);
        }

        formData.append('product', product._id)
        formData.append('basePrice', product.basePrice)
        formData.append('finalPrice', finalPrice)

        // Append Data Payload
        const payload = {
            texts: designs.front.texts,
            backTexts: designs.back.texts,
            logo: designs.front.logoPreview ? {
                x: designs.front.logoPos.x,
                y: designs.front.logoPos.y,
                size: designs.front.logoSize
            } : null,
            backLogo: designs.back.logoPreview ? {
                x: designs.back.logoPos.x,
                y: designs.back.logoPos.y,
                size: designs.back.logoSize
            } : null,
        }

        formData.append('texts', JSON.stringify(payload.texts));
        formData.append('backTexts', JSON.stringify(payload.backTexts));
        formData.append('logo', JSON.stringify(payload.logo));
        formData.append('backLogo', JSON.stringify(payload.backLogo));

        if (user) {
            formData.append('user', user._id || user.id)
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${apiUrl}/api/customize`, {
            method: 'POST',
            body: formData,
        })

        if (!res.ok) {
            throw new Error('Failed to upload design')
        }

        return await res.json()
    }

    // --- Handlers ---

    const handleSaveDesigns = async () => {
        const initialSide = activeSide;
        try {
            setActionLoading(true);

            // 1. Capture Front
            const frontCanvas = await captureSide('front');
            if (frontCanvas) {
                const link = document.createElement('a');
                link.download = `design-${product.name}-front.jpg`;
                link.href = frontCanvas.toDataURL("image/jpeg");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Small delay between downloads
                await new Promise(r => setTimeout(r, 500));
            }

            // 2. Capture Back only if product has a back view
            if (product.images?.back) {
                const backCanvas = await captureSide('back');
                if (backCanvas) {
                    const link = document.createElement('a');
                    link.download = `design-${product.name}-back.jpg`;
                    link.href = backCanvas.toDataURL("image/jpeg");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }

            // Restore initial side if needed
            if (initialSide === 'front' && activeSide !== 'front') {
                setActiveSide('front');
            }

        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setActionLoading(false);
        }
    }

    const handleAddToCart = async () => {
        try {
            setActionLoading(true)

            // 1. Capture Front
            const frontCanvas = await captureSide('front');

            // 2. Capture Back (if customized or product has back image)
            // Even if not customized, if the product has a back view, we might want to capture it? 
            // For now, only if back image exists in product.
            let backCanvas = null;
            if (product.images?.back) {
                backCanvas = await captureSide('back');
            }

            // Restore view to front? Or stay where we ended?
            // Let's go back to front as default
            if (activeSide !== 'front') {
                setActiveSide('front');
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            const finalPrice = calculateTotalPrice()

            // 3. Upload
            let frontUrl = frontCanvas.toDataURL("image/png");
            let backUrl = backCanvas ? backCanvas.toDataURL("image/png") : null;
            let customizationId = null;

            try {
                const savedData = await uploadDualDesign(frontCanvas, backCanvas, finalPrice);

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                if (savedData.designImage) {
                    frontUrl = savedData.designImage.startsWith('http') ? savedData.designImage : `${apiUrl}${savedData.designImage}`;
                }
                if (savedData.backDesignImage) {
                    backUrl = savedData.backDesignImage.startsWith('http') ? savedData.backDesignImage : `${apiUrl}${savedData.backDesignImage}`;
                }
                customizationId = savedData._id;

            } catch (e) {
                console.warn("Upload failed, using base64 fallback", e);
            }

            // 4. Update Local Cart
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

            const cartItem = {
                productId: product._id,
                product: {
                    ...product,
                    images: {
                        ...product.images,
                        front: frontUrl,
                        back: backUrl || product.images.back, // Use custom back if exists, else keep original
                        originalFront: product.images.front
                    }
                },
                quantity: 1,
                price: finalPrice,
                customization: {
                    id: customizationId,
                    designs: designs, // Save full state
                    designImage: frontUrl, // Main front image
                    backDesignImage: backUrl, // Main back image

                    // Legacy/Compat fields for Admin/Checkout usage
                    texts: designs.front.texts,
                    logo: designs.front.logoPreview,
                    backTexts: designs.back.texts,
                    backLogo: designs.back.logoPreview,
                }
            };

            if (editIndex !== null) {
                cart[parseInt(editIndex)] = cartItem;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("cart-updated"));
            alert(editIndex !== null ? "Cart updated!" : "Added to cart!");
            navigate("/cart");

        } catch (error) {
            console.error("Add to cart failed:", error);
            alert("Failed to add to cart: " + error.message);
        } finally {
            setActionLoading(false);
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link to="/products"><Button>Back to Products</Button></Link>
            </div>
        )
    }

    return (
       <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-50 pb-20">

            <div className="container mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/products">
                            <Button variant="ghost" className="mb-2 pl-0 hover:pl-2 text-black">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-Black">{product.name}</h1>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleSaveDesigns} variant="outline" size="lg" disabled={actionLoading}>
                            {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Designs
                        </Button>
                        <Button onClick={handleAddToCart} size="lg" className="shadow-lg" disabled={actionLoading}>
                            {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            {editIndex !== null ? "Update Cart" : "Add to Cart"} - ${calculateTotalPrice().toFixed(2)}
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN - PREVIEW AREA */}
                    <div className="lg:col-span-7">
                        <Card className="shadow-md border-0 overflow-hidden sticky top-8">
                            <CardHeader className="bg-white-900 border-b pb-4">
                                <div className="flex justify-between items-center text-green-500">
                                    <CardTitle>Live Preview ({activeSide === 'front' ? 'Front' : 'Back'})</CardTitle>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant={activeSide === "front" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setActiveSide("front")}
                                        >
                                            Front
                                        </Button>
                                        <Button
                                            variant={activeSide === "back" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setActiveSide("back")}
                                            disabled={!product.images?.back}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0" style={{ backgroundColor: "#f3f4f6" }}>
                                <div
                                    ref={previewRef}
                                    className="relative aspect-square w-full flex items-center justify-center overflow-hidden"
                                    style={{ backgroundColor: "#e5e7eb" }}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onClick={() => setSelectedTextId(null)}
                                >
                                    {/* Base Product Image */}
                                    {product.images?.[activeSide] ? (
                                        <img
                                            src={product.images[activeSide]}
                                            alt={product.name}
                                            crossOrigin="anonymous"
                                            className="object-contain w-full h-full max-h-[600px] z-0 select-none pointer-events-none"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <ImageIcon className="h-24 w-24 mb-4" />
                                            <p>No Image Available</p>
                                        </div>
                                    )}

                                    {/* Overlays - Common for both sides, data driven by activeSide */}
                                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                        <div className="relative w-3/4 h-3/4 rounded flex items-center justify-center overflow-hidden" style={{ border: '2px dashed rgba(209, 213, 219, 0.5)' }}>

                                            {/* Text Layers */}
                                            {currentDesign.texts.map((textObj) => (
                                                <div
                                                    key={textObj.id}
                                                    className={`absolute z-20 text-center cursor-move select-none pointer-events-auto ${currentDesign.selectedTextId === textObj.id ? 'rounded px-2' : ''}`}
                                                    onMouseDown={(e) => handleMouseDown(e, 'text', textObj.id)}
                                                    style={{
                                                        fontFamily: textObj.font,
                                                        color: textObj.color,
                                                        fontSize: `${textObj.size}px`,
                                                        transform: `translate(-50%, -50%) rotate(${textObj.rotation || 0}deg)`,
                                                        top: `${textObj.y}%`,
                                                        left: `${textObj.x}%`,
                                                        textShadow: '0px 0px 2px rgba(255,255,255,0.5)',
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                        maxWidth: '80%',
                                                        lineHeight: '1.2',
                                                        border: currentDesign.selectedTextId === textObj.id ? '2px solid #3b82f6' : '2px solid transparent',
                                                        backgroundColor: currentDesign.selectedTextId === textObj.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                                                    }}
                                                >
                                                    {textObj.content}
                                                </div>
                                            ))}

                                            {/* Logo Overlay */}
                                            {currentDesign.logoPreview && (
                                                <div
                                                    className="absolute z-20 cursor-move select-none pointer-events-auto"
                                                    onMouseDown={(e) => handleMouseDown(e, 'logo')}
                                                    style={{
                                                        width: `${currentDesign.logoSize}%`,
                                                        top: `${currentDesign.logoPos.y}%`,
                                                        left: `${currentDesign.logoPos.x}%`,
                                                        transform: 'translate(-50%, -50%)',
                                                        border: '2px solid transparent',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    <img src={currentDesign.logoPreview} alt="Logo" className="w-full h-auto pointer-events-none" />
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN - CONTROLS */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-black flex items-center gap-2">
                                    <Palette className="h-5 w-5" /> Customize {activeSide === 'front' ? 'Front' : 'Back'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="text" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="text" className="gap-2">
                                            <Type className="h-4 w-4" /> Text
                                        </TabsTrigger>
                                        <TabsTrigger value="graphics" className="gap-2">
                                            <ImageIcon className="h-4 w-4" /> Graphics
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* TEXT TAB */}
                                    <TabsContent value="text" className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base text-black font-semibold">Text Layers</Label>
                                            <Button onClick={addTextLayer} size="sm" className="gap-1">
                                                <Plus className="h-3 w-3" /> Add Text
                                            </Button>
                                        </div>

                                        {currentDesign.texts.length > 0 && (
                                            <div className="space-y-2">
                                                {currentDesign.texts.map((t, idx) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setSelectedTextId(t.id)}
                                                        className={`w-full px-4 py-3 text-left rounded-lg border transition-all flex items-center justify-between group ${currentDesign.selectedTextId === t.id
                                                            ? 'bg-primary/10 border-primary shadow-sm'
                                                            : 'bg-white hover:bg-gray-50 border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-medium text-white mb-1">Layer {idx + 1}</div>
                                                            <div className="text-sm font-medium truncate text-white">{t.content || 'Empty text'}</div>
                                                        </div>
                                                        <div
                                                            className="w-6 h-6 rounded border-2 flex-shrink-0 ml-2"
                                                            style={{ backgroundColor: t.color, borderColor: t.color }}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {selectedText ? (
                                            <div className="space-y-5 bg-gray-50 p-5 rounded-lg border mt-4">
                                                <div className="flex justify-between items-center pb-3 border-b">
                                                    <Label className="text-sm font-semibold">Edit Layer</Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={removeSelectedText}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Label className="text-sm mb-2 block font-medium">Text Content</Label>
                                                    <textarea
                                                        placeholder="Enter your text..."
                                                        value={selectedText.content}
                                                        onChange={(e) => updateSelectedText('content', e.target.value)}
                                                        className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <Label className="text-sm mb-2 block font-medium">Font</Label>
                                                        <Select
                                                            value={selectedText.font}
                                                            onValueChange={(v) => updateSelectedText('font', v)}
                                                        >
                                                            <SelectTrigger className="bg-white h-9">
                                                                <SelectValue placeholder="Font" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white shadow-xl border-gray-200">
                                                                {fonts.map(f => (
                                                                    <SelectItem key={f.value} value={f.value} className="cursor-pointer hover:bg-gray-100">
                                                                        <span style={{ fontFamily: f.value }}>{f.name}</span>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm mb-2 block font-medium">Color</Label>
                                                        <Input
                                                            type="color"
                                                            value={selectedText.color}
                                                            onChange={(e) => updateSelectedText('color', e.target.value)}
                                                            className="w-full h-9 cursor-pointer bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm mb-2 block font-medium">Size</Label>
                                                        <Input
                                                            type="number"
                                                            min={12}
                                                            max={100}
                                                            value={selectedText.size}
                                                            onChange={(e) => updateSelectedText('size', parseInt(e.target.value) || 12)}
                                                            className="w-full h-9 text-sm font-semibold bg-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-2 pb-1">
                                                    <Slider
                                                        value={[selectedText.size]}
                                                        onValueChange={(v) => updateSelectedText('size', v[0])}
                                                        min={12}
                                                        max={100}
                                                        step={1}
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="mt-4 border-t pt-4">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <Label className="text-sm font-medium">Rotation</Label>
                                                        <span className="text-xs font-mono text-gray-500">{selectedText.rotation || 0}°</span>
                                                    </div>
                                                    <div className="py-2">
                                                        <Slider
                                                            value={[selectedText.rotation || 0]}
                                                            onValueChange={(v) => updateSelectedText('rotation', v[0])}
                                                            min={0}
                                                            max={360}
                                                            step={1}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed rounded-lg bg-gray-50 mt-4">
                                                <MousePointer2 className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                                <p className="font-medium">No text layer selected</p>
                                                <p className="text-xs mt-1">Click a layer above or add a new one</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* GRAPHICS TAB */}
                                    <TabsContent value="graphics" className="space-y-4">
                                        <div>
                                            <Label className="text-base text-black font-semibold mb-3 block">Upload Logo / Image</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        {currentDesign.logoPreview ? (
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 p-4 rounded-lg border">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <Label className="text-sm font-semibold">Preview</Label>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => updateDesign(activeSide, { logo: null, logoPreview: null })}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                                                        </Button>
                                                    </div>
                                                    <div className="bg-white rounded-lg border p-4 flex items-center justify-center">
                                                        <img
                                                            src={currentDesign.logoPreview}
                                                            className="max-h-32 object-contain"
                                                            alt="Logo Preview"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <Label className="text-sm">Logo Size</Label>
                                                        <span className="text-sm font-medium text-primary">{currentDesign.logoSize}%</span>
                                                    </div>
                                                    <div className="py-2">
                                                        <Slider
                                                            value={[currentDesign.logoSize]}
                                                            onValueChange={(v) => updateDesign(activeSide, { logoSize: v[0] })}
                                                            min={5}
                                                            max={80}
                                                            step={1}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                                                <ImageIcon className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                                <p className="font-medium">No logo uploaded</p>
                                                <p className="text-xs mt-1">Upload an image to get started</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <div className="text-center text-sm text-gray-500 mt-4">
                            <p>Drag text and logo to position them on the product.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
