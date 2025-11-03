/**
 * TIDElabs - RAZA El Atelier
 * Brutalismo Elegante - Experiencia de comercio ordenada
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, X, Plus, Minus, ArrowLeft } from "lucide-react";
import { productsApi, cartApi } from "../utils/api";

interface Product {
  id: string;
  line: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  sku: string;
  isNFT?: boolean;
}

interface RazaAtelierProps {
  onBack: () => void;
  sessionToken?: string | null;
}

export function RazaAtelier({ onBack, sessionToken }: RazaAtelierProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsApi.list('RAZA');
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    if (!sessionToken) return;
    try {
      const response = await cartApi.get(sessionToken);
      setCart(response.cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!sessionToken) {
      alert('Conecta tu wallet para añadir al carrito');
      return;
    }

    try {
      await cartApi.add(productId, 1, sessionToken);
      await loadCart();
      alert('Producto añadido al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al añadir al carrito');
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-brutalist">Cargando RAZA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-black p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:text-[var(--color-raza-accent)] transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-brutalist">Volver</span>
          </button>

          <div className="text-center">
            <h1 className="text-6xl tracking-tighter font-brutalist">RAZA</h1>
            <p className="text-sm tracking-widest mt-1">EL ATELIER</p>
          </div>

          <button
            onClick={() => {
              loadCart();
              setCartOpen(true);
            }}
            className="relative p-3 border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            <ShoppingCart size={24} />
            {cart?.items?.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-raza-accent)] text-black rounded-full flex items-center justify-center text-xs font-brutalist">
                {cart.items.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Product Grid */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-[var(--color-raza-gray)] overflow-hidden border-2 border-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-[var(--color-raza-gray)] mb-1">
                    {product.sku}
                  </p>
                  <h3 className="font-brutalist mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-brutalist">${product.price}</span>
                    <span className="text-xs text-[var(--color-raza-gray)]">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-8 p-8">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full aspect-square object-cover border-2 border-black"
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="self-end p-2 border-2 border-black hover:bg-black hover:text-white transition-all mb-4"
                  >
                    <X size={20} />
                  </button>
                  <p className="text-xs text-[var(--color-raza-gray)] mb-2">
                    {selectedProduct.sku}
                  </p>
                  <h2 className="text-3xl font-brutalist mb-4">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-2xl font-brutalist mb-6">
                    ${selectedProduct.price}
                  </p>
                  <p className="mb-6 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="mt-auto">
                    <p className="text-sm text-[var(--color-raza-gray)] mb-4">
                      Stock disponible: {selectedProduct.stock} unidades
                    </p>
                    <button
                      onClick={() => addToCart(selectedProduct.id)}
                      className="w-full bg-black text-white py-4 font-brutalist hover:bg-[var(--color-raza-accent)] hover:text-black transition-all border-2 border-black"
                    >
                      AÑADIR AL CARRITO
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[400px] bg-white border-l-4 border-black z-50 flex flex-col"
            >
              <div className="p-6 border-b-2 border-black">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-brutalist">TU CARRITO</h2>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {!cart || cart.items.length === 0 ? (
                  <p className="text-center text-[var(--color-raza-gray)] mt-8">
                    Tu carrito está vacío
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item: any) => (
                      <div
                        key={item.productId}
                        className="border-2 border-black p-4"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-20 h-20 object-cover border border-black"
                          />
                          <div className="flex-1">
                            <h3 className="font-brutalist text-sm mb-1">
                              {item.product?.name}
                            </h3>
                            <p className="text-sm mb-2">
                              ${item.product?.price}
                            </p>
                            <div className="flex items-center gap-2">
                              <button className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black hover:text-white">
                                <Minus size={12} />
                              </button>
                              <span className="font-brutalist text-sm">
                                {item.quantity}
                              </span>
                              <button className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black hover:text-white">
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t-4 border-black">
                <div className="flex justify-between mb-4">
                  <span className="font-brutalist">TOTAL</span>
                  <span className="font-brutalist text-xl">
                    $
                    {cart?.items.reduce(
                      (sum: number, item: any) =>
                        sum + (item.product?.price || 0) * item.quantity,
                      0
                    ) || 0}
                  </span>
                </div>
                <button className="w-full bg-black text-white py-4 font-brutalist hover:bg-[var(--color-raza-accent)] hover:text-black transition-all border-2 border-black">
                  PROCEDER AL PAGO
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
