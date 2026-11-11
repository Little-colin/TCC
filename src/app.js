const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
const campeonatoRoutes = require('./routes/campeonatoRoutes');
const jogadorRoutes = require('./routes/jogadorRoutes');
app.use(usuarioRoutes);
app.use(authRoutes);
app.use(campeonatoRoutes);
app.use(timeRoutes);
app.use(jogadorRoutes);

module.exports = app;