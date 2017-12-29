const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// Todo.remove({}).then((res) => {
//     console.log(JSON.stringify(res, undefined, 2));
// }).catch((err) => {
//     console.log(JSON.stringify(err, undefined, 2));
// })

// Todo.findOneAndRemove()

Todo.findByIdAndRemove("5a45ce6fd0ddac3de2cef527").then((todo) => {
    console.log(JSON.stringify(todo, undefined, 2));
}).catch((err) => {
    console.log(err);
});
