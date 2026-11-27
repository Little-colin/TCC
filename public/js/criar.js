const areaCriacao = document.getElementById('area');
const navegacaoCriacao = document.getElementById('lat');
const tokenCriacao = localStorage.getItem('token');

if (!tokenCriacao) {
  window.location.href = 'login.html';
} else if (areaCriacao && navegacaoCriacao) {
  const abas = {
    'Organizar campeonato': {
      endpoint: '/campeonatos',
      id: 'id_campeonato',
      nome: 'nome_campeonato',
      formulario: `
        <label>Nome do campeonato<input name="nome_campeonato" maxlength="150" required></label>
        <label>Descrição<textarea name="descricao" maxlength="5000"></textarea></label>
        <label>Máximo de equipes<input name="max_times" type="number" min="2" value="16" required></label>
        <label>Data de início<input name="data_inicio" type="date" required></label>
        <label>Data de encerramento<input name="data_fim" type="date"></label>
        <button class="btn" type="submit">Criar campeonato</button>`,
      dados: form => ({
        nome_campeonato: form.get('nome_campeonato').trim(),
        descricao: form.get('descricao').trim() || null,
        max_times: Number(form.get('max_times')),
        data_inicio: form.get('data_inicio'),
        data_fim: form.get('data_fim') || null,
      }),
    },
    'Meus Campeonatos': {
      endpoint: '/campeonatos',
      id: 'id_campeonato',
      nome: 'nome_campeonato',
    },
    'Cadastro de equipes': {
      endpoint: '/times',
      id: 'id_time',
      nome: 'nome_time',
      jogadores: '/jogadores',
      formulario: `
        <label>Nome da equipe<input name="nome_time" maxlength="100" required></label>
        <label>Tag<input name="tag_time" maxlength="10" required></label>
        <label>URL do logo<input name="logo" type="url" maxlength="255"></label>
        <button class="btn" type="submit">Cadastrar equipe</button>
        <label>Selecione os jogadores:</label>
        <ul id="lista-jogadores" class="cadastro-lista"></ul>`,
      dados: form => ({
        nome_time: form.get('nome_time').trim(),
        tag_time: form.get('tag_time').trim().toUpperCase(),
        logo: form.get('logo').trim() || null,
        // ids dos jogadores marcados na lista
        jogadores: form.getAll('jogadores').map(Number),
      }),
    },
    'Cadastro de jogadores': {
      endpoint: '/jogadores',
      id: 'id_jogador',
      nome: 'nome_jogador',
      formulario: `
        <label>Nome do jogador<input name="nome_jogador" maxlength="100" required></label>
        <button class="btn" type="submit">Cadastrar jogador</button>`,
      dados: form => ({
        nome_jogador: form.get('nome_jogador').trim(),
      }),
    },
  };

  async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, {
      ...opcoes,
      headers: {
        Authorization: `Bearer ${tokenCriacao}`,
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers,
      },
    });

    if (resposta.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      throw new Error('Sua sessão expirou. Entre novamente.');
    }

    if (resposta.status === 204) return null;

    const dados = await resposta.json();
    if (!resposta.ok) {
      throw new Error(dados.mensagem || 'Não foi possível concluir a operação.');
    }
    return dados;
  }

  function mostrarMensagem(elemento, texto, tipo = '') {
    elemento.textContent = texto;
    elemento.className = `cadastro-mensagem ${tipo}`.trim();
  }

  async function carregarLista(config, lista, mensagem) {
    lista.replaceChildren();
    try {
      const registros = await requisicao(config.endpoint);
      if (registros.length === 0) {
        mostrarMensagem(mensagem, 'Nenhum registro cadastrado.');
        return;
      }

      mostrarMensagem(mensagem, '');
      for (const registro of registros) {
        const item = document.createElement('li');
        const nome = document.createElement('span');
        nome.textContent = registro[config.nome];

        // Equipes: mostra os jogadores ao lado do nome
        if (Array.isArray(registro.jogadores) && registro.jogadores.length > 0) {
          nome.textContent += ` — ${registro.jogadores.map(j => j.nome_jogador).join(', ')}`;
        }

        const acoes = document.createElement('span');
        const excluir = document.createElement('button');
        excluir.type = 'button';
        excluir.className = 'excluir';
        excluir.textContent = 'Excluir';
        excluir.setAttribute('aria-label', `Excluir ${registro[config.nome]}`);
        excluir.addEventListener('click', async () => {
          if (!window.confirm(`Excluir "${registro[config.nome]}"?`)) return;

          excluir.disabled = true;
          try {
            await requisicao(`${config.endpoint}/${registro[config.id]}`, {
              method: 'DELETE',
            });
            await carregarLista(config, lista, mensagem);
          } catch (erro) {
            mostrarMensagem(mensagem, erro.message, 'erro');
            excluir.disabled = false;
          }
        });

        acoes.append(excluir);
        item.append(nome, acoes);
        lista.append(item);
      }
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, 'erro');
    }
  }

  // Lista os jogadores com uma caixinha de seleção em cada um
  async function carregarJogadoresParaSelecao(lista, endpoint) {
    if (!lista) return;
    lista.replaceChildren();

    try {
      const jogadores = await requisicao(endpoint);

      if (jogadores.length === 0) {
        const vazio = document.createElement('li');
        vazio.textContent = 'Nenhum jogador cadastrado. Cadastre na aba "Cadastro de jogadores".';
        lista.append(vazio);
        return;
      }

      for (const jogador of jogadores) {
        const item = document.createElement('li');
        const rotulo = document.createElement('label');
        const caixa = document.createElement('input');
        caixa.type = 'checkbox';
        caixa.name = 'jogadores';
        caixa.value = jogador.id_jogador;
        rotulo.append(caixa, ` ${jogador.nome_jogador}`);
        item.append(rotulo);
        lista.append(item);
      }
    } catch (erro) {
      const falha = document.createElement('li');
      falha.textContent = erro.message;
      lista.append(falha);
    }
  }

  async function abrirAba(nomeAba) {
    const config = abas[nomeAba];
    navegacaoCriacao.querySelectorAll('button').forEach(botao => {
      botao.classList.toggle('on', botao.textContent === nomeAba);
    });

    areaCriacao.replaceChildren();

    if (config.formulario) {
      const formulario = document.createElement('form');
      formulario.className = 'cadastro-form';
      formulario.innerHTML = config.formulario;
      areaCriacao.append(formulario);

      // Cadastro de equipes: carrega os jogadores para marcar
      if (config.jogadores) {
        carregarJogadoresParaSelecao(formulario.querySelector('#lista-jogadores'), config.jogadores);
      }

      formulario.addEventListener('submit', async evento => {
        evento.preventDefault();
        const botao = formulario.querySelector('button[type="submit"]');
        const mensagem = areaCriacao.querySelector('.cadastro-mensagem');
        botao.disabled = true;
        mostrarMensagem(mensagem, '');

        try {
          await requisicao(config.endpoint, {
            method: 'POST',
            body: JSON.stringify(config.dados(new FormData(formulario))),
          });
          formulario.reset();
          await carregarLista(config, lista, mensagem);
          mostrarMensagem(mensagem, 'Cadastro realizado com sucesso.', 'sucesso');
        } catch (erro) {
          mostrarMensagem(mensagem, erro.message, 'erro');
        } finally {
          botao.disabled = false;
        }
      });
    }

    const mensagem = document.createElement('p');
    mensagem.className = 'cadastro-mensagem';
    mensagem.setAttribute('role', 'status');
    mensagem.setAttribute('aria-live', 'polite');
    const lista = document.createElement('ul');
    lista.className = 'cadastro-lista';
    areaCriacao.append(mensagem, lista);

    await carregarLista(config, lista, mensagem);
  }

  navegacaoCriacao.replaceChildren();
  for (const nomeAba of Object.keys(abas)) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = nomeAba;
    botao.addEventListener('click', () => abrirAba(nomeAba));
    navegacaoCriacao.append(botao);
  }

  abrirAba('Meus Campeonatos');
}
