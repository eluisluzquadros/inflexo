import type { Ref } from 'react';

/** Logotipo: INFLE + X de duas trajetórias + O. O ponto dourado pode ser ocultado (a página inicial o traz voando). */
export function Marca({ semPonto = false, xRef, className = '' }: { semPonto?: boolean; xRef?: Ref<SVGSVGElement>; className?: string }) {
  return (
    <span className={`marca ${className}`} aria-label="INFLEXO">
      <span aria-hidden="true">INFLE</span>
      <svg ref={xRef} className="marca-x" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M10 2 C 38 22, 62 78, 90 98" fill="none" stroke="currentColor" strokeWidth="17" />
        <path d="M10 98 C 38 78, 62 22, 90 2" fill="none" stroke="currentColor" strokeWidth="3.2" />
        {!semPonto && <circle cx="50" cy="50" r="7.5" className="marca-ponto" />}
      </svg>
      <span aria-hidden="true">O</span>
    </span>
  );
}
