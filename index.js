const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', require('./routes/userRoutes'));

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});