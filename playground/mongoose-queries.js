const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// var id = "5a44d096eb308c0579120622";

// if(!ObjectID.isValid(id)) {
//     console.log("ID not valid");
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log("Todos", todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log("Todo", todo);
// });

// Todo.findById(id).then((todo) => {
//     if(todo === null) {
//         return console.log("ID not found");
//     }
//     console.log("Todo(by id)", todo);
// }).catch((err) => {
//     console.log(err.message);
// });

const id = "5a4489af782d6507e2a7e30c";

if(!ObjectID.isValid(id)) {
    console.log("ID not valid");
} else {
    User.findById(id).then((user) => {
        if(user === null) {
            return console.log("User not found");
        }
        console.log("User", user);
    }).catch((err) => {
        console.log(err.message);
    })    
}
