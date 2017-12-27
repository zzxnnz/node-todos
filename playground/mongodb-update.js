// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", 
(err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server", err);
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("5a43928fff37521ecab093b2")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {console.log(JSON.stringify(result, undefined, 2))});


    db.collection("Users").findOneAndUpdate(
        {
            _id: new ObjectID("5a435587f5554714f3cbd637")
        }, {
            $set: {
                name: "Ruslan"
            },
            $inc: {
                age: -4
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });









    // db.close();
})