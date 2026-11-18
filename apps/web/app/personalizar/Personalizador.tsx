'use client';

// Personalizador de camiseta (fase 1, só navegador): arte enviada ou texto, posicionada dentro da área de
// impressão real da frente (DTG), com conferência de qualidade, grade de tamanhos para pedidos de equipe e
// exportação do arquivo de impressão (PNG transparente, 300 dpi, no tamanho da área).
// Unidade do desenho: milímetro. A camiseta é uma ilustração; o que vale para a impressão é o arquivo.
import { useEffect, useMemo, useRef, useState } from 'react';

const AREA = { x: 180, y: 110, w: 240, h: 300 }; // área de impressão da frente, em mm (24 × 30 cm)
const DPI = 300;
const mmPx = (mm: number) => Math.round((mm / 25.4) * DPI);
const CORES = [
  { nome: 'Preto', hex: '#161616' },
  { nome: 'Branco', hex: '#F5F4F0' },
  { nome: 'Off-white', hex: '#ECE5D6' },
  { nome: 'Cinza mescla', hex: '#9C9C99' },
  { nome: 'Azul-marinho', hex: '#1E2A44' },
];
const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XG'] as const;
const MODELOS = ['Masculina', 'Feminina'] as const;
const FONTES = [
  { nome: 'Grotesca', css: 'var(--f-corpo)' },
  { nome: 'Bodoni', css: 'var(--f-display)' },
  { nome: 'Mono', css: 'var(--f-mono)' },
];
const CAMISETA = 'M210 30 Q300 92 390 30 L520 70 L600 232 L532 272 L500 214 L500 720 L100 720 L100 214 L68 272 L0 232 L80 70 Z';

type Arte = { src: string; pxW: number; pxH: number; nome: string };
type Camada = { x: number; y: number; w: number }; // canto superior esquerdo e largura, em mm, relativos à área

function familiaDe(css: string): string {
  const v = css.match(/var\((--[^)]+)\)/)?.[1];
  return (v && getComputedStyle(document.documentElement).getPropertyValue(v).trim()) || 'sans-serif';
}

export function Personalizador() {
  const [cor, setCor] = useState(CORES[0]);
  const [arte, setArte] = useState<Arte | null>(null);
  const [camada, setCamada] = useState<Camada>({ x: 40, y: 20, w: 160 });
  const [texto, setTexto] = useState('');
  const [fonte, setFonte] = useState(FONTES[0]);
  const [corTexto, setCorTexto] = useState('#F5F4F0');
  const [tamTexto, setTamTexto] = useState(22); // altura da letra, mm
  const [yTexto, setYTexto] = useState(250); // linha de base do texto, mm dentro da área
  const [grade, setGrade] = useState<Record<string, number>>({});
  const [aviso, setAviso] = useState('');
  const svg = useRef<SVGSVGElement>(null);
  const arrasto = useRef<{ dx: number; dy: number } | null>(null);

  const alt = arte ? camada.w * (arte.pxH / arte.pxW) : 0;
  const dpi = arte ? Math.round(arte.pxW / (camada.w / 25.4)) : 0;
  const total = Object.values(grade).reduce((s, n) => s + (n || 0), 0);
  const fora = arte && (camada.x < 0 || camada.y < 0 || camada.x + camada.w > AREA.w + 0.5 || camada.y + alt > AREA.h + 0.5);

  useEffect(() => { setCorTexto(cor.hex === '#F5F4F0' || cor.hex === '#ECE5D6' ? '#161616' : '#F5F4F0'); }, [cor]);

  function abrir(f: File) {
    if (!/^image\/(png|jpeg|svg\+xml|webp)$/.test(f.type)) { setAviso('Use PNG, JPG, WEBP ou SVG.'); return; }
    if (f.size > 25 * 1024 * 1024) { setAviso('Arquivo acima de 25 MB.'); return; }
    const r = new FileReader();
    r.onload = () => {
      const src = String(r.result);
      const img = new Image();
      img.onload = () => {
        const pxW = img.naturalWidth || 2000, pxH = img.naturalHeight || 2000;
        setArte({ src, pxW, pxH, nome: f.name });
        const w = Math.min(AREA.w * 0.7, (AREA.h * 0.6) * (pxW / pxH));
        setCamada({ x: (AREA.w - w) / 2, y: 20, w });
        setAviso('');
      };
      img.src = src;
    };
    r.readAsDataURL(f);
  }

  function ponto(e: React.PointerEvent) {
    const s = svg.current!; const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(s.getScreenCTM()!.inverse());
    return { x: q.x - AREA.x, y: q.y - AREA.y };
  }

  const qualidade = useMemo(() => {
    if (!arte) return null;
    if (arte.src.startsWith('data:image/svg')) return { nivel: 'ok', texto: 'Vetor (SVG): nítido em qualquer tamanho.' };
    if (dpi >= 200) return { nivel: 'ok', texto: `Resolução boa: ${dpi} dpi no tamanho escolhido.` };
    if (dpi >= 150) return { nivel: 'atencao', texto: `Resolução justa: ${dpi} dpi. Pode perder nitidez; use um arquivo maior se tiver.` };
    return { nivel: 'ruim', texto: `Resolução baixa: ${dpi} dpi. Vai sair borrado; diminua a arte ou envie um arquivo maior.` };
  }, [arte, dpi]);

  async function exportar() {
    const c = document.createElement('canvas');
    c.width = mmPx(AREA.w); c.height = mmPx(AREA.h);
    const g = c.getContext('2d')!;
    if (arte) {
      const img = new Image();
      await new Promise((ok, erro) => { img.onload = ok; img.onerror = erro; img.src = arte.src; });
      g.drawImage(img, mmPx(camada.x), mmPx(camada.y), mmPx(camada.w), mmPx(alt));
    }
    if (texto.trim()) {
      await document.fonts.ready;
      g.fillStyle = corTexto;
      g.textAlign = 'center';
      g.font = `${mmPx(tamTexto)}px ${familiaDe(fonte.css)}`;
      g.fillText(texto, mmPx(AREA.w / 2), mmPx(yTexto));
    }
    const a = document.createElement('a');
    a.download = `inflexo-personalizado-${cor.nome.toLowerCase().replace(/\s+/g, '-')}-${AREA.w / 10}x${AREA.h / 10}cm-300dpi.png`;
    a.href = c.toDataURL('image/png');
    a.click();
  }

  function resumo(): string {
    const linhas = Object.entries(grade).filter(([, n]) => n > 0).map(([k, n]) => `${k}: ${n}`);
    return [
      `Camiseta ${cor.nome}`,
      arte ? `Arte: ${arte.nome}, ${(camada.w / 10).toFixed(1)} × ${(alt / 10).toFixed(1)} cm, a ${(camada.y / 10).toFixed(1)} cm do topo da área` : 'Sem arte',
      texto.trim() ? `Texto: "${texto}" (${fonte.nome}, ${(tamTexto / 10).toFixed(1)} cm)` : '',
      `Grade (${total}): ${linhas.join(', ') || 'nenhuma'}`,
    ].filter(Boolean).join('\n');
  }

  return (
    <div className="pz">
      <div className="pz-palco">
        <svg ref={svg} viewBox="-20 0 640 740" role="img" aria-label={`Prévia da camiseta ${cor.nome}`}
          onPointerMove={(e) => { if (!arrasto.current) return; const p = ponto(e); setCamada((c) => ({ ...c, x: p.x - arrasto.current!.dx, y: p.y - arrasto.current!.dy })); }}
          onPointerUp={() => { arrasto.current = null; }} onPointerLeave={() => { arrasto.current = null; }}>
          <path d={CAMISETA} fill={cor.hex} stroke="#00000022" strokeWidth="2" />
          <path d="M210 30 Q300 92 390 30" fill="none" stroke="#00000033" strokeWidth="6" />
          <rect x={AREA.x} y={AREA.y} width={AREA.w} height={AREA.h} fill="none" stroke={cor.hex === '#161616' || cor.hex === '#1E2A44' ? '#ffffff55' : '#00000040'} strokeDasharray="6 6" />
          <svg x={AREA.x} y={AREA.y} width={AREA.w} height={AREA.h} overflow="hidden">
            {arte && (
              <image href={arte.src} x={camada.x} y={camada.y} width={camada.w} height={alt} preserveAspectRatio="none" style={{ cursor: 'move', touchAction: 'none' }}
                onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); const p = ponto(e); arrasto.current = { dx: p.x - camada.x, dy: p.y - camada.y }; }} />
            )}
            {texto.trim() && <text x={AREA.w / 2} y={yTexto} textAnchor="middle" fill={corTexto} style={{ fontFamily: fonte.css, fontSize: tamTexto }}>{texto}</text>}
          </svg>
        </svg>
        <p className="pz-nota">Prévia ilustrativa. A linha tracejada é a área de impressão da frente (24 × 30 cm). O arquivo de impressão sai no tamanho real.</p>
      </div>

      <div className="pz-painel">
        <fieldset><legend>Cor da malha</legend>
          <div className="pz-cores">{CORES.map((c) => (
            <button key={c.nome} type="button" aria-pressed={c.nome === cor.nome} title={c.nome} onClick={() => setCor(c)} style={{ background: c.hex }}><span className="sr-only">{c.nome}</span></button>
          ))}</div>
          <p className="pz-legenda">{cor.nome}</p>
        </fieldset>

        <fieldset><legend>Arte</legend>
          <label className="pz-arquivo">
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => e.target.files?.[0] && abrir(e.target.files[0])} />
            <span>{arte ? `Trocar arte (${arte.nome})` : 'Enviar arte: PNG transparente ou SVG'}</span>
          </label>
          {arte && <>
            <label className="pz-campo">Largura: {(camada.w / 10).toFixed(1)} cm
              <input type="range" min={20} max={AREA.w} step={1} value={Math.round(camada.w)} onChange={(e) => setCamada((c) => ({ ...c, w: Number(e.target.value) }))} />
            </label>
            <div className="pz-botoes">
              <button type="button" onClick={() => setCamada((c) => ({ ...c, x: (AREA.w - c.w) / 2 }))}>Centralizar</button>
              <button type="button" onClick={() => setCamada((c) => ({ ...c, y: 20 }))}>Alto do peito</button>
              <button type="button" onClick={() => setCamada({ x: AREA.w - 105, y: 10, w: 95 })}>Peito esquerdo</button>
            </div>
            {qualidade && <p className={`pz-qualidade pz-${qualidade.nivel}`}>{qualidade.texto}</p>}
            {fora && <p className="pz-qualidade pz-ruim">Parte da arte está fora da área de impressão e será cortada.</p>}
          </>}
          {aviso && <p className="pz-qualidade pz-ruim">{aviso}</p>}
        </fieldset>

        <fieldset><legend>Texto (opcional)</legend>
          <input className="pz-texto" type="text" maxLength={40} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ex.: Equipe 2026" />
          {texto.trim() && <>
            <div className="pz-botoes">{FONTES.map((f) => <button key={f.nome} type="button" aria-pressed={f.nome === fonte.nome} onClick={() => setFonte(f)} style={{ fontFamily: f.css }}>{f.nome}</button>)}</div>
            <label className="pz-campo">Tamanho: {(tamTexto / 10).toFixed(1)} cm<input type="range" min={8} max={60} value={tamTexto} onChange={(e) => setTamTexto(Number(e.target.value))} /></label>
            <label className="pz-campo">Altura na área<input type="range" min={20} max={AREA.h} value={yTexto} onChange={(e) => setYTexto(Number(e.target.value))} /></label>
            <div className="pz-botoes">{['#F5F4F0', '#161616', '#B18A35'].map((h) => <button key={h} type="button" aria-pressed={corTexto === h} onClick={() => setCorTexto(h)} style={{ background: h, width: 32 }}><span className="sr-only">{h}</span></button>)}</div>
          </>}
        </fieldset>

        <fieldset><legend>Quantidades por tamanho</legend>
          <table className="pz-grade"><thead><tr><th />{TAMANHOS.map((t) => <th key={t}>{t}</th>)}</tr></thead>
            <tbody>{MODELOS.map((m) => (
              <tr key={m}><th>{m}</th>{TAMANHOS.map((t) => (
                <td key={t}><input type="number" min={0} max={500} inputMode="numeric" aria-label={`${m} ${t}`} value={grade[`${m} ${t}`] || ''}
                  onChange={(e) => setGrade((g) => ({ ...g, [`${m} ${t}`]: Math.max(0, Math.min(500, Number(e.target.value) || 0)) }))} /></td>
              ))}</tr>
            ))}</tbody></table>
          <p className="pz-legenda">Total: {total} {total === 1 ? 'camiseta' : 'camisetas'}</p>
        </fieldset>

        <div className="pz-acoes">
          <button type="button" className="i-botao" disabled={!arte && !texto.trim()} onClick={exportar}>Baixar arquivo de impressão</button>
          <button type="button" className="i-link" disabled={!arte && !texto.trim()} onClick={() => navigator.clipboard?.writeText(resumo()).then(() => setAviso('Resumo copiado.'))}>Copiar resumo do pedido</button>
        </div>
        <p className="pz-legenda">O pagamento pelo site vem na próxima etapa. Por enquanto, envie o arquivo e o resumo para pedidos@inflexo.com.br.</p>
      </div>
    </div>
  );
}
