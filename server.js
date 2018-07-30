const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
var routes = express.Router();
const app = express();

// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
//app.use(express.static(path.join(__dirname, 'dist')));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// API location
//app.use('/', routes);

// Send all other requests to the Angular app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

routes.get('/', api.getTodos);
routes.post('/', api.addTodo);
routes.put('/', api.updateTodos);
routes.delete('/', api.removeTodo);
routes.get('/:id', api.getTodosById);
routes.delete('/:id', api.removeTodoById);
routes.patch('/:id', api.updateTodosById);
routes.delete('/todos', api.removeTodos);

app.use('/', routes);

//Set Port
const port = process.env.PORT || '4000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));