let i = 0;

process.on('message', (str) => {

    let now = Date.now();

    let [data, time] = str.split('|')

    console.log(i++, now - Number(time));

});