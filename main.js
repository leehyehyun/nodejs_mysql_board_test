var http = require('http');
var url = require('url');
var board = require('./lib/board');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    if(pathName === "/"){
        board.home(request,response);
    }else if(pathName === "/detail"){
        board.detail(request,response);
    }else if(pathName === "/create"){
        board.create(request,response);
    }else if(pathName === "/create_process"){
        board.create_process(request,response);
    }else if(pathName === "/update"){
        board.update(request,response);
    }else if(pathName === "/update_process"){
        board.update_process(request,response);
    }else if(pathName === "/delete_process"){
        board.delete_process(request,response);
    }else{
        response.writeHead(404);
        response.end('NOT FOUND');
    }
    
});
app.listen(3000);
