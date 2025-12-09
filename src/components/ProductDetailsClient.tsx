"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ADD_TO_CART, selectCartItems } from "../redux/slice/cartSlice";
import { Product, ProductImage, CartItem } from "../types";
import { useEffect, useState, useRef, ChangeEvent, PointerEvent } from "react";
import { NotiflixWarning } from "./Notiflix/Notiflix";

interface ProductDetailsClientProps {
  product: Product;
}

const getImageUrl = (image: string | ProductImage | undefined): string => {
  if (!image) return "/placeholder.png";
  if (typeof image === "string") {
    return image !== "" ? image : "/placeholder.png";
  }
  return image.url || "/placeholder.png";
};

const getImageColor = (
  image: string | ProductImage | undefined
): string | null => {
  if (typeof image === "object" && image?.color && image.color !== "Todos") {
    return image.color;
  }
  return null;
};

const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({
  product,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const [isClient, setIsClient] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // --- LOGO PREVIEW STATE ---
  const [userLogo, setUserLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Posición y Tamaño del Logo
  const [logoPos, setLogoPos] = useState({ x: 50, y: 50 }); // Porcentajes
  const [logoSize, setLogoSize] = useState(30); // Porcentaje de ancho
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // --------------------------

  // Mínimo real
  const minQty = product.unity && product.unity > 0 ? product.unity : 1;

  // ESTADO DE CANTIDAD:
  // Inicializamos SIEMPRE con minQty para evitar error de hidratación (server vs client mismatch).
  // Actualizaremos este valor en el useEffect si el producto ya está en el carrito.
  const [quantity, setQuantity] = useState(minQty);

  const safeImages =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];

  // Verificar si está en el carrito (buscamos por ID)
  // Usamos useAppSelector directamente, pero para la UI segura usamos un estado derivado en useEffect
  const cartItemInStore = cartItems.find((item) => item.id === product.id);
  const [isCartAdded, setIsCartAdded] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Sincronización post-montaje para evitar error de hidratación
    if (cartItemInStore) {
      setIsCartAdded(true);
      setQuantity(cartItemInStore.cartQuantity);
    } else {
      setIsCartAdded(false);
      setQuantity(minQty);
    }
  }, [cartItemInStore, minQty]);

  const handleAddToCart = () => {
    const productToSend: CartItem = {
      ...product,
      cartQuantity: quantity,
    };
    dispatch(ADD_TO_CART(productToSend));
    // No redirigimos forzosamente, el usuario verá que el botón cambia
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  const decrementQuantity = () => {
    if (quantity > minQty) {
      setQuantity((prev) => prev - 1);
    } else {
      NotiflixWarning(`La cantidad mínima de "${product.name}" es ${minQty}`);
    }
  };

  // --- LÓGICA DE ARRASTRAR (DRAG AND DROP) ---
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Calcular posición relativa en porcentaje
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Limitar para que no se salga demasiado (opcional)
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setLogoPos({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  // -------------------------------------------

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUserLogo(url);
      // Resetear posición al centro al subir nuevo
      setLogoPos({ x: 50, y: 50 });
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const removeLogo = () => {
    setUserLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentImageSrc = getImageUrl(safeImages[selectedImage]);
  const currentColor = getImageColor(safeImages[selectedImage]);

  return (
    <div className="flex-grow">
      <div className="max-w-screen-xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2">
            <Link
              className="text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:text-primary"
              href="/"
            >
              Inicio
            </Link>
            <span className="text-zinc-600 dark:text-zinc-400 text-sm">/</span>
            <Link
              className="text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:text-primary"
              href="/tienda"
            >
              Tienda
            </Link>
            <span className="text-zinc-600 dark:text-zinc-400 text-sm">/</span>
            <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Galería e Imagen Principal */}
            <div className="flex flex-col gap-4">
              {/* Contenedor Principal de Imagen */}
              <div
                ref={containerRef}
                className="relative aspect-square w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group flex items-center justify-center touch-none"
                onPointerMove={handlePointerMove}
              >
                {/* Imagen del Producto (Fondo) */}
                <div className="relative w-full h-full pointer-events-none select-none">
                  <Image
                    fill
                    className="object-contain p-2 z-0"
                    src={currentImageSrc}
                    alt={product.name}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* LOGO DRAGGABLE */}
                {userLogo && (
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    className="absolute z-10 cursor-move border-2 border-dashed border-primary/50 hover:border-primary bg-white/10 rounded"
                    style={{
                      left: `${logoPos.x}%`,
                      top: `${logoPos.y}%`,
                      width: `${logoSize}%`,
                      transform: "translate(-50%, -50%)", // Centrar el div en el punto del mouse
                      aspectRatio: "1/1",
                    }}
                  >
                    <div className="relative w-full h-full pointer-events-none">
                      <Image
                        src={userLogo}
                        fill
                        className="object-contain"
                        alt="Logo Preview"
                      />
                    </div>
                  </div>
                )}

                {/* Botón quitar logo flotante */}
                {userLogo && (
                  <button
                    onClick={removeLogo}
                    className="absolute top-4 left-4 z-20 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Quitar logo"
                  >
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                )}

                {currentColor && (
                  <div className="absolute top-4 right-4 z-20 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                    {currentColor}
                  </div>
                )}
              </div>

              {/* Controles del Logo (Solo si hay logo cargado) */}
              {userLogo && (
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-500 uppercase">
                    Tamaño:
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              )}

              {/* Miniaturas */}
              {safeImages.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {safeImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square bg-white dark:bg-zinc-900 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImage === index
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-primary"
                      }`}
                    >
                      <Image
                        fill
                        className={`object-cover p-1 ${
                          selectedImage === index ? "" : "opacity-75"
                        }`}
                        src={getImageUrl(image)}
                        alt={`${product.name} - Vista ${index + 1}`}
                        sizes="(max-width: 768px) 20vw, 10vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info y Controles */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="text-zinc-900 dark:text-zinc-100 text-4xl font-black">
                  {product.name}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-base">
                  {product.description}
                </p>
                <p className="text-zinc-900 dark:text-zinc-100 text-3xl font-black">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </div>

              {product.size && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-900 dark:text-zinc-100 text-sm font-bold">
                    Talle/Tamaño
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium bg-primary/10">
                      {product.size}
                    </div>
                  </div>
                </div>
              )}

              {/* Personalization Section */}
              <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary rounded p-4 flex flex-col gap-4">
                <h3 className="text-primary text-lg font-bold">
                  ¿Querés personalizar este producto?
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                  Subí tu logo. Podés moverlo y cambiarle el tamaño sobre la
                  imagen para previsualizarlo.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={triggerFileInput}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined !text-xl">
                      add_photo_alternate
                    </span>
                    <span>
                      {userLogo ? "Cambiar Logo" : "Subir y Previsualizar Logo"}
                    </span>
                  </button>
                </div>
                {userLogo && (
                  <p className="text-xs text-primary mt-1">
                    * Previsualización aproximada. Arrastra el logo para
                    ubicarlo.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                {!product.pause ? (
                  <>
                    {/* Controles de Cantidad: Solo visibles/activos si no está añadido para añadir, o siempre visibles pero si está añadido son informativos */}
                    {/* Según requerimiento: Si está en carrito, mostrar link. Si no, añadir. */}

                    {!isCartAdded && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={decrementQuantity}
                          className={`flex items-center justify-center rounded-lg h-12 w-12 border transition-colors ${
                            quantity <= minQty
                              ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-600"
                              : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                          disabled={quantity <= minQty}
                        >
                          <span className="material-symbols-outlined">
                            remove
                          </span>
                        </button>
                        <span className="text-zinc-900 dark:text-zinc-100 text-xl font-bold w-12 text-center select-none">
                          {isClient ? quantity : minQty}
                        </span>
                        <button
                          onClick={incrementQuantity}
                          className="flex items-center justify-center rounded-lg h-12 w-12 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                    )}

                    {!isClient ? (
                      <div className="w-full sm:w-auto flex-grow h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ) : isCartAdded ? (
                      <Link
                        href="/cart"
                        className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-base font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          shopping_cart
                        </span>
                        <span>Ir al Carrito</span>
                      </Link>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-base font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          shopping_cart
                        </span>
                        <span>Añadir al Carrito</span>
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-lg text-center font-bold text-red-500 w-full">
                    Sin Stock
                  </p>
                )}
              </div>

              {product.unity && !product.pause && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    info
                  </span>
                  Mínimo de compra:{" "}
                  <strong className="text-zinc-700 dark:text-zinc-200">
                    {minQty} unidades
                  </strong>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;
