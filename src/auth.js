import { apiFetch } from 'api.js';

// Formulário de Login
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    const resultado = await apiFetch('/auth/login', 'POST', { email, senha });

    if (resultado?.success) {
      localStorage.setItem('rivals_token', resultado.token);
      alert('Login realizado!');
      window.location.href = 'index.html';
    } else {
      alert(resultado?.message || 'Erro ao realizar login.');
    }
  });
}

// Formulário de Registro
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
      nome: document.getElementById('reg-nome').value,
      nickname: document.getElementById('reg-nickname').value,
      email: document.getElementById('reg-email').value,
      senha: document.getElementById('reg-senha').value
    };

    const resultado = await apiFetch('/auth/registro', 'POST', dados);

    if (resultado?.success) {
      alert('Conta criada com sucesso! Faça login para continuar.');
    } else {
      alert(resultado?.message || 'Erro ao realizar cadastro.');
    }
  });
}