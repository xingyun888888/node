
/**
 * Created by zhimeiMAC on 5/27/17.
 */
var cheerio = require('cheerio');

var http  = require('http');

var iconv = require('iconv-lite');

var xlsx  = require('node-xlsx');

var fs  =require('fs');


var request = require("request");


var rest = require('restler');
//var tesseract = require('node-tesseract');

var qs = require("querystring");


var i = 0;
function fetchPage(x) {     //封装了一层函数
    startRequest(x);
}






http.get("http://wx.openjfenz.com/Public/web/js/ask_main.js", function(sres) {
    //sres.setEncoding("utf-8");//防止中文乱码
    var chunks = [];
    sres.on('data', function (chunk) {
        chunks.push(chunk);

    });
    // chunks里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`
    // 剩下就都是 jQuery 的内容了
    sres.on('end', function () {
        //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
        //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
        var js = iconv.decode(Buffer.concat(chunks), 'utf-8');
        fs.appendFile('./js/ask_main.js?1706', js, 'utf-8', function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

})




return;











//var url = 'http://www.ygdy8.net/html/gndy/dyzz/index.html';
//var url = 'http://www.sina.com.cn/api/hotword.json';
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
fetchPage(url);
// function getData(url){
//     var request = arguments.callee;
//     rest.get(url).on('complete',function(data,response){
//         var obj = data;
//         fs.appendFile('./data/' + obj.data.tl+ '.txt', obj.data.cn, 'utf-8', function (err) {
//             if (err) {
//                 console.log(err);
//             }
//         });
//         console.log(obj.data.other);
//         var next_id = obj.data&&obj.data.other&&obj.data.other.next_id;
//         if(next_id){
//             request("http://api.loganinvest.com/Api/news/detail?id="+next_id);
//         }else{
//             return;
//         }
//     })
// }
//
// getData("http://api.loganinvest.com/Api/news/detail?id=4a14193d-7af1-4c0b-9962-174510743b90");


//var url = "http://loganinvest.com/about.html";
// var body = [];
// var req = http.request({hostname:'api.loganinvest.com',path:"/Api/news/detail",port:80,method:'POST',headers: {
//     'Accept': 'application/vnd.ziqitong.v1+json*',
//     'User-Agent': 'Restler for node.js',
//     "apiToken": '',
//     'Authorization':`Bearer `,
//     'Host':'api.loganinvest.com',
//     "Connection":"keep-alive",
//     "Accept-Encoding":"gzip, deflate, sdch",
//     "Content-Length":0,
//     'Content-Type':'application/x-www-form-urlencoded'
// }},function(res){
//     res.on('data',function(chunk){
//         body.push(chunk);
//     });
//     res.on('end',function(){
//         var obj =JSON.parse(Buffer.concat(body).toString());
//         //console.log(obj.data);
//         fs.appendFile('./data/' + obj.data.tl+ '.txt', obj.data.cn, 'utf-8', function (err) {
//             if (err) {
//                 console.log(err);
//             }
//         });
//         getData("http://api.loganinvest.com/Api/news/detail?_="+obj.data.cid);
//     })
// });
// req.write("");
// req.end();

//var titles =[['title']];
var time = null;
 function startRequest(x){
     http.get(x, function(sres) {
         //sres.setEncoding("utf-8");//防止中文乱码
         var chunks = [];
         sres.on('data', function(chunk) {
             chunks.push(chunk);

         });
         // chunks里面存储着网页的 html 内容，将它传给 cheerio.load 之后
         // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`
         // 剩下就都是 jQuery 的内容了
         sres.on('end', function() {
             //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
             //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
             var html = iconv.decode(Buffer.concat(chunks), 'utf-8');
             //采用cheerio模块解析html
             var $ = cheerio.load(html, {decodeEntities: false});


             var time = $('.article-info a:first-child').next().text().trim();

             var news_item = {
                 //获取文章的标题
                 title: $('div.article-title a').text().trim(),
                 //获取文章发布的时间
                 Time: time,
                 //获取当前文章的url
                 link: "http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
                 //获取供稿单位
                 author: $('[title=供稿]').text().trim(),
                 //i是用来判断获取了多少篇文章
                 i: i = i + 1,

             };

             console.log(news_item);     //打印新闻信息



             var news_title =$('div.article-title a').text().trim();

             savedContent($,news_title);  //存储每篇文章的内容及文章标题

             savedImg($,news_title);    //存储每篇文章的图片及图片标题
            // 下一篇文章的url
             var nextLink="http://www.ss.pku.edu.cn" + $("li.next a").attr('href');
             str1 = nextLink.split('-');  //去除掉url后面的中文
             str = encodeURI(str1[0]);
             //这是亮点之一，通过控制I,可以控制爬取多少篇文章.
             if (i <= 20) {
                 time =  setInterval(function(){
                     fetchPage(str)
                 },3000);
             }else{
                clearInterval(time);
                time=null;
             }

             i++;
         });

     });
 }
    //该函数的作用：在本地存储所爬取的新闻内容资源
    function savedContent($, news_title) {
        $('.article-content p').each(function (index, item) {

            var x = $(this).text();

            var y = x.substring(0, 2).trim();

            console.log("文章--------------"+x);
           // if (y == '') {
                x = x + '\n';
                //将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
                fs.appendFile('./data1/' + news_title + '.txt', x, 'utf-8', function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
           // }
        })
    }

    //该函数的作用：在本地存储所爬取到的图片资源
    function savedImg($,news_title) {
        $('.article-content img').each(function (index, item) {
            var img_title = $(this).parent().next().text().trim();  //获取图片的标题
            if(img_title.length>35||img_title==""){
                img_title="Null";}
            var img_filename = img_title + '.png';

            console.log($(this).attr("src"));
            var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url

    //采用request模块，向服务器发起一次请求，获取图片资源
            request.head(img_src,function(err,res,body){
                if(err){
                    console.log(err);
                }
            });
            request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
        })
    }
        //
        // $('.co_content8 .ulink').each(function (idx, element) {
        //             var $element = $(element);
        //             titles.push([
        //                 $element.text()+$element.attr('href')
        //             ])
        // })
        //
        // var buffer = xlsx.build([{
        //     name: 'mySheet',
        //     data: titles
        // }]);

    //
    //     fs.writeFile('test.xlsx', buffer, {
    //         'flag': 'w+'
    //     }, function(err) {
    //         if (err) {
    //             return console.error(err);
    //         }
    //         console.log("写入成功");
    //     });
    //     console.log(titles);
    // });

//
// tesseract.process(__dirname + '/640webp-4_4-130*130.jpg',function(err, text) {
//     if(err) {
//         console.error(err);
//     } else {
//         console.log(text);
//     }
// });



// function getBtLink(urls, n) { //urls里面包含着所有详情页的地址
//     console.log("正在获取第" + n + "个url的内容");
//     http.get('http://www.ygdy8.net' + urls[n].title, function(sres) {
//         var chunks = [];
//         sres.on('data', function(chunk) {
//             chunks.push(chunk);
//         });
//         sres.on('end', function() {
//             var html = iconv.decode(Buffer.concat(chunks), 'gb2312'); //进行转码
//             var $ = cheerio.load(html, {decodeEntities: false});
//             $('#Zoom td').children('a').each(function (idx, element) {
//                 var $element = $(element);
//                 btLink.push({
//                     bt: $element.attr('href')
//                 })
//             })
//             if(n < urls.length - 1) {
//                 getBtLink(urls, ++count);
//             } else {
//                 console.log("btlink获取完毕！");
//                 console.log(btLink);
//             }
//         });
//     });
// }