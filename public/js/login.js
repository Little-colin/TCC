// Se já fez login antes, vai direto para o painel
if (pegarToken()) {
    window.location.href = 'criar.html';
  }
   
  
  // Procura no HTML o formulário com id="form-login" e guarda na variável formLogin.
  const formLogin = document.getElementById('form-login');
  
  // Quando o formulário for enviado (submit), executa a função. "async" permite usar await dentro dela.
  formLogin.addEventListener('submit', async function (evento) {
  
    // Impede o comportamento padrão do formulário, que seria recarregar a página.
    evento.preventDefault();
  
    // Pega o valor digitado no campo com id="email".
    const email = document.getElementById('email').value;
  
    // Pega o valor digitado no campo com id="senha".
    const senha = document.getElementById('senha').value;
  
    let resposta;
    try {
      resposta = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
    } catch (erro) {
      mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
      return;
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch (erro) {
      const mensagem = resposta.ok
        ? 'O servidor retornou uma resposta inválida.'
        : `O servidor respondeu com erro (HTTP ${resposta.status}).`;
      mostrarMensagem(mensagem, 'erro');
      return;
    }

    if (resposta.ok && dados.token) {
      localStorage.setItem('token', dados.token);
      window.location.href = 'criar.html';
    } else if (resposta.ok) {
      mostrarMensagem('O servidor não retornou o token de acesso.', 'erro');
    } else {
      mostrarMensagem(dados.mensagem || `Não foi possível fazer login (HTTP ${resposta.status}).`, 'erro');
    }

  });  