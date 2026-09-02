const fs = require("fs");

let svg = fs.readFileSync("public/images/brand/isotipo.svg", "utf8");

const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
let inner = match[1];

inner = inner
  .replace(/class="fil0"/g, 'data-ink="paper"')
  .replace(/class="fil1"/g, 'data-ink="raspberry"')
  .replace(/class="fil2"/g, 'data-ink="ocean"')
  .replace(/class="fil3"/g, 'data-ink="mist"')
  .replace(/<defs>[\s\S]*?<\/defs>/, "")
  .replace(/<metadata[\s\S]*?<\/metadata>/, "")
  .replace(/<\?xml[\s\S]*?\?>/, "");

const header = `"use client";

/**
 * IsotipoSVG — El ave de ITAP, generada automáticamente desde el SVG
 * original de marca (public/images/brand/isotipo.svg).
 * Las tintas vienen separadas por data-ink: "paper" (blanco), "ocean",
 * "mist", "raspberry". La animacion de pasadas vive en globals.css.
 * NO editar a mano — regenerar con scripts-gen/svg-to-tsx.js
 */

export default function IsotipoSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1067.51 1084.19"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >`;

const footer = `    </svg>
  );
}
`;

fs.mkdirSync("src/components/IsotipoAnimado", { recursive: true });
fs.writeFileSync(
  "src/components/IsotipoAnimado/IsotipoSVG.tsx",
  header + "\n" + inner + "\n" + footer
);

const tsx = fs.readFileSync("src/components/IsotipoAnimado/IsotipoSVG.tsx", "utf8");
console.log("paper:", (tsx.match(/data-ink="paper"/g) || []).length);
console.log("ocean:", (tsx.match(/data-ink="ocean"/g) || []).length);
console.log("mist:", (tsx.match(/data-ink="mist"/g) || []).length);
console.log("raspberry:", (tsx.match(/data-ink="raspberry"/g) || []).length);
