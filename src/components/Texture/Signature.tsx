import { cn } from "@/lib/utils";

/**
 * Genera un ID determinístico basado en las props del componente.
 * Evita problemas de hidratación al ser determinístico.
 */
function generatePatternId(props: Record<string, unknown>): string {
  const str = JSON.stringify(props);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `halftone-${Math.abs(hash).toString(36)}`;
}

/**
 * HalftonePattern — firma "Serigrafía artesanal".
 * Patrón de trama serigráfica a pantalla completa con puntos de tamaño
 * variable (fade radial). Se usa como textura de fondo o overlay.
 */
export function HalftonePattern({
  className,
  maxDot = 8,
  gap = 24,
  opacity,
  color = "currentColor",
  variant = "radial", // "radial" | "grid" | "organic"
}: {
  className?: string;
  maxDot?: number;
  gap?: number;
  opacity?: number;
  color?: string;
  variant?: "radial" | "grid" | "organic";
}) {
  const patternId = generatePatternId({ maxDot, gap, variant, color });
  const rows = 10;
  const cols = 10;
  const dots = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let radius = maxDot * 0.4;
      if (variant === "radial") {
        const dist = Math.sqrt(
          Math.pow((c - (cols - 1) / 2) / (cols / 2), 2) +
            Math.pow((r - (rows - 1) / 2) / (rows / 2), 2)
        );
        radius = Math.max(0.6, maxDot * (1.1 - dist * 0.65));
      } else if (variant === "organic") {
        const seed = r * 31 + c * 17;
        const rand = (Math.sin(seed) * 10000) % 1;
        radius = Math.max(0.5, maxDot * (0.4 + rand * 0.7));
      }

      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={(c + 0.5) * gap}
          cy={(r + 0.5) * gap}
          r={radius}
          fill={color}
        />
      );
    }
  }

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      style={opacity !== undefined ? { opacity } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={patternId}
          width={gap * cols}
          height={gap * rows}
          patternUnits="userSpaceOnUse"
        >
          {dots}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * RegistrationMark — marca de registro de impresión offset/serigrafía.
 * La cruz + círculo que los impresores usan para alinear pantallas.
 * Disponible en varias variantes gráficas.
 */
export function RegistrationMark({
  className,
  size = 16,
  color = "currentColor",
  variant = "standard", // "standard" | "heavy" | "outline" | "corner"
}: {
  className?: string;
  size?: number;
  color?: string;
  variant?: "standard" | "heavy" | "outline" | "corner";
}) {
  const strokeWidth =
    variant === "heavy" ? 2.5 : variant === "outline" ? 1.2 : 1.8;
  const circleR = variant === "heavy" ? 9 : 7;
  const crossLen = variant === "corner" ? 14 : 10;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color, strokeWidth }}
    >
      <circle
        cx="12"
        cy="12"
        r={circleR}
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d={`M12 ${12 - crossLen}v${crossLen * 2}M${12 - crossLen} 12h${crossLen * 2}`}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {variant === "corner" && (
        <>
          <line
            x1="3"
            y1="3"
            x2="6"
            y2="6"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="18"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

/**
 * InkSplash — salpicadura de tinta orgánica para acentos dinámicos.
 */
export function InkSplash({
  className,
  color = "#E01358",
  scale = 1,
}: {
  className?: string;
  color?: string;
  scale?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      width={120 * scale}
      height={100 * scale}
      viewBox="0 0 120 100"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20,50 Q30,30 45,40 Q55,25 70,40 Q85,55 75,70 Q60,85 45,70 Q30,55 20,50 Z"
        opacity="0.15"
      />
      <path
        d="M60,20 Q75,10 90,25 Q100,35 85,50 Q70,65 55,55 Q40,40 60,20 Z"
        opacity="0.1"
      />
      <path
        d="M85,70 Q100,60 110,80 Q95,95 80,90 Q65,75 85,70 Z"
        opacity="0.08"
      />
    </svg>
  );
}
