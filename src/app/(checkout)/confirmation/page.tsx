import Link from "next/link";

export const dynamic = "force-dynamic";

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header de éxito */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Tu orden ha sido procesada exitosamente
        </p>
      </div>

      {/* Mensaje informativo */}
      <div className="bg-primary/10 dark:bg-primary/10 border border-primary/20 dark:border-primary-dark rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary-dark dark:text-primary-light mb-3">
          ¿Qué sigue?
        </h3>
        <ul className="space-y-2 text-sm text-primary-dark dark:text-primary-light">
          <li className="flex items-start gap-2">
            <span className="text-primary dark:text-primary-light mt-1">•</span>
            <span>Te enviaremos un email de confirmación en breve</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary dark:text-primary-light mt-1">•</span>
            <span>El estado de tu pedido se actualizará automáticamente</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary dark:text-primary-light mt-1">•</span>
            <span>Te contactaremos si necesitamos información adicional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary dark:text-primary-light mt-1">•</span>
            <span>Podés seguir el estado de tu pedido en "Mis Órdenes"</span>
          </li>
        </ul>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Ver Mis Órdenes
        </Link>
        <Link
          href="/tienda"
          className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-base font-medium rounded-lg text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Seguir Comprando
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
