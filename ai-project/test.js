const Sim = require('./../sim');
var express = require('express');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);


var app = express();

stream = new Sim.BattleStream();

var appOutput = [];

(async () => {
    let output;
    while ((output = await stream.read())) {
        console.log(output);
        appOutput.push(output);
    }
})();

stream.write(`>start {"formatid":"gen7randombattle"}`);
stream.write(`>player p1 {"name":"Me"}`);
stream.write(`>player p2 {"name":"AI"}`);

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

rl.setPrompt('');
rl.prompt();
rl.on('line', function(line) {
    stream.write(line);
    stream.write(`>p2 move ` + getRndInteger(1,4));
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/output', function (req, res, next) {
   res.send(JSON.stringify({"output": appOutput.toString()}));
   appOutput = [];
})

var server = app.listen(8081, "127.0.0.1",function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s\n", host, port)
})
