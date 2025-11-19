const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/trade/even-odd', (req, res) => {
  const { mode, amount, symbol } = req.body;
  res.json({ status: 'success', message: `Trade request received: ${mode}, ${amount}, ${symbol}` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));