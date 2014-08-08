/** Users Module */

var util=require('./util');
var validator = require('validator');   //npm install validator
module.exports = function(r){
  var createUser = function(username, password, email, cb){
    username = username.replace(/\W/g, '');
    var hash = util.hash(password);
    if(validator.isEmail(email)==false)
        cb(false);
    //check if user already exists
    var userInDB = r.sismember("users",username, function(err,res){
      if(err)
        cb(false);
      else{
        if(res){
          cb(false);
        }
        else{
          r.sadd("users", username, function(){
            r.set("passwords:"+username, hash, function(){
               r.set("emails:"+username, email, function(){
                  r.zadd("scoreset", 1, username, function(){  //for leaderboard ranking. initialize each user with score 1.
                    cb(true);
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
        if(util.hash(password)==res)
          cb(true);
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

  var solved = function(username, id, cb){
    r.sismember("solved:users:"+username, id, function(err,res){
    if(res);
    else
    r.sadd("solved:users:"+username, id, function(){
      r.sadd("solved:problems:"+id, username, function(){
        r.zincrby("scoreset", 1, username, function(){      //increase the score by one for each problem solved.
          if(cb)
              cb(true);
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
    solvedProblems: getSolved
  }
};
