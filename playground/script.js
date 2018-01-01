var prom = new Promise((res, rej) => {
    if(true) {
        res("OK");
    } else {
        rej("NOPE");
    }
})


function func(x) {
    return prom.then((data) => {
        return x + data;
    });
}

function f() {
    return 10;
}


function main() {
    prom.then((data) => {
        return data;
    }).then((data) => {
        return data;
    }).then((data) => {
        console.log(data);
    });
}

main();