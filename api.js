const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());
const TOKEN   = 'PANELCLIENT_S2B0G-XSVY6-O9TLE-IR37T';
const SECRET  = '2f7cbf042b9fe5f680d3c60c3a26507d';
const BOUQUET = [7333637];
const API_KEY = 'minha-chave-secreta-123';

async function criarTeste(req, res) {
  const chave = req.headers['x-api-key'] || req.body.api_key;
  if (chave !== API_KEY) {
    return res.status(401).json({ sucesso: false, erro: 'Chave de API inv¨¢lida' });
  }

  try {
    const username = Math.random().toString(36).substring(2, 10);
    const password = Math.random().toString(36).substring(2, 10);

    const response = await axios.post(
      `https://api.painelcliente.com/trial_create/${TOKEN}`,
      { secret: SECRET, username, password, idbouquet: BOUQUET, notes: 'Teste via API pr¨®pria' }
    );

    const data = response.data;
    if (!data.result) return res.json({ sucesso: false, erro: data.mens });

    const expiracao = Math.floor(Date.now() / 1000) + (4 * 60 * 60);
    const expiracao_data = new Date(expiracao * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return res.json({
      sucesso: true,
      usuario: data.data.username,
      senha: data.data.password,
      expiracao_timestamp: expiracao,
      expiracao_data,
      msg: `${data.data.username}|${data.data.password}`
    });

  } catch (err) {
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
}

app.post('/teste', criarTeste);
app.post('/teste.php', criarTeste);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
