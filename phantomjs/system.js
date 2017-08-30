/**
 * Created by gaochao on 8/30/17.
 */
var system = require("system")

var env = require("system").env;

if(system.args.length  === 1){
    Object.keys(env).forEach(function(key){
        console.log(key+"="+env[key]);
    })
}else{
    system.args.forEach(function(arg,i){
        console.log(i+":"+arg)
    })
}

phantom.exit();