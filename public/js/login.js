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
  
    // Tenta executar o bloco abaixo; se algo der errado, vai para o catch.
    try {
      // Envia um pedido ao servidor, na rota /login, e ESPERA (await) a resposta.
      const resposta = await fetch('/login', {
  
        // Tipo do pedido: POST, usado para enviar dados.
        method: 'POST',
  
        // Avisa ao servidor que o conteúdo enviado está em formato JSON.
        headers: { 'Content-Type': 'application/json' },
  
        // Transforma { email, senha } em texto JSON e coloca no corpo do pedido.
        body: JSON.stringify({ email, senha }),
      });
  
      // Converte a resposta do servidor (texto JSON) em objeto JavaScript e espera terminar.
      const dados = await resposta.json();
  
      // Se o servidor respondeu com sucesso (status entre 200 e 299)...
      if (resposta.ok) {
  
        // ...guarda o token recebido no localStorage do navegador...
        localStorage.setItem('token', dados.token);
  
        // ...e redireciona o usuário para a página do painel.
        window.location.href = 'criar.html';
  
      // Se o servidor respondeu com erro (ex.: senha incorreta)...
      } else {
  
        // ...mostra em vermelho a mensagem de erro enviada pelo servidor.
        mostrarMensagem(dados.mensagem, 'erro');
      }
  
    // Se aconteceu uma falha no caminho (ex.: servidor desligado), cai aqui.
    } catch (erro) {
  
      // Mostra um aviso de erro de conexão em vermelho.
      mostrarMensagem('Não foi possível conectar ao servidor.', 'erro');
    }

  });  