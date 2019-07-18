/*
The purpose of this API is to provide a random saying such
as one that would be found in a fortune cookie.
 */

function loadSayingsSync(){
    if(!process.env.SAYINGS){
        const arr= [];
        require('fs').readFileSync('sayings.txt', 'utf-8').split(/\r?\n/).forEach(function(line){
            arr.push({saying:line});
        });
        console.log("Data initialized at : " + new Date());
        process.env.SAYINGS = JSON.stringify(arr);
    }
   
    return JSON.parse(process.env.SAYINGS);
}



function getRandomSaying(){
    const sayings = loadSayingsSync();
    const max = sayings.length;
    const min = 0;

    const idx =  Math.floor(Math.random()*(max-min+1)+min);
    return sayings[idx];
}

exports.handler = async (event) => {
    const saying = JSON.stringify(getRandomSaying(), null, 4);
    console.log({saying,date:new Date()});
    const response = {
        statusCode: 200,
        body: JSON.stringify(saying),
    };
    return response;
};