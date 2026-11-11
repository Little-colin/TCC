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
        <fieldset class="selecao-jogadores">
          <legend>Selecione os jogadores cadastrados</legend>
          <ul id="lista-jogadores" class="cadastro-lista"></ul>
        </fieldset>
        <button class="btn" type="submit">Cadastrar equipe</button>
      `,
      dados: form => ({
        nome_time: form.get('nome_time').trim(),
        tag_time: form.get('tag_time').trim().toUpperCase(),
        logo: form.get('logo').trim() || null,
        ids_jogadores: form.getAll('ids_jogadores').map(Number),
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
        if (registro.jogadores?.length) {
          const nomesJogadores = document.createElement('small');
          nomesJogadores.textContent = `Jogadores: ${registro.jogadores
            .map(jogador => jogador.nome_jogador).join(', ')}`;
          item.append(nome, nomesJogadores);
        } else {
          item.append(nome);
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
        item.append(acoes);
        lista.append(item);
      }
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, 'erro');
    }
  }

  async function abrirAba(nomeAba) {
    const config = abas[nomeAba];
    navegacaoCriacao.querySelectorAll('button').forEach(botao => {
      botao.classList.toggle('on', botao.textContent === nomeAba);
    });

    areaCriacao.replaceChildren();
    const mensagem = document.createElement('p');
    mensagem.className = 'cadastro-mensagem';
    mensagem.setAttribute('role', 'status');
    mensagem.setAttribute('aria-live', 'polite');
    const lista = document.createElement('ul');
    lista.className = 'cadastro-lista';

    let formulario;
    if (config.formulario) {
      formulario = document.createElement('form');
      formulario.className = 'cadastro-form';
      formulario.innerHTML = config.formulario;
      areaCriacao.append(formulario);
      areaCriacao.append(mensagem, lista);

      const listaJogadores = formulario.querySelector('#lista-jogadores');
      if (listaJogadores) {
        try {
          const jogadores = await requisicao(config.jogadores);
          if (jogadores.length === 0) {
            const item = document.createElement('li');
            item.textContent = 'Cadastre jogadores antes de montar uma equipe.';
            listaJogadores.append(item);
          } else {
            for (const jogador of jogadores) {
              const item = document.createElement('li');
              const label = document.createElement('label');
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.name = 'ids_jogadores';
              checkbox.value = jogador.id_jogador;
              label.append(checkbox, document.createTextNode(jogador.nome_jogador));
              item.append(label);
              listaJogadores.append(item);
            }
          }
        } catch (erro) {
          const item = document.createElement('li');
          item.textContent = `Não foi possível carregar os jogadores: ${erro.message}`;
          listaJogadores.append(item);
          formulario.querySelector('button[type="submit"]').disabled = true;
        }
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

    if (!config.formulario) areaCriacao.append(mensagem, lista);

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
