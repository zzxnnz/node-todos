// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", 
(err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server", err);
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").find(
    //     {
    //         _id: new ObjectID("5a43546fa9654414dad9d3de")
    //     }).toArray().then((documents) => {
    //     console.log("Particular todo: ");
    //     console.log(JSON.stringify(documents, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    // db.collection("Todos").find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    db.collection("Users").find({name: "Ruslan"}).toArray()
        .then((documents) => {
            console.log("Ruslan users");
            console.log(JSON.stringify(documents, undefined, 2));
        })
        .catch((err) => {
            console.log("Unable to fetch documents", err);
        });
    
    db.close();
})