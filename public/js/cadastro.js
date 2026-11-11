const formCadastro = document.getElementById('form-cadastro');
const avisoCadastro = document.getElementById('aviso');

formCadastro.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const botao = formCadastro.querySelector('button[type="submit"]');
  botao.disabled = true;
  avisoCadastro.textContent = '';
  avisoCadastro.className = 'aviso';

  const dadosFormulario = new FormData(formCadastro);

  try {
    const resposta = await fetch('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: dadosFormulario.get('nome').trim(),
        email: dadosFormulario.get('email').trim(),
        senha: dadosFormulario.get('senha'),
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      avisoCadastro.textContent = dados.mensagem || 'Não foi possível criar a conta.';
      avisoCadastro.className = 'aviso erro';
      return;
    }

    formCadastro.reset();
    avisoCadastro.textContent = 'Conta criada com sucesso. Você já pode fazer login.';
    avisoCadastro.className = 'aviso sucesso';
  } catch (erro) {
    avisoCadastro.textContent = 'Não foi possível conectar ao servidor.';
    avisoCadastro.className = 'aviso erro';
  } finally {
    botao.disabled = false;
  }
});
