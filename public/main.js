$(document).ready(function(){
  var user = "player";
  $.getJSON("/whoami", function(data){
    user = data;
    $("#console").terminal(
      function(command, term){
        var write = function(data){
          if($.isArray(data)){
            for(i in data){
              write(data[i]);
            }
          }
          else if(typeof data=='string'){
            term.echo(data, {raw: false});
          }
          else if(typeof data=="object"){
            term.echo(data.msg,{raw:data.raw});
          }
        }
        term.pause();
        if(command.length>1000)
          command="tldr";
        var url = "/"+command.split(' ').join('/');
        if(url=="/cd/.."||url=="/cd//" || url==".." || url=="/cd/~" || url=="/cd/.")
          url = "/cd/~";
        $.getJSON(url, function(data){
          if(data === "~" || data === "problems" || data === "hackers" );
          else
          write(data);
          if(data === "Session Terminated."){
            term.set_prompt('guest@Hackmaster/~# ', function(){});
            term.resume();
          }
          if( url.search("/register")==0||url.search("/login")==0){
            $.getJSON("/whoami", function(data1) {
              $.getJSON("/pwd", function(data2) {
                term.set_prompt(data1 + '@Hackmaster/'+data2+'# ', function(){});
              });
            });
            term.resume();
          } 
          else if(url.search("/cd")==0){
            $.getJSON("/whoami", function(data1) {
              $.getJSON("/pwd", function(data2) {
                term.set_prompt(data1 + '@Hackmaster/'+data2+'# ', function(){});
              });
            });
            term.resume();
          }
          else{
            term.resume();
          }
        });
        $(document).ajaxError(function(e){
          term.resume();
        })
      },
      {
        greetings: '',
        height: $(window).height()-100,
        prompt: user + '@Hackmaster/~# ',
        keydown: function(e, term){
          if(e.keyCode==76 && e.ctrlKey==true)
            term.clear();
        }
      }
    );
  });
});

