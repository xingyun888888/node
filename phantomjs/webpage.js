var page = require("webpage").create()


page.open("http://cnblogs.com/",function(){
   page.render("cnblog.png");
   phantom.exit();
})
