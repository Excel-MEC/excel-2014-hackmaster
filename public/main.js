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
        term.pause();//pause it till we get a reply
        var url = "/"+command.split(' ').join('/');

        if(url=="/cd/.."||url=="/cd//" || url=="..")
          url = "/cd";
        $.getJSON(url, function(data){
          write(data);
          //update the user name after register or login
          if(url.search("/register")==0||url.search("/login")==0){
            $.getJSON("/whoami", function(data) {
              term.set_prompt(data + '@Hackmaster# ', function(){});
            });
            term.resume();
          } else{
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
        prompt: user + '@Hackmaster# ',
        keydown: function(e, term){
          if(e.keyCode==76 && e.ctrlKey==true)
            term.clear();
        }
      }
    );
  });
});

