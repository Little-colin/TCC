const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Função utilitária para centralizar as requisições HTTP para a API do Rivals Arena.
 * Trata o envio de JSON, cabeçalhos de autenticação JWT e expiração de sessão.
 */
export async function apiFetch(endpoint, method = 'GET', body = null, requerAutenticacao = false) {
  const headers = { 
    'Content-Type': 'application/json'
  };

  // Se a rota exige autenticação, recupera o token salvo no login
  if (requerAutenticacao) {
    const token = localStorage.getItem('rivals_token');
    
    if (!token) {
      alert('Sessão não encontrada. Por favor, faça login.');
      window.location.href = 'login.html';
      return;
    }
    
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { 
    method, 
    headers 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Se o token estiver expirado ou for inválido (HTTP 401 ou 403)
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('rivals_token');
      alert('Sessão expirada. Faça login novamente.');
      window.location.href = 'login.html';
      return;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro de conexão com a API:', error);
    return { 
      success: false, 
      message: 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.' 
    };
  }
}