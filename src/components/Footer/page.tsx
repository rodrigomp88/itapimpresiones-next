import Link from "next/link";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <section className="bg-gradient-to-b border-t px-5 md:px-20 lg:px-48 mt-14">
        <div className="grid md:grid-cols-3 md:place-items-center gap-8 py-5">
          <div>
            <div className="py-3">
              <h3 className="text-2xl">Pagina</h3>
            </div>
            <div className="grid">
              <Link href="/" className="underline">
                Inicio
              </Link>
              <Link href="/nosotros" className="underline">
                Nosotros
              </Link>
              <Link href="/shop" className="underline">
                Tienda
              </Link>
              <Link href="/contact" className="underline">
                Contacto
              </Link>
            </div>
          </div>
          <div>
            <div className="py-3">
              <h3 className="text-2xl">Seguinos</h3>
            </div>
            <div className="flex md:justify-center text-2xl gap-3 py-3">
              <p>
                <a href="" target="_blank">
                  <FaFacebookSquare />
                </a>
              </p>
              <p>
                <a href="" target="_blank">
                  <FaInstagram />
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="grid justify-center text-center text-sm py-4">
          <h1>&copy; Itap-Impresiones</h1>
          <p>2015 - {year}</p>
        </div>
      </section>
    </>
  );
};

export default Footer;
