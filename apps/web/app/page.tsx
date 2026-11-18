import Link from 'next/link';
import './casa.css';
import { TIRAGEM_FIOS, HORAS_ANTES, LIMIAR_CONTADOR, tamanhoDaFila } from '../lib/fila';

export const dynamic = 'force-dynamic';

// Home da loja, na estrutura dos benchmarks do dono (GAZA CASA, NESTORA, ТИХИЙ ДОМ):
// abertura de ponta a ponta com o título sobre a foto, categorias em cartões com produto isolado,
// grade de produtos em estúdio, banner escuro da coleção, editorial dividido, próximas coleções, fila.
// Toda foto é cena gerada por IA com a arte real composta por cima (compor_mockup.py).

const CATEGORIAS = [
  { nome: 'Quadros', foto: '/casa/gravura.jpg', href: '/loja?suporte=quadro' },
  { nome: 'Pôsteres', foto: '/casa/poster-gravura.jpg', href: '/loja?suporte=poster' },
  { nome: 'Digital', foto: '/casa/digital.jpg', href: '/loja?suporte=digital' },
  { nome: 'Camiseta', foto: '/casa/camiseta.jpg', href: '/loja?suporte=camiseta' },
];

type Produto = { nome: string; linha: string; foto: string; href: string; selo?: string };
const PRODUTOS: Produto[] = [
  { nome: 'Fios', linha: 'Quadro · carvalho · A3 ou A2', foto: '/casa/fios.jpg', href: '/produto/quadro?estilo=fios', selo: `Tiragem de ${TIRAGEM_FIOS}` },
  { nome: 'Gravura', linha: 'Quadro · carvalho · A3 ou A2', foto: '/casa/gravura.jpg', href: '/produto/quadro?estilo=gravura' },
  { nome: 'Gravura em pôster', linha: 'Pôster · papel fosco · A3 ou A2', foto: '/casa/poster-gravura.jpg', href: '/produto/poster?estilo=gravura' },
  { nome: 'Arquivo digital', linha: 'Stories, fundo de tela e A2', foto: '/casa/digital.jpg', href: '/produto/arquivo-digital' },
  { nome: 'Camiseta', linha: 'Algodão branco · a Gravura no peito', foto: '/casa/camiseta.jpg', href: '/produto/camiseta' },
];

function Seta() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" className="h-seta"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

export default async function Inicio({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const posicao = Number(q.fila) > 0 ? Number(q.fila) : 0;
  const total = await tamanhoDaFila();

  return (
    <div className="casa">
      {/* 1. abertura de ponta a ponta */}
      <section className="h-abertura" aria-labelledby="h-titulo">
        <img className="h-abertura-foto" src="/casa/hero.jpg" alt="Duas pessoas de moletom preto com a marca INFLEXO numa sala clara; na parede, o quadro Gravura só com a curva e a data" width={2560} height={1434} fetchPriority="high" />
        <div className="h-abertura-texto">
          <p className="h-linha-fina">Coleção 01 · A Geografia da Virada</p>
          <h1 id="h-titulo"><span>A estética</span><span>do movimento.</span></h1>
          <p className="h-lede">Quadros, pôsteres e camisetas desenhados por dados públicos. A forma não é inventada: cada linha vem de uma série real.</p>
          <div className="h-acoes">
            <Link className="h-botao" href="/loja">Ver a loja <Seta /></Link>
            <a className="h-botao h-botao-claro" href="#fecho">Entrar na fila</a>
          </div>
          <p className="h-prova"><strong>Nenhuma linha inventada.</strong> Cada curva confere com a fonte oficial.</p>
        </div>
        <Link className="h-flutuante" href="/produto/quadro?estilo=fios">
          <img src="/casa/fios.jpg" alt="" width={1024} height={1024} />
          <span className="h-fl-texto">
            <span className="h-fl-rotulo">Primeira tiragem</span>
            <span className="h-fl-nome">Fios</span>
            <span className="h-fl-linha">Quadro numerado · Nº —/{TIRAGEM_FIOS}</span>
          </span>
          <span className="h-circulo"><Seta /></span>
        </Link>
        <p className="h-nota">Cena gerada por IA. O quadro na parede é a Gravura real, sem o placar; moletom e boné são estudo da coleção, ainda fora da loja.</p>
      </section>

      {/* 2. categorias */}
      <nav className="h-categorias h-largura" aria-label="Comprar por categoria">
        <ul>
          {CATEGORIAS.map((c) => (
            <li key={c.nome}>
              <Link href={c.href}>
                <img src={c.foto} alt="" width={1024} height={1024} loading="lazy" />
                <span className="h-cat-rodape"><span>{c.nome}</span><span className="h-circulo"><Seta /></span></span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. produtos */}
      <section className="h-secao h-largura" aria-labelledby="h-produtos">
        <header className="h-cabeca">
          <h2 id="h-produtos">Primeira tiragem</h2>
          <Link className="h-link" href="/loja">Ver a loja inteira <Seta /></Link>
        </header>
        <ul className="h-produtos">
          {PRODUTOS.map((p, i) => (
            <li key={p.nome}>
              <Link href={p.href} className="h-produto">
                <span className="h-produto-foto">
                  <img src={p.foto} alt={`${p.nome}, ${p.linha}`} width={1024} height={1024} loading={i < 4 ? 'eager' : 'lazy'} />
                  {p.selo && <span className="h-selo">{p.selo}</span>}
                </span>
                <span className="h-produto-info">
                  <span className="h-produto-nome">{p.nome}</span>
                  <span className="h-produto-linha">{p.linha}</span>
                  <span className="h-produto-preco">Preço na abertura da venda</span>
                </span>
                <span className="h-circulo h-produto-acao"><Seta /></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="h-nota-secao">Fotos de estúdio geradas por IA com as artes reais aplicadas. O preço sai com a cotação dos fornecedores.</p>
      </section>

      {/* 4. banner escuro da coleção */}
      <section className="h-banner h-largura" aria-labelledby="h-banner-titulo">
        <img className="h-banner-foto" src="/casa/banner.jpg" alt="" width={2400} height={1344} loading="lazy" />
        <div className="h-banner-texto">
          <p className="h-linha-fina">Coleção 01 · A Geografia da Virada</p>
          <h2 id="h-banner-titulo">Duas linhas,<br />uma virada.</h2>
          <p>Duas curvas correm a noite inteira, se aproximam e se cruzam às 20h23 para não se separar mais. O desenho é a série pública somada na ordem em que chegou e conferida com a fonte, sem nenhum ponto inventado.</p>
          <div className="h-acoes">
            <Link className="h-botao h-botao-branco" href="/colecao/a-geografia-da-virada">Ver a coleção <Seta /></Link>
            <Link className="h-link h-link-claro" href="/metodo">Como medimos</Link>
          </div>
        </div>
      </section>

      {/* 5. próximas coleções */}
      <section className="h-secao h-largura" aria-labelledby="h-proximas">
        <header className="h-cabeca">
          <h2 id="h-proximas">Próximas coleções</h2>
          <a className="h-link" href="#fecho">Avise-me <Seta /></a>
        </header>
        <ul className="h-proximas">
          <li>
            <div className="h-tipo h-tipo-momento" aria-hidden="true">
              <span className="h-tipo-hora">19h42</span>
              <span className="h-tipo-frase">O dia em que pegamos a chave.</span>
              <svg viewBox="0 0 200 40"><path d="M0 30 C 40 30, 60 28, 90 20 S 150 6, 200 8" /><circle cx="118" cy="13" r="3.4" /></svg>
              <span className="h-tipo-data">14.03.2025</span>
            </div>
            <div><h3>Momentos</h3><p>A sua data, a sua hora e uma frase sua no desenho da casa. Na primeira versão, a curva é ornamento, não medição.</p></div>
          </li>
          <li>
            <figure className="h-tipo h-tipo-frase-epica">
              <blockquote>Inflexão Nº 01</blockquote>
              <figcaption>O ponto em que a curva muda de direção</figcaption>
            </figure>
            <div><h3>Inflexões</h3><p>Os pontos em que a história da Terra e da humanidade mudou de direção, cada um desenhado pela sua série pública. O ponto da virada é calculado, não desenhado à mão.</p></div>
          </li>
        </ul>
      </section>

      {/* 6. fila */}
      <section id="fecho" className="h-fila h-largura" aria-labelledby="h-fila-titulo">
        <div>
          <h2 id="h-fila-titulo">{posicao ? `Você é o nº ${posicao.toLocaleString('pt-BR')} da fila.` : 'A fila compra primeiro.'}</h2>
          <p>A venda abre em breve. Quem está na fila recebe o aviso e compra {HORAS_ANTES} horas antes, por ordem de chegada.{total >= LIMIAR_CONTADOR && <> Já são <strong>{total.toLocaleString('pt-BR')}</strong> pessoas na fila.</>}</p>
        </div>
        {posicao ? (
          <p className="h-fila-ok" role="status">Posição registrada. O acesso antecipado chega no e-mail cadastrado.</p>
        ) : (
          <form className="h-fila-form" method="post" action="/api/lista">
            <input type="hidden" name="produto" value="colecao" />
            <input type="hidden" name="escolha" value="home" />
            <label htmlFor="h-email" className="sr-only">Seu e-mail</label>
            <div className="h-fila-linha">
              <input id="h-email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" />
              <button className="h-botao h-botao-branco" type="submit">Entrar na fila</button>
            </div>
            <label className="h-consentimento" htmlFor="h-consentimento">
              <input id="h-consentimento" name="consentimento" type="checkbox" required value="sim" />
              <span>Aceito receber da INFLEXO o aviso de abertura e o acesso antecipado. Uso só para isso e apago a pedido.</span>
            </label>
          </form>
        )}
      </section>
    </div>
  );
}
