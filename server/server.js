require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");
const bcrypt = require("bcryptjs");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate");

const port = process.env.PORT;
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
        res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            if(!todo) {
                res.status(404).send();
            } else {
                res.send(todo);
            }
        }).catch((err) => {
            res.status(404).send();
        });
    }
});

app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        return res.status(400).send();
    });
});

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, 
        {
            $set: body
        }, {
            new: true
        }).then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch((err) => {
            res.status(400).send();
        });
});

app.post("/users", (req, res) => {
    var user = new User(_.pick(req.body, ["email", "password"]));    
    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header("x-auth", token).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
}); 

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login

app.post("/users/login", (req, res) => {
    var body = _.pick(req.body, ["email", "password"])
    User.findOneByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        });
    }).catch(() => {
        res.status(400).send();
    });

    // User.findOne({email: body.email}).then((user) => {
        // bcrypt.compare(body.password, user.password, (err, result) => {
        //     if(result) {
        //         res.send(user);
        //     } else {
        //         res.status(401).send();
        //     }
        // });
    // }).catch((err) => {
    //     res.send(err);
    // })
    
});

if(!module.parent) {
    app.listen(port, () => {
        console.log("Started at port", port);
    });
}

module.exports = {app};