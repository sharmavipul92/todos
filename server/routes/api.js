const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

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
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get todos
module.exports.getTodos = function(req, res) {
  connection((db) => {
    db.collection('todos')
      .find()
      .toArray()
      .then((todos) => {
        response.data = todos;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};

// create todo
module.exports.addTodo = function(req, res) {
  connection((db) => {
    db.collection("todos").insertOne({text: req.body.text, isCompleted: false})
      .then((data) => {
        response.status = '200';
        response.data = [{id: data.insertedId}]; 
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
    if(!req.body.text && !req.body.id){
      db.collection("todos").updateMany({}, { $set: {isCompleted: req.body.state}})
        .then(() => {
          response.status = '200';
          res.json(response);
        })
        .catch((err) => {
          sendError(err, res);
        });
    } else {
      db.collection("todos").updateOne({_id: ObjectID(req.body.id)}, { $set: {isCompleted: req.body.state, text: req.body.text}})
        .then(() => {
          response.status = '200';
          res.json(response);
        })
        .catch((err) => {
          sendError(err, res);
        });
    }
  });
};

// delete todo
module.exports.removeTodos = function(req, res) {
  connection((db) => {
    var id = req.query.id;
    id = id.split(',').map(item => ObjectID(item));
    db.collection("todos").remove({'_id':{'$in':id}})
      .then(() => {
        response.status = '200';
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
};