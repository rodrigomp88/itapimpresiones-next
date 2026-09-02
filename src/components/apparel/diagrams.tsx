'use client';

export function ToteBagDiagram({ fillColor, ...props }: React.SVGProps<SVGSVGElement> & { fillColor?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Body */}
      <path d="M 50,70 H 150 V 170 H 50 Z" fill={fillColor || 'none'} className={fillColor ? 'transition-colors duration-300' : undefined} />
      {/* Handles */}
      <path d="M 80,70 C 80,40 90,30 100,30 C 110,30 120,40 120,70" />
       {/* Stitching Details */}
      <path d="M 50,165 H 150" strokeDasharray="2 2" strokeWidth="0.8" />
    </svg>
  );
}

export function KidneyBagDiagram({ fillColor, ...props }: React.SVGProps<SVGSVGElement> & { fillColor?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Body */}
      <path d="M 50,70 H 150 V 170 H 50 Z" fill={fillColor || 'none'} className={fillColor ? 'transition-colors duration-300' : undefined} />
      {/* Handle */}
      <path d="M 80,85 C 80,75, 120,75, 120,85" />

       {/* Stitching Details */}
      <path d="M 50,165 H 150" strokeDasharray="2 2" strokeWidth="0.8" />
    </svg>
  );
}