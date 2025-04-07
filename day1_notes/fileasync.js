var inputfile = require ('fs');
var data = inputfile.readFile('sample.txt', 'utf8', function(err, data){
    console.log(data);
});

console.log('Done!');