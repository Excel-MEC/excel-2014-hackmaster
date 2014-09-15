var problems = require("./problem"),
    ExpressBrute = require('express-brute'),
    moment = require('moment'),     
    redstore = require('express-brute-redis');

var failCallback = function (req, res, next, nextValidRequestDate) {
    res.json("\n\n\"A Jedi uses the Force for knowledge and defense, never for attack.\" \nThe admin might mistake this for a bruteforce. Try again in "+moment(nextValidRequestDate).fromNow()+"\n\n"); 
};

var store = new redstore({
      host: '127.0.0.1',
      port: 6379,
      prefix: 'f_hater'
    }),
    login_bruteforce = new ExpressBrute(store,{
      freeRetries: 50,
      minWait: 5*60*1000,
      maxWait: 60*60*1000,
      //lifetime: 24*60*60*1000, // 1 hour time out
      failCallback : failCallback
    }),
    submit_bruteforce =  new ExpressBrute(store,{
      freeRetries: 50,
      minWait: 5*60*1000,
      maxWait: 60*60*1000,
      //lifetime: 3*60*60*1000, // 1 hour time out
      failCallback : failCallback
    }),
    register_bruteforce =  new ExpressBrute(store,{
      freeRetries: 5,
      minWait: 200*60*1000,
      maxWait: 600*60*1000,
      //lifetime: 24*60*60*1000, // 1 day time out
      failCallback : failCallback
    }),
    util = require("./util");
//Express App, Configuration, Redis db
var auth= function(req,res, next){
  if(req.session.username)
    next();
  else
    res.json("You need to be logged in to perform this action");
}

module.exports=function(app, r){
  var users= require('./users')(r);
  function dbError(res){
    res.json("There was an error in performing your request.")
  }
  /**
   * Displays a problem
   * Uses markdown
   * and guesses problems if id is numeric
   * Also saves the current viewing problem inside session
   */
  app.get('/problem/:id',function(req,res){
    var id = parseInt(req.params.id);
    req.session.problemId = id;//Save the current problem Id for later use
    var title = problems.getTitle(id);
    var html = problems.getHTML(id); 
    if(!html)
    {
      res.json("[[;;;red]No such problem]");
    }
    else
    {
      users.solvers(id, function(solvers){
        msg = [
          {msg:"[[b;;]"+id+". "+title+"]"},
          {msg:html,raw:true},
          "[[b;;;]\nCracked by "+solvers.length+" hacker(s).]"
        ];
        res.json(msg);  
      });
    }
  }); /**
   * Respond back with the username
   */ 
  app.get('/whoami', function(req,res){
    res.json(req.session.username|| "guest");
  });
  app.get('/hacker/:username', function(req,res){
    users.solvedProblems(req.params.username, function(response){
      if(response.length==0)
        res.json("No Reported Hacks.");
      else
        res.json(["Hacks by "+req.params.username+": ", response.join(", ")]);
    })
  });
  app.get('/rank', function(req, res){
    if(req.session.username !== 'guest')
      res.redirect('/rank/'+req.session.username);
  });
  app.get('/rank/:username',function(req,res){
    users.rank(req.params.username, function(response){
        if(response)
            res.json(["Rank of "+req.params.username+": "+response]);
        else
            res.json(["Not registered hacker"]);
    });
  });
  app.get('/leaderboard',function(req,res){
    res.redirect('/leaderboard/10');
  });

  app.get('/leaderboard/:top',function(req, res){
    reply="";
    if(req.params.top)
    users.ranklist(function(response){
        for(i=0 ; i<req.params.top && i<response.length ; i++){
            reply+=((i+1)+". "+response[i]+"\n");
        }
        res.json("Leaderboard :-\n"+reply);
    });
    else
      res.json("invalid limit.")
  });

  app.get('/register/:username/:password/:email', register_bruteforce.prevent, function(req, res){        //bruteforce (experimental not battle tested)
    if(req.session.username === 'guest' || req.session.username == null ){
      var username = req.params.username.replace(/\W/g, '');
      var re = /\S+@\S+\.\S+/;
      if(re.test(req.params.email))
        users.create(username, req.params.password, req.params.email, function(result){
          if(result){
            req.session.username = username;
            res.json("User successfully created.");
          }
          else
            res.json("[[;;;red]Error! Try a different username or enter a valid email-id.(usernames can only contain a-z,A-Z, 0-9 characters).");      
        });
      else
        res.json("[[;;;red]Error! invalid email-id");
    }
    else
      res.json("[[;;;red]Error ! session is live. logout to proceed");
  });

  app.get('/login/:username/:password', login_bruteforce.prevent, function(req,res){
    var username = req.params.username.replace(/\W/g, '');
    users.checkPass(username, req.params.password, function(response){
      if(response==true){
        //console.log("** login by : "+username);
        req.session.username = username;
        res.json("welcome "+ req.params.username+".");
      }
      else
        res.json("[[;;;red]Error in logging in.");
    })
  })
  /**
   * Some basic help text 
   */
  app.get('/help',function(req,res){
    res.json([
      { raw: true, msg:"You can type the following commands: "},
      { msg:'[[b;;;white]register <username> <password> <email-id>] to register for Hackmaster.' },
      { msg:'[[b;;;white]login <username> <password>] to login.' },
      { msg:'[[b;;;white]problem <ID>] to view a particular problem' },
      { msg:'[[b;;;white]submit <ID> <Solution>] to submit a solution for a problem'  },
      { msg:'[[b;;;white]hacker <username>] to see the profile of a hacker.' },
      { msg:'[[b;;;white]leaderboard] to see the top 10 hackers.' },
      { msg:'[[b;;;white]leaderboard <N>] to see the top N hackers.' },
      { msg:'[[b;;;white]rank <username>] to see the rank of a hacker, defualt shows your rank.' },
      { msg:'[[b;;;white]logout] to exit.' },
      { msg:'Several other terminal commands (like [[;;;red]clear, ls, cd, whoami] etc) are also supported.' }
    ]);
  });

  /** Problem related routes */
  /** Get a list of Problems */
  app.get('/problems',function(req,res){
    res.redirect('/problems/1/10');
  });

  //Fix a typo
  app.get('/problems/:id', function(req,res){
    res.redirect('/problem/'+req.param.id);
  });

  //Fix another typo
  app.get('/problem/:start/:end', function(req,res){
    res.redirect('/problems/'+req.params.start+"/"+req.params.end);
  });

  //Show the problems in a table
  app.get('/problems/:start/:end', function(req,res){
    var start=parseInt(req.params.start), end=parseInt(req.params.end);
    start = start<=0?1:start;
    response = ["Showing problems "+start+" to "+end];
    for(var i=start;i<=end;i++){
      if(i>430)
        break;
      response.push("[[b;;;]"+util.pad(i.toString(),3,' ',1)+".] "+problems.getTitle(i));
    }
    res.json(response);
  });
  app.get('/submit/:id/:solution', submit_bruteforce.prevent, auth, function(req, res){
    var id = parseInt(req.params.id);
    if(problems.check(id, req.params.solution)){
      res.json("You have Cracked it.");
      users.markSolved(req.session.username, id);
    }
    else{
      res.json("Sorry old sport, Wrong Answer.");
    }
  });
  /** Session aware routes **/
  app.get('/pwd',function(req,res){
    if(!req.session.cwd)
      req.session.cwd = '~';
    res.json(req.session.cwd);
  });

  app.get('/ls',function(req,res){
    var cwd = req.session.cwd||'/';
    switch(cwd){
      case 'problems':
        var response=''
        for(var i=1;i<=30;i++){
	  if(i<10)
	  response+="0"+i+"\t";
	  else
          response+=i+"\t";
          if(i%10==0)
            response+="\n";
        }
        res.json(response);
        break;
      case 'hackers':
        users.get(function(userList){
          var response='';
          for(i in userList){
            response+=userList[i]+"\n";
          }
          res.json("(Blacklist)\n"+response);
        });
        break;
      default:
        res.json('[[b;;;]problems/]  README.txt [[b;;;]hackers/]');
    }
  });

  app.get(/(file|open|cat|more|less)\/(\S+)/,function(req,res){
    var cwd = req.session.cwd || '~';
    var cmd=req.params[0];
    var file = req.params[1];
    switch(cwd){
      case '~':
        if(file == 'README.txt')
          res.json([
            {msg: 'Rules',raw:true},
            {msg: '1. Hackmaster is an online, individual event.'},
            {msg: '2. Professionals are NOT allowed to participate.'},
            {msg: '3. Attacking or flooding the server will lead to disqualification.'},
            {msg: '4. Multiple accounts from a participant are NOT allowed.'},
            {msg: '5. Participants suspected of using unfair means WILL BE disqualified.'},
            {msg: '6. Any misuse of the Hackmaster forum will lead to immediate disqualification.'},
            {msg: '7. The decisions and judgement of the coordinators will be final.'},
            {msg: '8. Rules are subject to change at any point in time.'},
            {msg: '9. Different levels will carry different weightage according to difficulty.'},
            {msg: ' '}
          ]);
        else
          res.json("cat: "+file+": No such file or directory");
        break;
      case 'problems':
        res.redirect('/problem/'+parseInt(file));
        break;
      case 'hackers':
        res.redirect('/hacker/'+file);
        break;
      default:
        res.json(cmd+": "+file+": No such file or directory");
    }
  });

  app.get('/cd/:dir?',function(req,res){
    var cwd = req.session.cwd;
    var dir = req.params.dir || '~';
    if(dir == '~' || dir == 'hackers' || dir == 'problems')
    {
      req.session.cwd = dir//change directory
      res.redirect('/pwd');//notify user of directory change
    }
    else
      res.json("[[;;;red]Invalid Directory.]");
      //invalid directory
  });

  app.get('/hash/:str', function(req, res){
      var md5=require("MD5");
      var sha1=require("sha1");
      res.json(md5(sha1(req.params.str)));
  });
  app.get('/logout', function(req,res){
      req.session.cwd='~';
      req.session.username='guest';
      res.json("Session Terminated.");
  });
  app.get('*',function(req,res){
      res.json("[[;;;red]Command not found.");
  });
}
