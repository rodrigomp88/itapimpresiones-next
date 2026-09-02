"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/landing.css";

const LOGO_LIGHT = "/images/brand/logo-horizontal-negro.svg";
const LOGO_DARK = "/images/brand/logo-horizontal-blanco.svg";

export default function Landing() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme init + toggle
  useEffect(() => {
    const stored = localStorage.getItem("itap-theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial =
      stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("itap-theme", next);
  };

  const closeMenu = () => setMenuOpen(false);

  // Scroll reveal — IntersectionObserver
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    document.querySelectorAll('.section-frame').forEach((el) => {
      if (el.id !== 'hero') observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* ═══════════ NAV ═══════════ */}
      <nav className="landing-nav">
        <Link href="/" className="landing-nav__brand">
          <img
            src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
            alt="ITAP Impresiones"
            className="landing-nav__logo"
          />
        </Link>

        <ul className={`landing-nav__links${menuOpen ? " is-open" : ""}`}>
          {[
            ["Nosotros", "#nosotros"],
            ["Técnicas", "#tecnicas"],
            ["Catálogo", "#catalogo"],
            ["Proceso", "#proceso"],
            ["Contacto", "#contacto"],
            ["Tienda", "/catalogo"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={closeMenu} className={href === "/catalogo" ? "landing-nav__shop" : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="landing-nav__right">
          <span className="landing-nav__loc">Guaymallén · Mendoza</span>

          <button
            className="landing-nav__theme"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            <svg className="ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        <button
          className="landing-nav__burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`landing-nav__overlay${menuOpen ? " is-open" : ""}`}
          onClick={closeMenu}
        />
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="landing-hero section-frame">
        <span className="crop crop--tl" />
        <span className="crop crop--tr" />
        <span className="crop crop--bl" />
        <span className="crop crop--br" />
        <div className="landing-hero__mesh" />

        <h1 className="landing-hero__title">
          Serigrafía, DTF y sublimado <em>en Mendoza</em>
        </h1>

        <div className="landing-hero__row">
          <p className="landing-hero__sub">
            <strong>Serigrafía, DTF y sublimado</strong> sobre remeras, buzos,
            gorras y bolsas de friselina. Pedís hoy, retirás en 5 a 15 días.
          </p>
          <div className="landing-hero__actions">
            <a href="#contacto" className="landing-btn landing-btn--solid">
              Cotizar
            </a>
            <a href="/catalogo" className="landing-btn landing-btn--ghost">
              Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ RIBBON ═══════════ */}
      <div className="landing-ribbon">
        <div className="landing-ribbon__track">
          {(
            [
              ["Serigrafía", "ocean"],
              ["DTF", "mist"],
              ["Sublimado", "red"],
              ["Friselina", "saffron"],
            ] as const
          )
            .concat([
              ["Serigrafía", "ocean"],
              ["DTF", "mist"],
              ["Sublimado", "red"],
              ["Friselina", "saffron"],
            ])
            .map(([name, color], i) => (
              <span
                key={i}
                className={`landing-ribbon__item landing-ribbon__item--${color}`}
              >
                <span className="swatch" />
                {name}
              </span>
            ))}
        </div>
      </div>

      {/* ═══════════ NOSOTROS ═══════════ */}
      <section
        className="landing-about section-frame"
        id="nosotros"
        data-num="01"
      >
        <p className="landing-block-label">Nosotros</p>
        <h2 className="landing-block-title">
          Del cartel<span className="out"> a la indumentaria</span>
        </h2>

        <div className="landing-about__grid">
          <div className="landing-about__main">
            <p className="body">
              ITAP nació como taller de serigrafía en Mendoza. Empezamos con
              carteles, volantes y material gráfico para locales y empresas de
              la zona. Con el tiempo, la demanda de indumentaria personalizada
              nos llevó a sumar técnicas de impresión sobre textiles.
            </p>
            <p className="body">
              Hoy somos un taller que trabaja <span className="push">serigrafía,
              DTF y sublimado</span> para marcas, eventos y comercios en todo
              Mendoza. Cada pieza pasa por nuestras manos: del diseño a la
              entrega final.
            </p>

            <div className="landing-about__origin">
              <p className="big">
                &ldquo;itap&rdquo; <span>=</span> &ldquo;más&rdquo;
              </p>
              <p>
                En allentiac —la lengua originaria del Valle de Tulumay—
                <strong> &ldquo;itap&rdquo;</strong> significa &ldquo;más&rdquo;.
                Más color, más capas, más idea.
              </p>
            </div>
          </div>

          <div className="landing-about__facts">
            {[
              ["Ubicación", "Guaymallén, Mendoza, Argentina", ""],
              [
                "Forma de trabajo",
                "A pedido, sin stock. Diseño incluido.",
                "",
              ],
              ["Horario", "Lunes a viernes, 9 a 18 hs", ""],
            ].map(([k, v, s]) => (
              <div className="landing-about__fact" key={k}>
                <span className="landing-about__fact-k">{k}</span>
                <span className="landing-about__fact-v">
                  {v}
                  {s && <span className="landing-about__fact-s"> {s}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TÉCNICAS ═══════════ */}
      <section
        className="landing-tech section-frame"
        id="tecnicas"
        data-num="02"
      >
        <p className="landing-block-label">Técnicas</p>
        <h2 className="landing-block-title">
          Tres técnicas,<br />
          todo tipo de <span className="out">pieza</span>
        </h2>

        <div className="landing-tech__list">
          {/* Serigrafía */}
          <div className="landing-tech__item" data-letter="S">
            <div className="landing-tech__plate landing-tech__plate--s">S</div>
            <div>
              <h3 className="landing-tech__name">Serigrafía</h3>
              <p className="landing-tech__meta">Color sólido · Volumen</p>
            </div>
            <div className="landing-tech__body">
              <p className="landing-tech__desc">
                La técnica insignia. La tinta se exprime a través de una malla
                tensada, capa a capa. <b>Color sólido, opaco y ultra durable</b>.
              </p>
              <p className="landing-tech__use">
                <b>Ideal para:</b> Indumentaria de trabajo · Pedidos desde 50 u. ·
                Logos de 1 a 6 tintas
              </p>
            </div>
          </div>

          {/* DTF */}
          <div className="landing-tech__item" data-letter="D">
            <div className="landing-tech__plate landing-tech__plate--d">D</div>
            <div>
              <h3 className="landing-tech__name">DTF</h3>
              <p className="landing-tech__meta">Full color · Sin mínimos</p>
            </div>
            <div className="landing-tech__body">
              <p className="landing-tech__desc">
                Full color sin mínimos. La tinta se imprime en una película
                translúcida y se transfiere por calor a la tela.
              </p>
              <p className="landing-tech__use">
                <b>Ideal para:</b> Diseños con degradados · Desde 1 unidad ·
                Remeras, buzos, gorras
              </p>
            </div>
          </div>

          {/* Sublimado */}
          <div className="landing-tech__item" data-letter="U">
            <div className="landing-tech__plate landing-tech__plate--u">U</div>
            <div>
              <h3 className="landing-tech__name">Sublimado</h3>
              <p className="landing-tech__meta">Tinta penetrante · Tacto suave</p>
            </div>
            <div className="landing-tech__body">
              <p className="landing-tech__desc">
                La tinta penetra la fibra. Tacto suave, no se cuartea, no se
                descascara. Ideal para piezas claras.
              </p>
              <p className="landing-tech__use">
                <b>Ideal para:</b> Bolsas de friselina · Cantidades chicas ·
                Fondo blanco o claro
              </p>
            </div>
          </div>

          {/* Indumentaria de trabajo */}
          <div className="landing-tech__item" data-letter="I">
            <div className="landing-tech__plate landing-tech__plate--i">I</div>
            <div>
              <h3 className="landing-tech__name">Indumentaria de trabajo</h3>
              <p className="landing-tech__meta">Resistencia · Profesional</p>
            </div>
            <div className="landing-tech__body">
              <p className="landing-tech__desc">
                Camisas, camperas, pantalones y gorras para profesionales.
                Impresión que resiste lavados industriales.
              </p>
              <p className="landing-tech__use">
                <b>Ideal para:</b> Empresas · Uniformes · Eventos corporativos
              </p>
            </div>
          </div>

          {/* Packaging */}
          <div className="landing-tech__item" data-letter="P">
            <div className="landing-tech__plate landing-tech__plate--p">P</div>
            <div>
              <h3 className="landing-tech__name">Packaging</h3>
              <p className="landing-tech__meta">Bolsas · Cajas · Etiquetas</p>
            </div>
            <div className="landing-tech__body">
              <p className="landing-tech__desc">
                Bolsas de friselina con tu marca, cajas personalizadas y
                etiquetas textiles. Packaging que comunica.
              </p>
              <p className="landing-tech__use">
                <b>Ideal para:</b> Emprendimientos · Tiendas · Eventos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATÁLOGO ═══════════ */}
      <section
        className="landing-cat section-frame"
        id="catalogo"
        data-num="03"
      >
        <div className="landing-cat__head">
          <h2 className="landing-block-title">Catálogo</h2>
          <p className="landing-cat__note">
            Cada pieza se imprime a pedido. Si no encontrás lo que buscás,
            escribinos y lo resolvemos.
          </p>
        </div>

        <div className="landing-cat__groups">
          {/* Indumentaria textil */}
          <div className="landing-cat__group" data-lg="TEX">
            <div className="landing-cat__group-hd">
              <span className="landing-cat__group-name">
                Indumentaria textil
              </span>
              <span className="landing-cat__group-count">4</span>
            </div>
            <ul className="landing-cat__rows">
              {[
                ["Remeras", "Algodón 100% · DTF / Serigrafía"],
                ["Buzos", "Friza / Algodón · DTF / Serigrafía"],
                ["Camisas de trabajo", "Poliéster / Algodón · Serigrafía"],
                ["Gorras", "Ajustable · DTF / Bordado"],
              ].map(([item, spec]) => (
                <li className="landing-cat__row" key={item}>
                  <span className="landing-cat__item">{item}</span>
                  <span className="landing-cat__spec">{spec}</span>
                </li>
              ))}
            </ul>
            <p className="landing-cat__foot">Desde 1 u. (DTF) · 5 u. (Serigrafía)</p>
          </div>

          {/* Bolsas de friselina */}
          <div className="landing-cat__group landing-cat__group--second" data-lg="BAG">
            <div className="landing-cat__group-hd">
              <span className="landing-cat__group-name">Bolsas de friselina</span>
              <span className="landing-cat__group-count">3</span>
            </div>
            <ul className="landing-cat__rows">
              {[
                ["Friselina reforzada", "300 g/m² · Serigrafía"],
                ["Friselina importada", "180 g/m² · Serigrafía / Sublimado"],
                ["Bolsa ecológica", "Reutilizable · Serigrafía"],
              ].map(([item, spec]) => (
                <li className="landing-cat__row" key={item}>
                  <span className="landing-cat__item">{item}</span>
                  <span className="landing-cat__spec">{spec}</span>
                </li>
              ))}
            </ul>
            <p className="landing-cat__foot">Desde 100 u. · Envío a todo el país</p>
          </div>
        </div>

        <div className="landing-cat__cta-wrap">
          <Link href="/catalogo" className="landing-btn landing-btn--solid">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      {/* ═══════════ TRABAJOS (PORTFOLIO) ═══════════ */}
      <section
        className="landing-portfolio section-frame"
        id="trabajos"
        data-num="04b"
      >
        <div className="landing-portfolio__head">
          <p className="landing-block-label">Trabajos</p>
          <h2 className="landing-block-title">
            Lo que
            <br />
            <span className="out">sale</span> del taller
          </h2>
        </div>

        <div className="landing-portfolio__grid">
          <div className="landing-portfolio__item landing-portfolio__item--wide">
            <div className="landing-portfolio__bg landing-portfolio__bg--remeras" />
            <div className="landing-portfolio__ph" aria-hidden="true">
              Próximamente
            </div>
            <div className="landing-portfolio__content">
              <div className="landing-portfolio__label landing-portfolio__label--white">
                Serigrafía · 200 u
              </div>
              <h3 className="landing-portfolio__name landing-portfolio__name--white">
                Remeras evento corporativo
              </h3>
              <div className="landing-portfolio__spec landing-portfolio__spec--white">
                2 tintas · algodón 180g · base blanca
              </div>
            </div>
          </div>

          <div className="landing-portfolio__item">
            <div className="landing-portfolio__bg landing-portfolio__bg--bolsas" />
            <div className="landing-portfolio__ph" aria-hidden="true">
              Próximamente
            </div>
            <div className="landing-portfolio__content">
              <div className="landing-portfolio__label landing-portfolio__label--saffron">
                Friselina · 150 u
              </div>
              <h3 className="landing-portfolio__name">Bolsas boutique</h3>
              <div className="landing-portfolio__spec">
                1 tinta · asas planas · 35×45 cm
              </div>
            </div>
          </div>

          <div className="landing-portfolio__item">
            <div className="landing-portfolio__bg landing-portfolio__bg--buzos" />
            <div className="landing-portfolio__ph" aria-hidden="true">
              Próximamente
            </div>
            <div className="landing-portfolio__content">
              <div className="landing-portfolio__label landing-portfolio__label--white">
                DTF · 50 u
              </div>
              <h3 className="landing-portfolio__name landing-portfolio__name--white">
                Buzos equipo de fútbol
              </h3>
              <div className="landing-portfolio__spec landing-portfolio__spec--white">
                Fotografía · poly-fleece · negro
              </div>
            </div>
          </div>

          <div className="landing-portfolio__item">
            <div className="landing-portfolio__bg landing-portfolio__bg--gorras" />
            <div className="landing-portfolio__ph" aria-hidden="true">
              Próximamente
            </div>
            <div className="landing-portfolio__content">
              <div className="landing-portfolio__label landing-portfolio__label--mist">
                Serigrafía · 80 u
              </div>
              <h3 className="landing-portfolio__name">Gorras comercio</h3>
              <div className="landing-portfolio__spec">
                1 tinta · panel frontal · navy
              </div>
            </div>
          </div>

          <div className="landing-portfolio__item">
            <div className="landing-portfolio__bg landing-portfolio__bg--camperas" />
            <div className="landing-portfolio__ph" aria-hidden="true">
              Próximamente
            </div>
            <div className="landing-portfolio__content">
              <div className="landing-portfolio__label landing-portfolio__label--cta">
                DTF · 30 u
              </div>
              <h3 className="landing-portfolio__name">Camperas delivery</h3>
              <div className="landing-portfolio__spec">
                Logo completo · tela lisa · personalización total
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROCESO ═══════════ */}
      <section
        className="landing-flow section-frame"
        id="proceso"
        data-num="04"
      >
        <div className="landing-flow__head">
          <h2 className="landing-block-title">Proceso</h2>
          <span className="landing-flow__status">
            Estado actual · en taller
          </span>
        </div>

        <ol className="landing-flow__steps">
          {[
            {
              n: "01",
              name: "Confirmado",
              desc: "Nos escribís o comprás. Coordinamos diseño, cantidad y seña (50%).",
              done: true,
            },
            {
              n: "02",
              name: "En Diseño",
              desc: "Preparamos el arte para impresión. Si no tenés diseño, lo hacemos con vos.",
              done: true,
            },
            {
              n: "03",
              name: "En Taller",
              desc: "Armamos pantallas, films y materiales.",
              done: false,
            },
            {
              n: "04",
              name: "En Producción",
              desc: "Se imprime tu pedido. Acá pasa la magia.",
              done: false,
            },
            {
              n: "05",
              name: "Listo",
              desc: "Te avisamos: retirás coordinado o te lo enviamos (Gran Mendoza).",
              done: false,
            },
            {
              n: "06",
              name: "Completado",
              desc: "Entregado. Si algo salió mal de nuestro lado, se reimprime. Sin discusión.",
              done: false,
            },
          ].map((step) => (
            <li className="landing-flow__step" key={step.n} data-n={step.n}>
              <span className="landing-flow__num">{step.n}</span>
              <p className="landing-flow__name">{step.name}</p>
              <span
                className={`landing-flow__mark${step.done ? " landing-flow__mark--done" : ""}`}
              />
              <p className="landing-flow__desc">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══════════ ENTREGA ═══════════ */}
      <section
        className="landing-shift section-frame"
        id="entrega"
        data-num="05"
      >
        <div className="landing-shift__grid">
          <div>
            <p className="landing-block-label">Entrega</p>
            <h2 className="landing-block-title">
              Plazos reales,<br />
              sin excusas
            </h2>

            <div className="landing-shift__stats">
              <div className="landing-shift__stat">
                <p className="landing-shift__stat-num">
                  5–15 <small>días</small>
                </p>
                <p className="landing-shift__stat-k">Plazo de entrega</p>
              </div>
              <div className="landing-shift__stat">
                <p className="landing-shift__stat-num">
                  3 <small>días</small>
                </p>
                <p className="landing-shift__stat-k">Con stock</p>
              </div>
            </div>
          </div>

          <div className="landing-shift__zone">
            <span className="landing-shift__zone-label">Zona de cobertura</span>
            <p className="landing-shift__zone-big">
              <span>Gran Mendoza</span> y alrededores
            </p>
            <p className="landing-shift__zone-note">
              Retiro en taller o envío coordinado. Para otras localidades,
              consultá disponibilidad.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ AMBIENTAL ═══════════ */}
      <section className="landing-env">
        <div className="landing-env__inner">
          <p className="landing-env__k">
            La <span>friselina</span> reemplaza al plástico
          </p>
          <p className="landing-env__p">
            Cada bolsa de friselina que imprimimos es una bolsa plástica que
            no se usa. <b>Duran más, se imprimen mejor y tu cliente las vuelve
            a usar.</b> No es solo packaging: es una decisión.
          </p>
        </div>
      </section>

      {/* ═══════════ OPINIONES (SOCIAL PROOF) ═══════════ */}
      <section
        className="landing-social"
        id="opiniones"
      >
        <div className="landing-social__head">
          <p className="landing-block-label">Opiniones</p>
          <h2 className="landing-block-title">
            Lo que dicen
            <br />
            quienes <span className="out">piden</span>
          </h2>
        </div>

        <div className="landing-social__grid">
          <div className="landing-social__card">
            <p className="landing-social__quote">
              Pedimos 200 remeras con DTF para el evento y quedaron exactamente
              como las habíamos imaginado. La atención al detalle fue
              impresionante.
            </p>
            <div className="landing-social__author">
              <h3 className="landing-social__name">Martín López</h3>
              <span className="landing-social__role">
                Organizador de eventos · Mendoza
              </span>
            </div>
            <span className="landing-social__tag">DTF</span>
          </div>

          <div className="landing-social__card">
            <p className="landing-social__quote">
              Llevamos dos años con ITAP haciendo los uniformes del taller. La
              serigrafía no se despega ni después de mil lavadas. Oficio de
              verdad.
            </p>
            <div className="landing-social__author">
              <h3 className="landing-social__name">Carolina Ruiz</h3>
              <span className="landing-social__role">
                Taller mecánico · Guaymallén
              </span>
            </div>
            <span className="landing-social__tag">Serigrafía</span>
          </div>

          <div className="landing-social__card">
            <p className="landing-social__quote">
              Las bolsas de friselina que nos hicieron son parte de la
              identidad del local. Cada clienta se lleva una y nos pregunta de
              dónde son.
            </p>
            <div className="landing-social__author">
              <h3 className="landing-social__name">Florencia García</h3>
              <span className="landing-social__role">
                Boutique de ropa · Capital
              </span>
            </div>
            <span className="landing-social__tag">Friselina</span>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACTO ═══════════ */}
      <section
        className="landing-contact section-frame"
        id="contacto"
        data-num="06"
      >
        <div className="landing-contact__grid">
          <div>
            <p className="landing-block-label">Contacto</p>
            <h2 className="landing-block-title">
              Hablemos de tu<span className="out"> pedido</span>
            </h2>

            <div className="landing-contact__row">
              <span className="landing-contact__k">Email</span>
              <span className="landing-contact__v">
                <a href="mailto:itapimpresiones@gmail.com">
                itapimpresiones@gmail.com
              </a>
              </span>
            </div>
            <div className="landing-contact__row">
              <span className="landing-contact__k">Horario</span>
              <span className="landing-contact__v">
                Lunes a viernes, 9 a 18 hs
              </span>
            </div>
            <div className="landing-contact__row">
              <span className="landing-contact__k">Zona</span>
              <span className="landing-contact__v">
                Guaymallén, Mendoza — Gran Mendoza
              </span>
            </div>
          </div>

          <div className="landing-contact__cta">
            <p className="landing-block-intro">
              Contanos cantidad, producto y diseño. Te presupuestamos en menos
              de una hora hábil.
            </p>
            <a href="#contacto" className="landing-btn landing-btn--solid">
              Cotizar
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <img
          src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
          alt="ITAP Impresiones"
        />
        </div>
        <p className="landing-footer__copy">
          © {new Date().getFullYear()} ITAP Impresiones. Todos los derechos
          reservados.
        </p>
        <ul className="landing-footer__links">
          <li>
            <a href="#nosotros">Nosotros</a>
          </li>
          <li>
            <a href="#tecnicas">Técnicas</a>
          </li>
          <li>
            <a href="#catalogo">Catálogo</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
