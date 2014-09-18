//hackmaster2014
var express = require('express'),
   //config = require('./config'),
    toobusy = require('toobusy'),
    redis   = require("redis"),
    r       = redis.createClient(),
    app     = module.exports = express();
//session with redis
var session = require('express-session')
, RedisStore = require('connect-redis')(session);    
// middleware which blocks requests when we're too busy
app.use(function(req, res, next) {
    if (toobusy()) 
        res.send(503, "Hack_Mast3r_503");
    else 
        next();
});

// Common Configuration
    app.use(express.compress()); // compressing for static files
    app.use(express.favicon(__dirname + '/public/images/favicon.ico',{ maxAge: 2592000000 }));
    app.use(express.static(__dirname + '/public',{maxAge: 864000}));  //ten days caching
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ key:'excelhackm' ,store: new RedisStore, secret:"BadboyaHackMasteryds8a7" }));
    app.use(setSession);
    app.use(app.router);

function setSession(req, res, next){
    if(!req.session)
        req.session = {cwd:'/'};
    if(!req.cookies)
        req.cookies = {};
    next();
}

    
r.on("error", function (err) {
  console.log("Error " + err);
  process.exit(0);
});
// Routes
require('./routes')(app, r);
app.listen(process.env.PORT || 8080);


