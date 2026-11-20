'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Foto } from '../lib/galeria';

/** Fotografia primeiro; a arte selecionada permanece disponível para conferência. */
export function GaleriaProduto({ fotos, nome, children }: { fotos: Foto[]; nome: string; children: ReactNode }) {
  const [indice, setIndice] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const foto = fotos[indice];

  return <div className="galeria">
    {foto && <>
      <figure className="galeria-principal">
        <button type="button" className="galeria-ampliar" aria-label={`Ampliar imagem de ${nome}`} onClick={() => dialog.current?.showModal()}>
          <img src={foto.src} alt={`${nome}: ${foto.legenda}`} width={1024} height={1024} fetchPriority="high" />
          <span>Ampliar ↗</span>
        </button>
        <figcaption>{foto.legenda}. Cena gerada por IA com a arte aplicada; confira o tema e o tamanho na prévia.</figcaption>
      </figure>
      {fotos.length > 1 && <div className="galeria-miniaturas" role="group" aria-label="Fotografias da peça">
        {fotos.map((f, i) => <button type="button" key={f.src} aria-pressed={indice === i} aria-label={`Ver foto: ${f.legenda}`} onClick={() => setIndice(i)}><img src={f.src} alt="" width={96} height={96} loading="lazy" /></button>)}
      </div>}
      <dialog ref={dialog} className="galeria-dialog" aria-label={`Imagem ampliada de ${nome}`} onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div><button autoFocus type="button" className="galeria-fechar" onClick={() => dialog.current?.close()}>Fechar ×</button><img src={foto.src} alt={`${nome}: ${foto.legenda}`} width={1600} height={1600} /></div>
      </dialog>
    </>}
    {foto ? <details className="galeria-tecnica"><summary>Ver a arte no tema e tamanho selecionados</summary>{children}</details> : children}
  </div>;
}
