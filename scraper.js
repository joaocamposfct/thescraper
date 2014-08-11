var express = require('express');
var async = require('async');
var app     = express();
var info = require('./controllers/info');
var fs = require('fs');

app.get('/scrape', function(req, res){
	res.setTimeout(0);
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin":"*" });
	var date = new Date().getTime();
	async.series([
		function(master){
			console.log('Fetching info for male competitors');
			info.getCompetitors('m', function(result){
				console.log('Done with the males!');
				fs.writeFile("competitors_male.json", JSON.stringify(result, null, 4), function(err) {
				    if(err) {
				        console.log(err);
				    } else {
				        console.log("The file was saved!");
				        master();
				    }
				}); 		
			});
		},
		function(master){
			console.log('Fetching info for female competitors');
			info.getCompetitors('f', function(result){
				console.log('Done with the females!');
				fs.writeFile("competitors_female.json", JSON.stringify(result, null, 4), function(err) {
				    if(err) {
				        console.log(err);
				    } else {
				        console.log("The file was saved!");
				        master();
				    }
				}); 		
			});
		}
	], function(err, result){
			var endDate = new Date().getTime();
			var seconds = Math.abs((date - endDate)/1000);
			var min = Math.floor(seconds/60);

			seconds -= min*60;
			seconds = Math.round(seconds);
			if(seconds < 10){
				seconds = '0'+seconds;
			}
			console.log('Completed in:'+ min + ':' + seconds);
			res.end('Files saved!');
	});

	
	
	
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 