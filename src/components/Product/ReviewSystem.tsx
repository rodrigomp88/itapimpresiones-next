"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Notiflix from "notiflix";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
  helpful: number;
  images?: string[];
}

interface ReviewSystemProps {
  productId: string;
  productName: string;
  className?: string;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  productId,
  productName,
  className = "",
}) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    verified: false,
  });

  useEffect(() => {
    const reviews: Review[] = [
      {
        id: "1",
        userId: "user1",
        userName: "María González",
        productId,
        rating: 5,
        title: "Excelente calidad",
        comment:
          "Muy buena calidad de impresión, el color se mantuvo igual a la prueba. Llegó en tiempo y forma. Lo recomiendo.",
        verified: true,
        createdAt: "2025-12-10T10:30:00Z",
        helpful: 12,
        images: ["/images/review1.jpg"],
      },
      {
        id: "2",
        userId: "user2",
        userName: "Carlos Rodríguez",
        productId,
        rating: 4,
        title: "Buen producto",
        comment:
          "Cumple con lo esperado. La tela es de buena calidad y la impresión quedó bien definida.",
        verified: true,
        createdAt: "2025-12-08T15:45:00Z",
        helpful: 8,
      },
      {
        id: "3",
        userId: "user3",
        userName: "Ana Martínez",
        productId,
        rating: 5,
        title: "Perfecto",
        comment:
          "Exactamente lo que necesitaba. El diseño quedó hermoso y la calidad es excepcional.",
        verified: true,
        createdAt: "2025-12-05T09:15:00Z",
        helpful: 15,
      },
      {
        id: "4",
        userId: "user4",
        userName: "Luis Fernández",
        productId,
        rating: 3,
        title: "Está bien",
        comment:
          "El producto está bien pero tardó un poco más de lo esperado en llegar.",
        verified: false,
        createdAt: "2025-12-03T14:20:00Z",
        helpful: 3,
      },
    ];
    setTimeout(() => {
      setReviews(reviews);
      setLoading(false);
    }, 1000);
  }, [productId]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    if (filter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filter)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      Notiflix.Notify.failure("Debes iniciar sesión para dejar una reseña");
      return;
    }

    if (
      formData.rating === 0 ||
      !formData.title.trim() ||
      !formData.comment.trim()
    ) {
      Notiflix.Notify.failure(
        "Por favor completa todos los campos obligatorios"
      );
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newReview: Review = {
        id: Date.now().toString(),
        userId: session.user?.id || "current-user",
        userName: session.user?.name || "Usuario Anónimo",
        productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        verified: false,
        createdAt: new Date().toISOString(),
        helpful: 0,
      };

      setReviews((prev) => [newReview, ...prev]);
      setFormData({ rating: 0, title: "", comment: "", verified: false });
      setShowForm(false);
      Notiflix.Notify.success("¡Reseña enviada exitosamente!");
    } catch {
      Notiflix.Notify.failure(
        "Error al enviar la reseña. Inténtalo nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
    Notiflix.Notify.success("Marcado como útil");
  };

  const renderStars = (
    rating: number,
    size: "sm" | "md" | "lg" = "md",
    interactive: boolean = false,
    onRate?: (rating: number) => void
  ) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            {star <= rating ? (
              <StarIconSolid
                className={`${sizeClasses[size]} text-yellow-400`}
              />
            ) : (
              <StarIconOutline
                className={`${sizeClasses[size]} text-gray-300`}
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();
  const filteredReviews = filteredAndSortedReviews();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Reseñas de Clientes
          </h3>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              {renderStars(Math.round(averageRating), "md")}
              <span className="ml-2 text-lg font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="ml-1 text-gray-500">
                ({reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"})
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Escribir Reseña
        </button>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Distribución de Calificaciones
          </h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-3">
                    {rating}
                  </span>
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Resumen</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Calificación promedio</span>
              <span className="font-semibold">
                {averageRating.toFixed(1)} / 5
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reseñas verificadas</span>
              <span className="font-semibold">
                {reviews.filter((r) => r.verified).length} de {reviews.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recomendarían</span>
              <span className="font-semibold">
                {Math.round(
                  (reviews.filter((r) => r.rating >= 4).length /
                    reviews.length) *
                    100
                )}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filtrar:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">Todas las calificaciones</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Ordenar:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="highest">Mayor calificación</option>
            <option value="lowest">Menor calificación</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verificado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating, "sm")}
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleHelpful(review.id)}
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Útil ({review.helpful})
              </button>
            </div>

            <div className="mb-3">
              <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
              <p className="text-gray-700">{review.comment}</p>
            </div>

            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 mt-3">
                {review.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Reseña ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                    width={80}
                    height={80}
                    unoptimized
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Escribir Reseña para {productName}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación *
                  </label>
                  {renderStars(formData.rating, "lg", true, (rating) =>
                    setFormData((prev) => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  {/* Campo Título */}
                  <label
                    htmlFor="review-title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Título de la Reseña *
                  </label>
                  <input
                    type="text"
                    id="review-title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ejemplo: ¡Absolutamente genial!"
                    maxLength={100}
                    required
                    disabled={submitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Máximo 100 caracteres.
                  </p>
                </div>

                <div>
                  {/* Campo Comentario */}
                  <label
                    htmlFor="review-comment"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tu Reseña *
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe tu experiencia con el producto."
                    maxLength={1000}
                    required
                    disabled={submitting}
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    Máximo 1000 caracteres.
                  </p>
                </div>

                {/* Botón de Enviar */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                      submitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium`}
                    disabled={submitting}
                  >
                    {submitting ? "Enviando..." : "Enviar Reseña"}
                    {!submitting && (
                      <PaperAirplaneIcon className="ml-2 h-5 w-5 rotate-90" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; // <-- Cierra la función del componente ReviewSystem

export default ReviewSystem;
