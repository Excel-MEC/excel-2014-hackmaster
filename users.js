/** Users Module */

var util=require('./util');
var validator = require('validator');   //npm install validator
var mom = require('moment');
module.exports = function(r){
  var createUser = function(username, password, email, cb){
    username = username.replace(/\W/g, '');
    var hash = util.hash(password);
    //check if user already exists
    var userInDB = r.sismember("users",username, function(err,res){
      if(err)
        cb(false);
      else{
        if(res)
          cb(false);
        else{
          r.sismember('uniq_emails', email, function(err, res){   //look  for unique emails
            if(res)
              cb(false);
            else                                                     //callback nightmare :(
            r.sadd("users", username, function(){
              r.set("passwords:"+username, hash, function(){
                r.sadd("uniq_emails",email,function(){
                 r.set("emails:"+username, email, function(){
                    var timestamp = Math.round(new Date().getTime());
                    var timestamp_future = 4232137830429*4; // some time in future
                    var highscore = parseFloat(1+parseFloat((timestamp_future-timestamp)*Math.pow(10,-13))); //account timestamp.
                    r.zadd("scoreset", highscore, username, function(){  //initialize each user with score 1.(bigvalue-timestamp).
                      r.set('lastlogin:'+username, mom().format('MMMM Do YYYY, h:mm:ss a'), function(){
                        cb(true);
                      });
                      //cb(true);
                    });
                 });
                });
              });
            });
          });
        }
      }
    });
  };
  var checkPass = function(username, password, cb){
    r.get("passwords:"+username, function(err, res){
      if(err)
        cb(false);
      else{
        if(util.hash(password)==res){
          r.get("lastlogin:"+username,function(err, res1){
              if(err)                                                                                                    //old to new bug fix remove for fresh deployment
                r.set("lastlogin:"+username, mom().format('MMMM Do YYYY, h:mm:ss a'), function(err, res2){
                  cb(true);
                });
              else
                r.set("lastlogin:"+username, mom().format('MMMM Do YYYY, h:mm:ss a'), function(err, res2){
                  cb(res1);
                });
          });
          //cb(mom().format('MMMM Do YYYY, h:mm:ss a'));
        }
        else
          cb(false);
      }
    })
  }

  var getUsers = function(cb){
    var results = r.smembers("users", function(err,res){
      if(err)
        cb(false);
      else
        cb(res);
    });
  };
  //get the rank of a user
  var getRank = function(username, cb){                                                       //need to test
    var rank = r.zrevrank("scoreset", username, function(err,res){ 
     if(err)
        cb(false);
      else
        r.sismember("users", username, function(err,res1){
            if(res1)
                cb(res+1);
            else
                cb(false);
        });
    });
  };
  //return the users in order of the rank
  var getRanklist = function(cb){
    var ranklist = r.zrevrangebyscore("scoreset", '+inf', '-inf', function(err,res){          //need to test
      //test      
      if(err)
        cb(false);
      else{
        cb(res);
      }
    });
  };
  var solved = function(username, id, cb){
    r.sismember("solved:users:"+username, id, function(err,res){
    if(res);
    else
    r.sadd("solved:users:"+username, id, function(){
      r.sadd("solved:problems:"+id, username, function(){
        var timestamp = Math.round(new Date().getTime());
        var timestamp_future = 4232137830429*4; // some time in future
        var highscore = parseFloat(100+parseFloat((timestamp_future-timestamp)*Math.pow(10,-13))); //zadd leaderboard highscore.(Long.MAX_VALUE-timestamp) player_id
        r.zincrby("scoreset", highscore, username, function(){    
          r.set("last_timestamp:"+username, new Date().getTime(),function(){
            if(cb)
              cb(true);
          });
        });
      });
    });
   });
}

  //returns users who have solved a given problem
  var getSolvers = function(id, cb){
    r.smembers("solved:problems:"+id, function(err,res){
      if(err)
        cb([]);
      else
        cb(res);
    });
  };

  //returns problems solved by a user
  var getSolved = function(username, cb){
    r.smembers("solved:users:"+username, function(err,res){
      if(err)
        cb([]);
      else
        cb(res);
    });
  };

  return {
    get: getUsers,
    create: createUser,
    checkPass: checkPass,
    markSolved: solved,
    solvers: getSolvers,
    solvedProblems: getSolved,
    rank  : getRank,
    ranklist : getRanklist
  }
};
