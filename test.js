var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

//test

const Sim = require('./sim');
stream = new Sim.BattleStream();

(async () => {
    let output;
    while ((output = await stream.read())) {
        console.log(output);
    }
})();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

stream.write(`>start {"formatid":"gen7randombattle"}`);
stream.write(`>player p1 {"name":"Me"}`);
stream.write(`>player p2 {"name":"AI"}`);


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
