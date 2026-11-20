import {test} from 'node:test';
import assert from 'node:assert/strict';
import {formaDobraTemporal, geometriaDobraTemporal, renderDobraTemporal, EXEMPLOS_DOBRA} from '../src/dobraTemporal.mjs';

test('a forma canônica permanece idêntica ao trocar enredo, data e legenda',()=>{
 const forma=formaDobraTemporal();
 for(const exemplo of EXEMPLOS_DOBRA) assert.ok(renderDobraTemporal(exemplo).includes(forma));
 assert.deepEqual(geometriaDobraTemporal(),geometriaDobraTemporal());
});
test('o cânone é simbólico e não se apresenta como medição histórica',()=>{
 const svg=renderDobraTemporal(EXEMPLOS_DOBRA[0]);
 assert.match(svg,/FORMA SIMBÓLICA/);
 assert.match(svg,/DATAS APROXIMADAS/);
 assert.equal(geometriaDobraTemporal().linhas.length,64);
});
test('a história é escapada sem alterar a geometria',()=>{
 const svg=renderDobraTemporal({titulo:'<script>x</script>'});
 assert.doesNotMatch(svg,/<script>/);
 assert.match(svg,/&lt;script&gt;/);
 assert.ok(svg.includes(formaDobraTemporal()));
});

