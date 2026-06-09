const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('urlパラメータが必要です');

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.send(body);
  } catch (err) {
    res.status(500).send('取得エラー: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`起動中: http://localhost:${PORT}`));
