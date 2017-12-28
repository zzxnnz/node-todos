var express = require("express");
var bodyParser = require("body-parser");

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

if(!module.parent) {
    app.listen(port, () => {
        console.log("Started at port", port);
    });
}

module.exports = {app};