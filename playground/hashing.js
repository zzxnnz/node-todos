const b = require("bcryptjs");

var password = "180rus!";

b.genSalt(10, (err, salt) => {
    b.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});


var hashedPassword = "$2a$10$9j7KjCPhqaGu87M6GMexQ.voHFnh8Q9QPYA9OxoN4FrEpV7qsy1w.";

b.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});













// const jwt = require("jsonwebtoken");

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, "abc");

// console.log(token);

// var decoded = jwt.verify(token, "a");

// console.log(decoded);



// const {SHA256} = require("crypto-js");

// var message = "I'm user number 3";

// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };

// // Data can be changed here
// // token.data.id = 3;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// // Checking hash
// var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();

// if(resultHash === token.hash) {
//     console.log("accepted");
// } else {
//     console.log("rejected");
// }