// Pega o token que foi guardado no login
function pegarToken() {
    return localStorage.getItem('token');
  // localStorage → o lugar onde os dados ficam guardados
  
  }
  
  
   
  // Se a pessoa não fez login, manda de volta para a tela de login
  function protegerPagina() {
    if (!pegarToken()) {
      window.location.href = 'login.html';
  // window.location.href permite acessar ou mudar o endereço (URL) da página no navegador.
    }
  }
   
  // Mostra uma mensagem na tela: tipo 'sucesso' (verde) ou 'erro' (vermelho)
  function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById('mensagem');
  // Procure no HTML o elemento que tem id="mensagem" e guarde ele na variável mensagem."
    mensagem.textContent = texto;
  // "Coloque o conteúdo da variável texto dentro do elemento mensagem."
    mensagem.className = 'mensagem ' + tipo;
  // define as classes CSS do elemento mensagem, juntando a classe "mensagem" com o valor de tipo.
  }
   
  // Se o token venceu (status 401), apaga o token e volta para o login
  function tratarSessaoExpirada(resposta) {
    if (resposta.status === 401) {
      localStorage.removeItem('token');
      alert('Sua sessão expirou. Faça login novamente.');
      window.location.href = 'login.html';
      return true;
    }
    return false;
  }
   
  // Deixa um texto seguro para ser colocado dentro do HTML
  function protegerTexto(texto) {
  
    // Cria uma div nova só na memória (não aparece na tela), usada como "rascunho".
    const div = document.createElement('div');
  
    // Coloca o texto dentro da div como TEXTO PURO: nada é interpretado como código HTML.
    div.textContent = texto;
  
    // Devolve o conteúdo da div em formato HTML.
    return div.innerHTML;
  }
  
  
  // Botão Sair: apaga o token antes de voltar para o login
  
  // Procura no HTML o elemento que tem id="link-sair" e guarda ele na variável linkSair.
  const linkSair = document.getElementById('link-sair');
  
  // Verifica se o link foi encontrado na página (se não existir, linkSair vale null e nada é feito).
  if (linkSair) {
  
    // Fica "escutando" o link: quando o usuário clicar nele, executa a função abaixo.
    linkSair.addEventListener('click', function () {
  
      // Remove do navegador (localStorage) o item chamado 'token', ou seja, desloga o usuário.
      localStorage.removeItem('token');
  
    // Fecha a função e o addEventListener.
    });
  }
  
  // Depois do clique, o próprio link (href="login.html") leva o usuário para a tela de login.
  