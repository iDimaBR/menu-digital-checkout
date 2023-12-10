require('dotenv').config();
const UserRoutes = require('./routes/userRoutes');
const CategoryRoutes = require('./routes/categoryRoutes');
const ProductRoutes = require('./routes/productRoutes');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/user', UserRoutes);
app.use('/category', CategoryRoutes);
app.use('/product', ProductRoutes);


app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});