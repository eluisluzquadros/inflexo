import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { renderEstudo } from '../../../packages/render/src/estudos.mjs';
import { renderBambuCanonico } from '../../../packages/render/src/bambuCanonico.mjs';
import { HORAS_ANTES, LIMIAR_CONTADOR, tamanhoDaFila } from '../lib/fila';
import { INTERESSES, STATUS_LOJA } from '../lib/lancamento';
import './casa.css';
import './inicio.css';

// Estudos do lançamento. As imagens indicam a direção visual; não são ofertas de venda.
const CATEGORIAS = [
  { nome: 'Quadros', href: '/loja?suporte=quadro' },
  { nome: 'Pôsteres', href: '/loja?suporte=poster' },
  { nome: 'Digital', href: '/loja?suporte=digital' },
  { nome: 'Vestuário', href: '/?interesse=home-vestuario#fecho' },
];
const PRODUTOS = [
  { nome: 'Nós no tempo', linha: 'Estudo para quadro · Inflexões', tipo: 'quadro', href: '#inflexoes' },
  { nome: 'Órbitas', linha: 'Estudo para pôster', tipo: 'poster', href: '#orbitas' },
  { nome: 'Moletom INFLEXO', linha: 'Estudo de vestuário', tipo: 'vestuario', href: '/?interesse=home-vestuario#fecho' },
  { nome: 'Órbitas · Digital', linha: 'Estudo de arte digital', tipo: 'digital', href: '#orbitas' },
];

function SetaLoja() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" className="h-seta"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'INFLEXO · A estética do movimento.' },
  description: 'Em breve. Arte para vestir, habitar e guardar. Conheça os estudos das coleções Inflexões, Órbitas e Movimentos e acompanhe o lançamento da INFLEXO.',
};

function Seta() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg>;
}

function Estudo({ tipo, id, escuro = false }: { tipo: 'inflexao' | 'orbita'; id: string; escuro?: boolean }) {
  return <div className="i-estudo" dangerouslySetInnerHTML={{ __html: tipo === 'inflexao' ? renderBambuCanonico({ id }) : renderEstudo(tipo, { id, escuro }) }} />;
}

export default async function Inicio({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const numero = typeof q.fila === 'string' ? Number(q.fila) : 0;
  const posicao = Number.isSafeInteger(numero) && numero > 0 ? numero : 0;
  const total = await tamanhoDaFila();
  const interesse = typeof q.interesse === 'string' && INTERESSES.some((i) => i.id === q.interesse) ? q.interesse : 'home-inflexoes';

  return (
    <div className="inicio">
      <section className="i-hero" aria-labelledby="i-titulo">
        <Image className="i-ambiente" src="/hero/ambiente-premium-v2.webp" alt="" fill sizes="100vw" preload />
        <div className="i-hero-conteudo">
          <p className="i-sobretitulo"><span /> {STATUS_LOJA} · Arte, ciência e memória</p>
          <h1 id="i-titulo">A estética<br />do movimento.</h1>
          <p className="i-introducao">O universo, a Terra e as histórias que nos transformam. Arte para vestir, habitar e guardar o que importa.</p>
          <div className="i-acoes">
            <a className="i-botao" href="#pecas">Explorar as peças <Seta /></a>
            <a className="i-link" href="#fecho">Avise-me no lançamento</a>
          </div>
          <p className="i-hero-assinatura">Um novo olhar para os pontos de mudança.</p>
        </div>
        <div className="i-hero-cena">
          <figure className="i-hero-obra">
            <div className="i-moldura"><Estudo tipo="inflexao" id="hero-inflexao" /></div>
            <figcaption className="sr-only">Inflexões · Nós no tempo · composição autoral inspirada no bambu</figcaption>
          </figure>
          <Image className="i-hero-modelos" src="/inicio/modelos.webp" alt="Nossos dois modelos com moletons pretos INFLEXO e calças claras, diante do quadro Nós no tempo." width={1161} height={1355} sizes="(max-width: 820px) 85vw, 46vw" preload />
        </div>
        <p className="i-credito">Modelos e ambiente gerados por IA. Quadro: Nós no tempo, composição autoral com desenho assistido por IA.</p>
      </section>

      {/* Prévia dos suportes do lançamento, sem dados ou imagens da coleção eleitoral. */}
      <div className="casa">
        <section id="pecas" className="h-secao h-largura" aria-labelledby="h-pecas">
          <header className="h-cabeca">
            <div><p className="i-sobretitulo">Um primeiro olhar · {STATUS_LOJA}</p><h2 id="h-pecas">Arte para fazer parte.</h2></div>
            <Link className="h-link" href="/loja">Explorar o catálogo <SetaLoja /></Link>
          </header>
          <nav className="i-categorias" aria-label="Explorar por categoria">
            {CATEGORIAS.map((c) => <Link key={c.nome} href={c.href}>{c.nome}</Link>)}
          </nav>
          <ul className="h-produtos">
            {PRODUTOS.map((p) => (
              <li key={p.nome}>
                <Link href={p.href} className="h-produto">
                  <span className={`h-produto-foto i-previa i-previa-${p.tipo}`}>
                    {p.tipo === 'vestuario' ? <Image src="/inicio/modelos.webp" alt="Modelos com o moletom INFLEXO, estudo de vestuário" width={1161} height={1355} sizes="(max-width: 620px) 45vw, 24vw" /> : p.tipo === 'quadro' ? <span className="i-mini-moldura"><Estudo tipo="inflexao" id="peca-inflexoes" /></span> : p.tipo === 'digital' ? <span className="i-digital"><span className="i-digital-camera" /><Estudo tipo="orbita" id="peca-digital" escuro /></span> : <span className="i-papel-poster"><Estudo tipo="orbita" id="peca-orbitas" escuro /></span>}
                    <span className="h-selo">{STATUS_LOJA}</span>
                  </span>
                  <span className="h-produto-info">
                    <span className="h-produto-nome">{p.nome}</span>
                    <span className="h-produto-linha">{p.linha}</span>
                    <span className="h-produto-preco">Conhecer o estudo</span>
                  </span>
                  <span className="h-circulo h-produto-acao"><SetaLoja /></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="h-nota-secao">Estudos visuais do lançamento. Modelos gerados por IA; produtos, materiais e preços serão apresentados na abertura.</p>
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
            <div className="i-colecao-topo"><span>01 / Inflexões</span><span className="i-status">{STATUS_LOJA}</span></div>
            <p className="i-sobretitulo">Pensamento crítico</p>
            <h3>Quando o ritmo muda.</h3>
            <p>Os marcos que transformam uma história. A continuidade do ramo, seus nós e suas bifurcações dão forma ao tempo: a mesma silhueta, diferentes enredos.</p>
            <Link className="i-link" href="/?interesse=home-colecao-inflexoes#fecho">Acompanhar a coleção <Seta /></Link>
          </article>
          <article id="orbitas" className="i-colecao">
            <div className="i-colecao-visual i-visual-orbita"><Estudo tipo="orbita" id="colecao-orbita" escuro /></div>
            <div className="i-colecao-topo"><span>02 / Órbitas</span><span className="i-status">{STATUS_LOJA}</span></div>
            <p className="i-sobretitulo">Pensamento complexo</p>
            <h3>O tempo visto do céu.</h3>
            <p>Ciclos, trajetórias e sistemas que se influenciam. Uma linha dedicada ao universo, para pensar o todo: nada se move sozinho.</p>
            <Link className="i-link" href="/?interesse=home-colecao-orbitas#fecho">Acompanhar a coleção <Seta /></Link>
          </article>
          <article id="movimentos" className="i-colecao">
            <div className="i-colecao-visual i-visual-momento">
              <div className="i-momento-papel"><span className="i-momento-label">Em movimento</span><p>Ritmo.<br />Gesto.<br /><em>Invenção.</em></p><span className="i-momento-ponto" /><span className="i-momento-marca">INFLEXO</span></div>
            </div>
            <div className="i-colecao-topo"><span>03 / Movimentos</span><span className="i-status">{STATUS_LOJA}</span></div>
            <p className="i-sobretitulo">Pensamento criativo</p>
            <h3>O gesto que vira forma.</h3>
            <p>O movimento de pessoas, de ideias e da própria mão que desenha. Para criar a partir do que muda.</p>
            <Link className="i-link" href="/?interesse=home-colecao-movimentos#fecho">Acompanhar a coleção <Seta /></Link>
          </article>
        </div>
        <p className="i-nota">Nós no tempo é uma composição simbólica inspirada no bambu. Órbitas apresenta uma elipse idealizada. Os estudos não representam séries históricas nem posições reais de astros.</p>
      </section>

      <section className="i-formatos i-largura" aria-labelledby="i-formatos-titulo">
        <header className="i-cabeca">
          <div><p className="i-sobretitulo">Da ideia ao cotidiano</p><h2 id="i-formatos-titulo">Vestir. Habitar. Guardar.</h2></div>
          <p>O mesmo olhar, em diferentes suportes.<br />Aplicações em estudo para as próximas coleções.</p>
        </header>
        <div className="i-formatos-grade">
          <article className="i-formato i-formato-vestir">
            <div className="i-formato-imagem"><Image src="/inicio/modelos.webp" alt="Dois modelos com moletons pretos INFLEXO e calças claras; aplicação da marca em estudo." width={1161} height={1355} sizes="(max-width: 720px) 100vw, 33vw" /></div>
            <div><span>01 / Vestir</span><h3>Arte que acompanha.</h3><p>Camisetas e peças para levar a ideia com você.</p><Link className="i-link" href="/?interesse=home-vestuario#fecho">Acompanhar o vestuário <Seta /></Link></div>
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
        <p className="i-nota">Todos os suportes estão em estudo e chegam em breve. As imagens ilustram a direção visual da marca.</p>
      </section>

      <section id="processo" className="i-processo" aria-labelledby="i-processo-titulo">
        <div className="i-largura i-processo-grade">
          <div><p className="i-sobretitulo">O nosso compromisso</p><h2 id="i-processo-titulo">Uma história.<br /><em>Uma forma de ver.</em></h2><p>A pesquisa vem primeiro. Cada coleção terá suas referências, suas escolhas de desenho e uma explicação do que a peça representa.</p></div>
          <ol>
            <li><span>01</span><div><h3>Encontrar uma história.</h3><p>Uma pergunta que mereça ser vista, apoiada por uma fonte identificável.</p></div></li>
            <li><span>02</span><div><h3>Dar forma à mudança.</h3><p>Dados, modelos e composições autorais: cada peça deixa claro o que mede e o que interpreta.</p></div></li>
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
            <label htmlFor="i-interesse">O que você quer acompanhar?</label>
            <select id="i-interesse" name="escolha" defaultValue={interesse} key={interesse}>{INTERESSES.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}</select>
            <label htmlFor="i-email">Seu e-mail</label>
            <div className="i-formulario-linha"><input id="i-email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="voce@email.com" /><button className="i-botao" type="submit">Avise-me <Seta /></button></div>
            <label className="i-consentimento" htmlFor="i-consentimento"><input id="i-consentimento" name="consentimento" type="checkbox" required value="sim" /><span>Aceito receber da INFLEXO as novidades das coleções, o aviso de abertura e o acesso antecipado. Posso pedir a exclusão a qualquer momento.</span></label>
          </form>
        )}
      </section>
    </div>
  );
}
