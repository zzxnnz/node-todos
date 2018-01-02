const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [
    {
        _id: user1ID,
        email: "leonemsolis@example.com",
        password: "18021991",
        tokens: [
            {
                access: "auth",
                token: jwt.sign({
                    _id: user1ID, 
                    access: "auth"
                }, "abc").toString()
            }
        ]
    }, 
    {
        _id: user2ID,
        email: "leonemsolis.app@example.com",
        password: "18021992",
        tokens: [
            {
                access: "auth",
                token: jwt.sign({
                    _id: user2ID, 
                    access: "auth"
                }, "abc").toString()
            }
        ]
    }
];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done())
        .catch((err) => {
            console.log(err);
        });
};

const todos = [
    {   
        _id: new ObjectID(),
        text: "First test todo",
        _creator: user1ID
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 777,
        _creator: user1ID
    },
    {
        _id: new ObjectID(),
        text: "Third test todo",
        _creator: user2ID
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
    .catch((err) => {
        done(err);
    });
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}