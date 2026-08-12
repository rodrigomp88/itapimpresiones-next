"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const bagsFAQData: FAQItem[] = [
  {
    question: "¿Cuál es el tamaño mínimo de pedido para bolsas de friselina?",
    answer:
      "No tenemos cantidad mínima, podés solicitar desde 1 bolsa. Sin embargo, para obtener mejores precios, recomendamos pedidos a partir de 100 unidades.",
  },
  {
    question: "¿Qué técnicas de impresión utilizan para las bolsas?",
    answer:
      "Utilizamos serigrafía y DTF (Direct to Film) según tu diseño. La serigrafía es ideal para colores planos y grandes cantidades, mientras que DTF permite diseños full-color y detalles complejos.",
  },
  {
    question: "¿Cuánto tiempo demora la producción?",
    answer:
      "Los tiempos varían según la cantidad y complejidad del diseño. Generalmente entre 7-15 días hábiles desde la aprobación del diseño y confirmación del pedido.",
  },
  {
    question: "¿Qué colores de friselina tienen disponibles?",
    answer:
      "Ofrecemos más de 20 colores diferentes de friselina. Los más populares incluyen: blanco, negro, azul marino, rojo, verde, amarillo, beige, gris y muchos más.",
  },
  {
    question: "¿Las bolsas son reutilizables?",
    answer:
      "Sí, nuestras bolsas de friselina están diseñadas para ser reutilizables múltiples veces. Son resistentes al desgarro y mantienen su forma y calidad tras varios usos.",
  },
  {
    question: "¿Puedo ver una muestra antes de hacer el pedido completo?",
    answer:
      "Ofrecemos muestras físicas por un costo adicional que se descuenta del pedido final. Esto te permite verificar la calidad, colores y medidas antes de la producción completa.",
  },
  {
    question: "¿Hacen entregas a toda Argentina?",
    answer:
      "Sí, enviamos a todo el país. Los costos y tiempos de envío varían según la ubicación. Para pedidos grandes, ofrecemos envío gratuito en CABA y GBA.",
  },
  {
    question: "¿Qué medidas de bolsas tienen disponibles?",
    answer:
      "Trabajamos con medidas estándar como 40x45cm, 30x40cm, 25x35cm, y también podemos fabricar medidas personalizadas según tus necesidades específicas.",
  },
];

const BagsFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="bg-background-off dark:bg-slate-800 rounded-lg p-6 border border-gray-100 dark:border-slate-700">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Preguntas Frecuentes
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Todo lo que necesitás saber sobre nuestras bolsas de friselina
          </p>
        </div>

        <div className="space-y-4">
          {bagsFAQData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-900"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-medium text-slate-900 dark:text-white pr-4">
                  {item.question}
                </span>
                {openItems.includes(index) ? (
                  <FaChevronUp className="text-slate-500 flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-slate-500 flex-shrink-0" />
                )}
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ¿No encontraste lo que buscabas?
            <a href="#cotizacion" className="text-primary hover:underline ml-1">
              Contactanos directamente
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BagsFAQ;
