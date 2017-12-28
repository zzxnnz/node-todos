var express = require("express");
var bodyParser = require("body-parser");
var {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((document) => {
        res.send(document);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

app.get("/todos/:id", (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(400).send();
    } else {
        Todo.findById(id).then((todo) => {
            if(!todo) {
                res.status(404).send();
            } else {
                res.send(todo);
            }
        }).catch((err) => {
            res.status(400).send();
        });
    }
});



if(!module.parent) {
    app.listen(port, () => {
        console.log("Started at port", port);
    });
}

module.exports = {app};