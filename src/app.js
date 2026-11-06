import { apiFetch } from './api.js';

export async function realizarLogin(email, senha) { 
  const data = await apiFetch('/auth/login', 'POST', { email, senha });

  if (data?.success) {
    localStorage.setItem('rivals_token', data.token);
    console.log('Login efetuado com sucesso! Usuário:', data.usuario);
    return data;
  } else if (data) {
    alert(data.message || 'Erro ao realizar login');
  }
}

export async function criarTime(nomeTime, tagTime, logoUrl) {
  const data = await apiFetch('/times', 'POST', {
    nome_time: nomeTime,
    tag_time: tagTime,
    logo: logoUrl
  }, true);

  if (data?.success) {
    alert(`Time criado com ID: ${data.id_time}`);
  } else if (data) {
    alert(data.message || 'Erro ao criar time.');
  }
}

export async function inscreverTime(idCampeonato, idTime) {
  const data = await apiFetch(`/campeonatos/${idCampeonato}/inscrever`, 'POST', { 
    id_time: idTime 
  }, true);

  if (data?.success) {
    alert('Inscrição realizada com sucesso!');
  } else if (data) {
    alert(data.message || 'Erro ao realizar inscrição.');
  }
}

export function realizarLogout() {
  localStorage.removeItem('rivals_token');
  window.location.href = 'login.html';
}