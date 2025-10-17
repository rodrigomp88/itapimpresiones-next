"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Carousel from "../../components/Carousel/page";
import GuiaTienda from "../../components/GuiaTienda/page";

const Home = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { ref: refNosotros, inView: inViewNosotros } = useInView({
    threshold: 0.5,
  });
  const { ref: refProductos, inView: inViewProductos } = useInView({
    threshold: 0.5,
  });
  const { ref: refInformacion, inView: inViewInformacion } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inViewNosotros) setActiveSection("nosotros");
    if (inViewProductos) setActiveSection("productos");
    if (inViewInformacion) setActiveSection("informacion");
  }, [inViewNosotros, inViewProductos, inViewInformacion]);

  return (
    <div>
      <Carousel />
      <div className="">
        <div className="py-10">
          <h1 className="text-xl my-5 text-center">
            Compra en tres simples pasos, desde cualquier lugar
          </h1>
          <div className="grid md:grid-cols-3">
            <GuiaTienda
              title="Paso 1"
              description="Selecciona el producto, la cantidad y agrega al carrito"
              image="/images/paso-1.jpg"
            />
            <GuiaTienda
              title="Paso 2"
              description="Verifica que los productos y sus cantidades sean las seleccionadas"
              image="/images/paso-1.jpg"
            />
            <GuiaTienda
              title="Paso 3"
              description="Eleji el metodo de pago y espera el producto"
              image="/images/paso-1.jpg"
            />
          </div>
        </div>

        <motion.div
          ref={refNosotros}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: activeSection === "nosotros" ? 1 : 0,
            y: activeSection === "nosotros" ? 0 : 100,
          }}
          transition={{ duration: 0.5 }}
          className=" border my-8 rounded-md shadow-lg"
        >
          <div className="container mx-auto">
            <div className="py-3">
              <h1 className="text-2xl font-medium text-center mb-4">
                Nosotros
              </h1>
              <div className="mt-1 text-center mx-4 px-4 py-3 hover:cursor-crosshair">
                <p className="text-xl lg:px-8 py-3">
                  Somos emprendedores especializados en bolsas de friselina,
                  remeras de algodón y gorras traquet en Mendoza. Ofrecemos
                  productos de alta calidad y personalización, con envío a nivel
                  nacional. Contáctanos para tus necesidades de personalización.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={refProductos}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: activeSection === "productos" ? 1 : 0,
            y: activeSection === "productos" ? 0 : 100,
          }}
          transition={{ duration: 0.5 }}
          className="border my-8 rounded-md shadow-lg"
        >
          <div className="container mx-auto">
            <div className="py-3">
              <h1 className="text-2xl font-medium text-center mb-4">
                Productos
              </h1>
              <div className="mt-1 text-center mx-4 px-4 py-3 hover:cursor-crosshair">
                <p className="text-xl lg:px-8 py-3">
                  Las bolsas son fabricadas en friselina 80 gramos, calidad
                  premium, confeccionadas mediante calor y resistentes hasta 12
                  kilos. Son impresas en serigrafía. Trabajamos distintas
                  medidas estándar: Supermercados, almacenes, verdulerías,
                  zapaterías, tiendas de ropa, lencerías, bijouterie, farmacias,
                  perfumerías, peluquerías, bodegas, vinieras, etc. Mínimo de
                  compra 50 bolsas.
                  <br />
                  Remeras de algodón premium, todos los colores, impresas en
                  serigrafía talles desde XS al 5XL. Peluquerías, estéticas,
                  comercios, etc. Mínimo de compras 5 remeras.
                  <br />
                  Gorras trucker, impresas a full color. Publicitarias,
                  promociones, etc. Mínimos de compras5 gorras.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={refInformacion}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: activeSection === "informacion" ? 1 : 0,
            y: activeSection === "informacion" ? 0 : 100,
          }}
          transition={{ duration: 0.5 }}
          className="border my-8 rounded-md shadow-lg"
        >
          <div className="container mx-auto">
            <div className="py-3">
              <h1 className="text-2xl font-medium text-center mb-4">
                Información
              </h1>
              <div className="mt-1 text-center mx-4 px-4 py-3 hover:cursor-crosshair">
                <p className="text-xl lg:px-8 py-3">
                  Las bolsas de friselina con el logo de su negocio, es la mejor
                  estrategia de marketing en la calle. Ya que sus clientes la
                  usarán para sus compras y rutinas diarias. Teniendo así un
                  bajo costo de publicidad y el cuidado del medio ambiente.
                  Puedes encontrarnos en Instagram itapimpresiones facebook
                  itapimpresiones y página web
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
