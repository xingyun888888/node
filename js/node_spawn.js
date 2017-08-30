/**
 * Created by gaochao on 8/29/17.
 */
const cp = require("child_process");


const fs = require("fs");


let file = fs.createWriteStream("./baidu.html");

let curl  = cp.spawn("curl",["https://www.baidu.com"]);

curl.stdout.on("data",function(data){
    file.write(data)
})

curl.stdout.on("end",function(data){
    file.end();
    console.log("download to baidu.html");
})
curl.on("exit",function(code){
    if(code != 0){
        console.log("Failed"+code);
    }
})
console.log("");
