'use strict'

var express = require("express");

var path = require('path');

var app = express()

var port = process.env.PORT || 2005;

app.listen(port);

app.use('/assets',express.static(__dirname + '/public'));

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/assets', function(req,res){
	res.send('pages')
	res.send('js')
	res.send('css')
})