// authMiddleware.js
import jwt from 'jsonwebtoken';

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
        success: false,
        message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuarioDecodificado;
    next();
  } catch (error) {
    return res.status(403).json({ success: false,
        message: 'Token inválido ou expirado.' });
  }
};