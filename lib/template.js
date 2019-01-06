var sanitizeHtml = require('sanitize-html');
var template = require('./template');

exports.htmlBody = function(html){
    var htmlbody = `
        <!doctype html>
        <html>
        <head>
            <title>게시판 만들기 연습</title>
            <meta charset="utf-8">
        </head>
        <body>
            <a href="/">첫 페이지로 이동</a>
            ${html}
        </body>
        </html>
        `;
    return htmlbody;
}

exports.strDate = function(date){
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    var strDate = yyyy+'-'+mm+'-'+dd+' '+hour+':'+minute+':'+second;
    return strDate;
}

exports.borderTable = function(posts){
    var tag = '';
    var i = 0; 
    while (i < posts.length){
        tag += `<tr>
            <td>${posts[i].id}</td>
            <td><a href="/detail?id=${posts[i].id}">${sanitizeHtml(posts[i].title)}</a></td>
            <td>${sanitizeHtml(posts[i].name)}</td>
            <td>${template.strDate(posts[i].created)}</td>
        </tr>`
        i++;
    }
    return tag;
}

exports.list = function(writer){
    var option = `<select name="writer">`;
    var i = 0;
    while (i < writer.length){
        option += `<option value="${writer[i].id}">${sanitizeHtml(writer[i].name)}</option>`;
        i++;
    }
    return option+`</select>`;
}

exports.list2 = function(writer, selected_writer){
    var option = `<select name="writer">`;
    var i = 0;
    while (i < writer.length){
        var selected = '';
        if(writer[i].id === selected_writer){
            selected = ' selected';
        }
        option += `<option value="${writer[i].id}" ${selected}>${sanitizeHtml(writer[i].name)}</option>`;
        i++;
    }
    return option+`</select>`;
}
