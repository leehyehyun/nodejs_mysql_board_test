var template = require('./template');
var db = require('./db');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request,response){
    db.query(`select posts.id, title, description, created, writer_id, name, profile
     from posts left join writer on posts.writer_id=writer.id order by posts.id desc`
    ,function(error, posts){
        if(error){
            throw error;
        }
        var html = `
        <p>
            <table>
            <tr>
                <td>No</td>
                <td>제목</td>
                <td>글쓴이</td>
                <td>등록일</td>
            </tr>
            ${template.borderTable(posts)}
            </table>
        </p>
        <p>
        <a href="/create">글쓰기</a>
        </p>
        <style>
            table{
                border-collapse : collapse;
            }
            td{
                border : 1px solid black;
            }
        </style>
        `;
        response.writeHead(200);
        response.end(template.htmlBody(html));
    });

}

exports.detail = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`select * from posts left join writer on posts.writer_id=writer.id 
    where posts.id=?`
    ,[queryData.id], function(error,post){
        if(error){
            throw error;
        }
        var html = `
        <p>
            <table>
                <tr>
                    <td>제목</td>
                    <td colspan="3">${sanitizeHtml(post[0].title)}</td>
                </tr>
                <tr>
                    <td>글쓴이</td>
                    <td>${sanitizeHtml(post[0].name)}</td>
                    <td>날짜</td>
                    <td>${template.strDate(post[0].created)}</td>
                </tr>
                <tr>
                    <td>내용</td>
                    <td colspan="3">${sanitizeHtml(post[0].description)}</td>
                </tr>
            </table>
        </p>
        <p>
        <a href="/update?id=${queryData.id}">수정</a>
        <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="삭제">
        </form>
        </p>
        <style>
        table{
            border-collapse:collapse;
        }
        td{
            border:1px solid black;
        }
        </style>
        `;
        response.writeHead(200);
        response.end(template.htmlBody(html));
    });
}

exports.create = function(request,response){
    db.query(`select * from writer`,function(error, writer){
        if(error){
            throw error;
        }
        var html = `
        <form action="/create_process" method="post">
            <p>
            <table>
                <tr>
                    <td>제목</td>
                    <td><input type="text" name="title" placeholder="제목을 입력하세요."></td>
                </tr>
                <tr>
                    <td>글쓴이</td>
                    <td>${template.list(writer)}</td>
                </tr>
                <tr>
                    <td>내용</td>
                    <td><textarea name="description" placeholder="내용을 입력하세요."></textarea></td>
                </tr>
            </table>
            </p>
            <input type="submit" value="저장">
        </form>
        <style>
        table{
            border-collapse:collapse;
        }
        td{
            border:1px solid black;
        }
        </style>
        `;
        response.writeHead(200);
        response.end(template.htmlBody(html));
    });
}

exports.create_process = function(request,response){
    var body = '';
    request.on('data',function(data){
        body += data;
    });
    request.on('end',function(){
        var post = qs.parse(body);
        db.query(`insert into posts (title,description,created,writer_id) values(?,?,now(),?)`
        ,[post.title, post.description, post.writer],function(error,result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
        });
    });
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`select posts.id, title, description, created, writer_id, name, profile
     from posts left join writer on posts.writer_id=writer.id where posts.id=?`
    ,[queryData.id],function(error, post){
        if(error){
            throw error;
        }
        db.query(`select * from writer`,function(error2, writer){
            if(error2){
                throw error2;
            }
            var html = `
            <form action="/update_process" method="post">
                <p>
                <input type="hidden" name="id" value="${queryData.id}">
                <table>
                    <tr>
                        <td>제목</td>
                        <td><input type="text" name="title" value="${sanitizeHtml(post[0].title)}"></td>
                    </tr>
                    <tr>
                        <td>글쓴이</td>
                        <td>${template.list2(writer, post[0].writer_id)}</td>
                    </tr>
                    <tr>
                        <td>내용</td>
                        <td><textarea name="description">${sanitizeHtml(post[0].description)}</textarea></td>
                    </tr>
                </table>
                </p>
                <input type="submit" value="수정">
            </form>
            <style>
            table{
                border-collapse:collapse;
            }
            td{
                border:1px solid black;
            }
            </style>
            `;
            response.writeHead(200);
            response.end(template.htmlBody(html));
        });
    });
}

exports.update_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end',function(){
        var post = qs.parse(body);
        db.query(`update posts set title=?, description=?, writer_id=? where id=?`
        ,[post.title, post.description, post.writer, post.id],function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
        });
    });
}

exports.delete_process = function(request,response){
    var body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end',function(){
        var post = qs.parse(body);
        db.query(`delete from posts where id=?`
        ,[post.id],function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
        });
    });
}

