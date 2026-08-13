const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <img
            src="/images/brand/logo-horizontal-fondo-claro.svg"
            alt="ITAP Impresiones"
            className="h-12 w-auto dark:hidden"
          />
          <img
            src="/images/brand/logo-horizontal.svg"
            alt="ITAP Impresiones"
            className="h-12 w-auto hidden dark:block"
          />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Síguenos en nuestras redes
          </h3>
          <div className="flex gap-6">
            <a
              className="text-slate-400 hover:text-primary transition-colors"
              href="https://www.instagram.com/itapimpresiones/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar página de Instagram"
            >
              <span className="sr-only">Instagram</span>
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a
              className="text-slate-400 hover:text-primary transition-colors"
              href="https://www.facebook.com/itapimpresiones/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar página de Facebook"
            >
              <span className="sr-only">Facebook</span>
              <span className="material-symbols-outlined">public</span>
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 ITAP Impresiones</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
              href="#"
              aria-label="Leer política de privacidad"
            >
              Política de Privacidad
            </a>
            <a
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
              href="#"
              aria-label="Leer términos de servicio"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
