const express = require('express');

const errorMiddleware = require('./src/middlewares/error');
const Users = require('./src/controllers/Users');
const Login = require('./src/controllers/Login');
const Categories = require('./src/controllers/Categories');

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/user', Users);
app.use('/login', Login);
app.use('/categories', Categories);

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});
