const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const uuidv4 = require('uuid/v4');

// Connection URL
//const url = 'mongodb://localhost:27017/todos';
const url = 'mongodb://admin:Todoapp111!@ds137281.mlab.com:37281/my-precious-todos';

// Database Name
//const dbName = 'todos';

// Connect
const connection = (closure) => {
  return MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    const db = client.db();
    closure(db);
  });
};

// Error handling
const sendError = (err, res) => {
  var response = {};
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
// let response = {
//   status: 200,
//   data: [],
//   message: null,
//   title: null,
//   order: null,
//   length: null,
//   completed: null
// };

// Get todos
module.exports.getTodos = function(req, res) {
  connection((db) => {
    db.collection('todos')
      .find()
      .toArray()
      .then((todos) => {
        res.json(todos);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// Get todos by id
module.exports.getTodosById = function(req, res) {
  connection((db) => {
    db.collection('todos')
      .find({'_id': req.params.id})
      .toArray()
      .then((result) => {
        res.json(Object.assign({}, result[0]));
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// create todo
module.exports.addTodo = function(req, res) {
  connection((db) => {
    var id = uuidv4();
    db.collection("todos").insertOne({_id: id, title: req.body.title, completed: false, order: req.body.order || 1, url: "http://localhost:4000/" + id})
      .then((result) => {
        var response = Object.assign({}, result.ops[0]);
        response.status = '200';
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// update todo
module.exports.updateTodos = function(req, res) {
  connection((db) => {
    db.collection("todos").updateMany({}, { $set: {completed: req.body.state}})
      .then((result) => {
        res.json({status: '200'});
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

//update todos by id
module.exports.updateTodosById = function(req, res) {
  connection((db) => {
    var changeset = {};
    if(req.body.title) changeset.title = req.body.title;
    if(req.body.completed) changeset.completed = req.body.completed;
    if(req.body.order) changeset.order = req.body.order;
    db.collection("todos").findOneAndUpdate({'_id': req.params.id}, { $set: changeset})
      .then((result) => {
        var response = {};
        response.status = '200';
        if(req.body.title) response.title = req.body.title;
        if(req.body.completed) response.completed = req.body.completed;
        if(req.body.order) response.order = req.body.order;
        response.url = "http://localhost:4000/" + req.params.id;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// remove todos
module.exports.removeTodo = function(req, res) {
  connection((db) => {
    db.collection("todos").remove({})
      .then(() => {
        res.json({status: '200'});
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// remove todo by id
module.exports.removeTodoById = function(req, res) {
  connection((db) => {
    db.collection('todos').deleteOne({'_id': req.params.id})
      .then((result) => {
        res.json({status: '200'});
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// remove todos by id
module.exports.removeTodos = function(req, res) {
  connection((db) => {
    var id = req.query.id;
    db.collection("todos").remove({'_id':{'$in': id}})
      .then(() => {
        res.json({status: '200'});
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};
