import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { renderEstudo } from '../../../packages/render/src/estudos.mjs';
import { HORAS_ANTES, LIMIAR_CONTADOR, TIRAGEM_FIOS, tamanhoDaFila } from '../lib/fila';
import './casa.css';
import './inicio.css';

// Coleção 01, à venda: categorias (só texto) e uma peça de cada suporte
// (fotos de estúdio geradas por IA com a arte real aplicada)
const CATEGORIAS = [
  { nome: 'Quadros', href: '/loja?suporte=quadro' },
  { nome: 'Pôsteres', href: '/loja?suporte=poster' },
  { nome: 'Digital', href: '/loja?suporte=digital' },
  { nome: 'Camiseta', href: '/loja?suporte=camiseta' },
];
const PRODUTOS: { nome: string; linha: string; foto: string; href: string; selo?: string }[] = [
  { nome: 'Fios', linha: 'Quadro · carvalho · A3 ou A2', foto: '/casa/fios.jpg', href: '/produto/quadro?estilo=fios', selo: `Tiragem de ${TIRAGEM_FIOS}` },
  { nome: 'Gravura', linha: 'Quadro ou pôster · A3 ou A2', foto: '/casa/gravura.jpg', href: '/produto/quadro?estilo=gravura' },
  { nome: 'Arquivo digital', linha: 'Stories, fundo de tela e A2', foto: '/casa/digital.jpg', href: '/produto/arquivo-digital' },
  { nome: 'Camiseta', linha: 'Algodão branco · a Gravura no peito', foto: '/casa/camiseta.jpg', href: '/produto/camiseta' },
];

function SetaLoja() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" className="h-seta"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'INFLEXO · A estética do movimento.' },
  description: 'Arte, ciência e memória. Quadros, pôsteres e camisetas desenhados por dados públicos, e as próximas coleções da INFLEXO: Inflexões, Órbitas e Movimentos.',
};

function Seta() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg>;
}

function Estudo({ tipo, id, escuro = false }: { tipo: 'inflexao' | 'orbita'; id: string; escuro?: boolean }) {
  return <div className="i-estudo" dangerouslySetInnerHTML={{ __html: renderEstudo(tipo, { id, escuro }) }} />;
}

export default async function Inicio({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const numero = typeof q.fila === 'string' ? Number(q.fila) : 0;
  const posicao = Number.isSafeInteger(numero) && numero > 0 ? numero : 0;
  const total = await tamanhoDaFila();

  return (
    <div className="inicio">
      <section className="i-hero" aria-labelledby="i-titulo">
        <Image className="i-ambiente" src="/hero/ambiente-premium.webp" alt="" fill sizes="100vw" preload />
        <div className="i-hero-conteudo">
          <p className="i-sobretitulo"><span /> Arte, ciência e memória</p>
          <h1 id="i-titulo">A estética<br />do movimento.</h1>
          <p className="i-introducao">O universo, a Terra e as histórias que nos transformam. Arte para vestir, habitar e guardar o que importa.</p>
          <div className="i-acoes">
            <a className="i-botao" href="#disponivel">Ver as peças <Seta /></a>
            <a className="i-link" href="#colecoes">Conhecer as coleções</a>
          </div>
          <p className="i-hero-assinatura">Um novo olhar para os pontos de mudança.</p>
        </div>
        <div className="i-hero-cena">
          <figure className="i-hero-obra">
            <div className="i-moldura"><Estudo tipo="inflexao" id="hero-inflexao" /></div>
            <figcaption className="sr-only">Inflexões · estudo matemático de composição</figcaption>
          </figure>
          <Image className="i-hero-modelos" src="/inicio/modelos.webp" alt="Nossos dois modelos com moletons pretos INFLEXO e calças claras, diante do quadro Inflexões." width={1161} height={1355} sizes="(max-width: 820px) 85vw, 46vw" preload />
        </div>
        <p className="i-credito">Modelos e ambiente gerados por IA. Quadro: estudo matemático de composição.</p>
      </section>

      <nav className="i-indice i-largura" aria-label="Explorar as coleções">
        <a href="#inflexoes"><span>01</span> Inflexões <Seta /></a>
        <a href="#orbitas"><span>02</span> Órbitas <Seta /></a>
        <a href="#movimentos"><span>03</span> Movimentos <Seta /></a>
      </nav>

      {/* Coleção 01, à venda: categorias, peças e o banner escuro da coleção (estilos de casa.css) */}
      <div className="casa">
        <section id="disponivel" className="h-secao h-largura" aria-labelledby="h-disponivel">
          <header className="h-cabeca">
            <h2 id="h-disponivel">Disponível agora</h2>
            <Link className="h-link" href="/loja">Ver a loja inteira <SetaLoja /></Link>
          </header>
          <nav className="i-categorias" aria-label="Comprar por categoria">
            {CATEGORIAS.map((c) => <Link key={c.nome} href={c.href}>{c.nome}</Link>)}
          </nav>
          <ul className="h-produtos">
            {PRODUTOS.map((p) => (
              <li key={p.nome}>
                <Link href={p.href} className="h-produto">
                  <span className="h-produto-foto">
                    <img src={p.foto} alt={`${p.nome}, ${p.linha}`} width={1024} height={1024} loading="lazy" />
                    {p.selo && <span className="h-selo">{p.selo}</span>}
                  </span>
                  <span className="h-produto-info">
                    <span className="h-produto-nome">{p.nome}</span>
                    <span className="h-produto-linha">{p.linha}</span>
                    <span className="h-produto-preco">Preço na abertura da venda</span>
                  </span>
                  <span className="h-circulo h-produto-acao"><SetaLoja /></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="h-nota-secao">Fotos de estúdio geradas por IA com as artes reais aplicadas.</p>
        </section>

        <section className="h-banner h-largura" aria-labelledby="h-banner-titulo">
          <img className="h-banner-foto" src="/casa/banner.jpg" alt="" width={2400} height={1344} loading="lazy" />
          <div className="h-banner-texto">
            <p className="h-linha-fina">Coleção 01 · A Geografia da Virada</p>
            <h2 id="h-banner-titulo">Duas linhas,<br />uma virada.</h2>
            <p>Duas curvas correm a noite inteira, se aproximam e se cruzam às 20h23 para não se separar mais. O desenho é a série pública somada na ordem em que chegou e conferida com a fonte, sem nenhum ponto inventado.</p>
            <div className="h-acoes">
              <Link className="h-botao h-botao-branco" href="/colecao/a-geografia-da-virada">Ver a coleção <SetaLoja /></Link>
              <Link className="h-link h-link-claro" href="/metodo">Como medimos</Link>
            </div>
          </div>
        </section>
      </div>

      <section id="colecoes" className="i-secao i-largura" aria-labelledby="i-colecoes-titulo">
        <header className="i-cabeca">
          <div><p className="i-sobretitulo">As próximas histórias</p><h2 id="i-colecoes-titulo">O que muda merece<br /><em>ser visto.</em></h2></div>
          <p>Três coleções, três formas de pensar:<br />crítica, complexa e criativa. Em desenvolvimento, com pesquisa antes da forma.</p>
        </header>
        <div className="i-colecoes">
          <article id="inflexoes" className="i-colecao">
            <div className="i-colecao-visual i-visual-inflexao"><Estudo tipo="inflexao" id="colecao-inflexao" /></div>
            <div className="i-colecao-topo"><span>01 / Inflexões</span><span className="i-status">Em pesquisa</span></div>
            <p className="i-sobretitulo">Pensamento crítico</p>
            <h3>Quando o ritmo muda.</h3>
            <p>Os pontos de mudança na Terra e na humanidade, a partir de séries públicas. Para olhar com atenção: o que mudou, quando, e como sabemos.</p>
            <a className="i-link" href="#fecho">Acompanhar a coleção <Seta /></a>
          </article>
          <article id="orbitas" className="i-colecao">
            <div className="i-colecao-visual i-visual-orbita"><Estudo tipo="orbita" id="colecao-orbita" escuro /></div>
            <div className="i-colecao-topo"><span>02 / Órbitas</span><span className="i-status">Em pesquisa</span></div>
            <p className="i-sobretitulo">Pensamento complexo</p>
            <h3>O tempo visto do céu.</h3>
            <p>Ciclos, trajetórias e sistemas que se influenciam. Uma linha dedicada ao universo, para pensar o todo: nada se move sozinho.</p>
            <a className="i-link" href="#fecho">Acompanhar a coleção <Seta /></a>
          </article>
          <article id="movimentos" className="i-colecao">
            <div className="i-colecao-visual i-visual-momento">
              <div className="i-momento-papel"><span className="i-momento-label">Em movimento</span><p>Ritmo.<br />Gesto.<br /><em>Invenção.</em></p><span className="i-momento-ponto" /><span className="i-momento-marca">INFLEXO</span></div>
            </div>
            <div className="i-colecao-topo"><span>03 / Movimentos</span><span className="i-status">Em desenvolvimento</span></div>
            <p className="i-sobretitulo">Pensamento criativo</p>
            <h3>O gesto que vira forma.</h3>
            <p>O movimento de pessoas, de ideias e da própria mão que desenha. Para criar a partir do que muda.</p>
            <a className="i-link" href="#fecho">Acompanhar a coleção <Seta /></a>
          </article>
        </div>
        <p className="i-nota">Os estudos mostram a direção visual das coleções. A curva logística e a órbita idealizada são modelos matemáticos, não séries históricas nem posições reais de astros.</p>
      </section>

      <section id="a-inflexo" className="i-manifesto i-largura" aria-labelledby="i-manifesto-titulo">
        <p className="i-sobretitulo">A INFLEXO</p>
        <h2 id="i-manifesto-titulo">Há beleza no instante<br />em que algo <em>muda.</em></h2>
        <p>Uma curva muda de direção. Um ciclo recomeça. Uma história ganha outro sentido. É desse encontro entre forma, tempo e memória que nasce a INFLEXO.</p>
      </section>

      <section className="i-formatos i-largura" aria-labelledby="i-formatos-titulo">
        <header className="i-cabeca">
          <div><p className="i-sobretitulo">Da ideia ao cotidiano</p><h2 id="i-formatos-titulo">Vestir. Habitar. Guardar.</h2></div>
          <p>O mesmo olhar, em diferentes suportes.<br />Aplicações em estudo para as próximas coleções.</p>
        </header>
        <div className="i-formatos-grade">
          <article className="i-formato i-formato-vestir">
            <div className="i-formato-imagem"><Image src="/inicio/modelos.webp" alt="Dois modelos com moletons pretos INFLEXO e calças claras; aplicação da marca em estudo." width={1161} height={1355} sizes="(max-width: 720px) 100vw, 33vw" /></div>
            <div><span>01 / Vestir</span><h3>Arte que acompanha.</h3><p>Camisetas e peças para levar a ideia com você.</p></div>
          </article>
          <article className="i-formato i-formato-habitar">
            <div className="i-formato-imagem"><div className="i-mini-moldura"><Estudo tipo="inflexao" id="formato-habitar" /></div></div>
            <div><span>02 / Habitar</span><h3>Um novo ponto de vista.</h3><p>Quadros e pôsteres que abrem espaço para contemplar.</p></div>
          </article>
          <article className="i-formato i-formato-guardar">
            <div className="i-formato-imagem"><div className="i-digital"><div className="i-digital-camera" /><Estudo tipo="orbita" id="formato-digital" escuro /></div></div>
            <div><span>03 / Guardar</span><h3>Memória por perto.</h3><p>Arte digital para os lugares onde sua vida acontece.</p></div>
          </article>
        </div>
        <p className="i-nota">Modelos e ambientes ilustrativos. A camiseta, os quadros, os pôsteres e o arquivo digital da Coleção 01 já estão na loja; moletom e boné estão em estudo.</p>
      </section>

      <section id="processo" className="i-processo" aria-labelledby="i-processo-titulo">
        <div className="i-largura i-processo-grade">
          <div><p className="i-sobretitulo">O nosso compromisso</p><h2 id="i-processo-titulo">A forma segue<br /><em>o dado.</em></h2><p>A pesquisa vem primeiro. Cada coleção terá suas fontes, suas escolhas de desenho e uma explicação do que a peça representa.</p></div>
          <ol>
            <li><span>01</span><div><h3>Encontrar uma história.</h3><p>Uma pergunta que mereça ser vista, apoiada por uma fonte identificável.</p></div></li>
            <li><span>02</span><div><h3>Deixar a série desenhar.</h3><p>O traçado acompanha o dado. A composição não impõe a mesma forma a todos os assuntos.</p></div></li>
            <li><span>03</span><div><h3>Mostrar como foi feito.</h3><p>Separar medição, modelo e escolha estética. A fonte e o método acompanham a peça.</p></div></li>
          </ol>
        </div>
      </section>

      <section id="fecho" className="i-fila i-largura" aria-labelledby="i-fila-titulo">
        <div>
          <p className="i-sobretitulo">As próximas mudanças, em primeira mão</p>
          <h2 id="i-fila-titulo">{posicao ? `Você é o nº ${posicao.toLocaleString('pt-BR')} da lista.` : <>Faça parte<br />do que vem.</>}</h2>
          <p>Receba as novidades das coleções e o aviso quando as primeiras peças estiverem prontas. Na abertura, a lista terá {HORAS_ANTES} horas de acesso antecipado.{total >= LIMIAR_CONTADOR && <> Já são <strong>{total.toLocaleString('pt-BR')}</strong> pessoas na lista.</>}</p>
        </div>
        {posicao ? <p className="i-fila-ok" role="status">Inscrição registrada. As novidades e o acesso antecipado chegam no e-mail cadastrado.</p> : (
          <form className="i-formulario" method="post" action="/api/lista">
            <input type="hidden" name="produto" value="colecao" />
            <input type="hidden" name="escolha" value="home-inflexoes" />
            <label htmlFor="i-email">Seu e-mail</label>
            <div className="i-formulario-linha"><input id="i-email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="voce@email.com" /><button className="i-botao" type="submit">Quero acompanhar <Seta /></button></div>
            <label className="i-consentimento" htmlFor="i-consentimento"><input id="i-consentimento" name="consentimento" type="checkbox" required value="sim" /><span>Aceito receber da INFLEXO as novidades das coleções, o aviso de abertura e o acesso antecipado. Posso pedir a exclusão a qualquer momento.</span></label>
          </form>
        )}
      </section>
    </div>
  );
}
