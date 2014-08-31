//hackmaster2014
var cluster = require('cluster');
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.log("SERVER started on port : 8080");
    console.log("CPU's detected         : "+cpuCount);
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) 
        cluster.fork();
    // Listen for dying workers
    cluster.on('exit', function (worker) {
        console.log('WORKER ' + worker.id + ' DEAD !');
        cluster.fork();
    });
// Code to run if we're in a worker process
} else {
var express = require('express'),
   //config = require('./config'),
    toobusy = require('toobusy'),
    redis   = require("redis"),
    r       = redis.createClient(),
    app     = module.exports = express();
// middleware which blocks requests when we're too busy
app.use(function(req, res, next) {
    if (toobusy()) 
        res.send(503, "Hack_Mast3r_503");
    else 
        next();
});
function setSession(req, res, next){
    if(!req.session)
        req.session = {cwd:'/'};
    if(!req.cookies)
        req.cookies = {};
    next();
}
// Common Configuration
app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.session({ 'key':'excelhackm',secret: "BadboyaHackMasteryds8a7" }));
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(setSession);
    app.use(app.router);
});
r.on("error", function (err) {
  console.log("Error " + err);
  process.exit(0);
});
// Routes
require('./routes')(app, r);
app.listen(process.env.PORT || 8080);
console.log('WORKER ' + cluster.worker.id + ' now RUNNING !');
process.on('SIGINT', function() {
  server.close();
  // calling .shutdown allows your process to exit normally
  toobusy.shutdown();
  process.exit();
});
}