var inputfile = require ('fs');
var data = inputfile.readFileSync('sample.txt', 'utf8');
console.log(data);
console.log('Done!');