// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", 
(err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server", err);
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").insertOne({
    //     text: "Something to do",
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log("Unable to instert TODO", err);
    //     }
        
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // db.collection("Users").insertOne({
    //     name: "Ruslan",
    //     age: 19,
    //     location: "Seoul"
    // }, (err, result) => {
    //     if(err) {
    //         return console.log("Unable to insert user");
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });



    db.close();
})