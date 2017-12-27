// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", 
(err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server", err);
    }

    console.log("Connected to MongoDB server");

    // Delete Many
    // db.collection("Todos").deleteMany({text: "Buy eggs"}).then((result) => {
    //     console.log(result); 
    // });

    // Delete One   
    // db.collection("Todos").deleteOne({text: "Walk the dog"}).then((result) => {
    //     console.log(result);
    // });

    // Find One and Delete
    // db.collection("Todos").findOneAndDelete({completed: false})
    //     .then((result) => {
    //         var newObject = {
    //             text: result.value.text,
    //             completed: result.value.completed
    //         };
            
    //         return db.collection("Todos").insertOne(newObject);
    //     })
    //     .then((result) => {
    //         console.log(JSON.stringify(result, undefined, 2));
    //     })
    //     .catch((err) => {
    //         console.log("Unable to operate element", err);
    //     });


    // Challenge: 
    db.collection("Users").deleteMany({name: "Ruslan"})
        .then((result) => {
            console.log("Remove completed");
            console.log(JSON.stringify(result, undefined, 2));
        })
        .catch((err) => {
            console.log("Unable to delete user", err);
        });

    db.collection("Users").findOneAndDelete({_id: new ObjectID("5a4355bd2d58ce14f8de5065")})
        .then((result) => {
            console.log("Remove completed");
            console.log(JSON.stringify(result, undefined, 2));
        })
        .catch((err) => {
            console.log("Unable to delete user", err);
        });

    // db.close();
})