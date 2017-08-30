const child_process = require('child_process');

let child = child_process.fork('./child.js');

let data = Array(1024 * 1024).fill('0').join('');

    console.log(data);

    setInterval(() => {

       let i = 100;

       while(i--) child.send(`${data}|${Date.now()}`);

}, 1000);




