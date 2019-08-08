const AWS = require('aws-sdk');  
AWS.config.region = 'us-west-1';

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
exports.handler = async (event,context) => {
    const saying = getRandomSaying();
    console.log({saying,date:new Date()});
    if(process.env.NOTIFICATION_TOPIC_ARN){
        const obj = {
           Message: JSON.stringify(saying),
           TopicArn: process.env.NOTIFICATION_TOPIC_ARN
           };
         const sns = new AWS.SNS();
       await sns.publish(obj, async function (err, data) {
            if (err) {
                console.log("SNS Push Failed:");
                console.log(err.stack);
                return;
            }
            console.log('SNS push succeeded: ' + JSON.stringify(data));
            return data;
        }).promise();
     
   }else{
       console.log('No env var defined: NOTIFICATION_TOPIC_ARN')
   };
   
       const response = {
        statusCode: 200,
        body: JSON.stringify(saying.saying),
    };
   return response;
};