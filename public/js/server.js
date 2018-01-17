var express = require("express");
var app = express();

app.get("/login",function(req,res){
	res.sendFile(__dirname + "/login.html");
})

app.listen(80);
