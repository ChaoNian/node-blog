var fork = require('child_process').fork;
var cpus = require('os').cpus();
console.log(cpus, '__dirname');
for (var i = 0; i < cpus.length; i++) {
  fork(__dirname + '/worker.js');
}