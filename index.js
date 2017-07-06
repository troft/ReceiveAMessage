var Bandwidth = require("node-bandwidth");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);

//Bandwidth Credentials 
var client = new Bandwidth({
    userId    : "u-axqs3dv6in72g4gfyxxcfhy",  
    apiToken  : "t-wq4l4ckbp3eksnqx2dlz2ti",
    apiSecret : "uondfoamf4qdaf2heemwwtocncu2rp3u47b7t5a"
});

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

/*********** Sending A Message ***********/
app.get("/", function (req, res) {
    console.log(req); 
    res.send("Text on Website");
});
var sendMessage = function(params){
    client.Message.send({
        //returns a promise 
        from : params.from, //your bandwidth number 
        to   : params.to,       //number to send to 
        text : "Hello",
        //the media field is not necessary unless sending a picture message
        //media: 
    })
//calls back the message id number and catches any errors 
//is this important?
    .then(function(message){
        messagePrinter(message);
        return client.Message.get(message.id)
        //access ID from json can also get to and from
    })
// prints message to console 
    .then(messagePrinter)
 
// catches any errors     
.catch(function(err){
        console.log(err)
    });
}
var messagePrinter= function (message){
    console.log('Using the message printer');
    console.log(message);
}
app.post("/message-callback", function(req, res){
    var body= req.body; 
    res.sendStatus(200);
    if(body.direction === "in"){
        var numbers={
            to: body.from, 
            from: body.to
        }
        sendMessage(numbers);
    }
});
http.listen(app.get('port'), function(){
    //once done loading then do this (callback)
    console.log('listening on *:' + app.get('port'));
});

