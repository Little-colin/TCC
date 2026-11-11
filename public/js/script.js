// Layout compartilhado (header/footer) e telas dinâmicas das páginas.
const pag = document.body.dataset.p;
const L = [['index', 'Hub'], ['tv', 'TV'], ['ranking', 'Ranking'], ['campeonatos', 'Campeonato']];

// Escapa texto antes de usar em innerHTML (evita XSS)
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nav = document.querySelector('header.nav');
if (nav) {
  nav.innerHTML = `<a class="logo" href="index.html">RIVALS ARENA</a>${L.map(([f, n]) => `<a href="${f}.html" class="${f === pag ? 'on' : ''}">${n}</a>`).join('')}<div class="dir"><span>🌐</span><a class="btn" href="login.html">Login</a></div>`;
}

const foot = document.querySelector('footer.foot');
if (foot) {
  foot.innerHTML = `<a class="logo" href="index.html">RIVALS ARENA</a><nav><a href="ranking.html">Ranking</a><a href="campeonatos.html">Equipes</a><a href="#">Nos contate</a></nav><a class="topo" href="#" aria-label="Voltar ao topo"></a>`;
}

const R = document.getElementById('rank');
if (R) {
  const d = [['s', 'BERMUDA LIFESTILE', 3332, '68-32'], ['', 'LOUD', 2254, '72-28'], ['', 'FÚRIA', 2150, '61-39'], ['', 'NAVI', 2034, '73-29'], ['s', 'G2 SPORTS', 1930, '59-41'], ['', 'TEAM LIQUID', 1887, '56-41'], ['d', 'MIBR', 1883, '55-21'], ['s', 'CLOUD 9', 1648, '77-22'], ['', 'FAZE CLAN', 1567, '22-21'], ['', 'T1', 1432, '55-31'], ['d', 'NRG', 1444, '81-19'], ['', 'GEN.G', 1234, '33-21'], ['', 'VITALITY', 1190, '66-34'], ['', 'SK GAMING', 1154, '55-21']];
  R.innerHTML = d.map((r, i) => `<tr><td>${i + 1} <span class="seta ${r[0]}">${r[0] === 's' ? '▲' : r[0] === 'd' ? '▼' : ''}</span>${esc(r[1])}</td><td>${r[2]} pts</td><td>${r[3]}</td></tr>`).join('');
}
