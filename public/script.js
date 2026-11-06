const pag = document.body.dataset.p, L = [['index', 'Hub'], ['tv', 'TV'], ['ranking', 'Ranking'], ['campeonatos', 'Campeonato']];

document.querySelector('header.nav').innerHTML = `<a class="logo" href="index.html">RIVALS ARENA</a>${L.map(([f, n]) => `<a href="${f}.html" class="${f === pag ? 'on' : ''}">${n}</a>`).join('')}<div class="dir"><span>🌐</span><a class="btn" href="login.html">Login</a></div>`;

document.querySelector('footer.foot').innerHTML = `<a class="logo" href="index.html">RIVALS ARENA</a><nav><a href="ranking.html">Ranking</a><a href="campeonatos.html">Equipes</a><a href="contato.html">Nos contate</a></nav><a class="topo" href="#" aria-label="Voltar ao topo"></a>`;

const R = document.getElementById('rank');
if (R) {
  const d = [['s', 'BERMUDA LIFESTILE', 3332, '68-32'], ['', 'LOUD', 2254, '72-28'], ['', 'FÚRIA', 2150, '61-39'], ['', 'NAVI', 2034, '73-29'], ['s', 'G2 SPORTS', 1930, '59-41'], ['', 'TEAM LIQUID', 1887, '56-41'], ['d', 'MIBR', 1883, '55-21'], ['s', 'CLOUD 9', 1648, '77-22'], ['', 'FAZE CLAN', 1567, '22-21'], ['', 'T1', 1432, '55-31'], ['d', 'NRG', 1444, '81-19'], ['', 'GEN.G', 1234, '33-21'], ['', 'VITALITY', 1190, '66-34'], ['', 'SK GAMING', 1154, '55-21']];
  R.innerHTML = d.map((r, i) => `<tr><td>${i + 1} <span class="seta ${r[0]}">${r[0] === 's' ? '▲' : r[0] === 'd' ? '▼' : ''}</span>${r[1]}</td><td>${r[2]} pts</td><td>${r[3]}</td></tr>`).join('');
}

const A = document.getElementById('area');
if (A) {
  const T = { 'Organizar campeonato': ['NOME DO CAMPEONATO', []], 'Meus Campeonatos': ['CAMPEONATOS', ['CAMPEONATO 1', 'CAMPEONATO 2']], 'Cadastro de equipes': ['NOME DA EQUIPE', []], 'Cadastro de jogadores': ['NOME DE JOGADOR', ['NOME DO JOGADOR']] };
  const lat = document.getElementById('lat'), li = n => `<li>${n}<span><b title="Enviar">⬆</b><b title="Excluir" class="x">🗑</b></span></li>`;

  function abre(k) {
    lat.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.textContent === k));
    A.innerHTML = `<div class="add"><input placeholder="${T[k][0]}"><button>Adicionar</button></div><ul>${T[k][1].map(li).join('')}</ul>`;

    const i = A.querySelector('input'), u = A.querySelector('ul');
    A.querySelector('.add button').onclick = () => { if (i.value.trim()) { u.insertAdjacentHTML('beforeend', li(i.value.trim())); i.value = '' } };
    u.onclick = e => { if (e.target.classList.contains('x')) e.target.closest('li').remove() };
  }

  lat.innerHTML = Object.keys(T).map(k => `<button>${k}</button>`).join('');
  lat.onclick = e => e.target.tagName === 'BUTTON' && abre(e.target.textContent);
  abre('Meus Campeonatos');
}

tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            bg: '#0a0a0c',
                            cardBg: '#121216',
                            gold: '#FFC700',
                            goldHover: '#e6b300',
                            magenta: '#E91E63',
                            magentaHover: '#d81b60',
                            textMuted: '#9CA3AF',
                            navDark: '#16161a'
                        }
                    },
                    fontFamily: {
                        heading: ['Orbitron', 'sans-serif'],
                        body: ['Rajdhani', 'sans-serif']
                    }
                }
            }
          }