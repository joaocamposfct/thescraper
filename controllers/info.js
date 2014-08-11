/**
*	Info controller
*/

var request = require('request');
var async = require('async');
var j;
var competitors = [];
var competitorId = 0;
var _this = this;

exports.parseFight = function(fightUnparsed, callback){
	var fight = {};
	fight.competition_name = fightUnparsed.competition_name;
	fight.id_person_blue = fightUnparsed.id_person_blue;
	fight.id_person_white = fightUnparsed.id_person_white;
	fight.id_winner = fightUnparsed.id_winner;
	fight.duration = fightUnparsed.duration;
	fight.ippon_b = fightUnparsed.ippon_b;
	fight.waza_b = fightUnparsed.waza_b;
	fight.yuko_b = fightUnparsed.yuko_b;
	fight.penalty_b = fightUnparsed.penalty_b;
	fight.ippon_w = fightUnparsed.ippon_w;
	fight.waza_w = fightUnparsed.waza_w;
	fight.yuko_w = fightUnparsed.yuko_w;
	fight.penalty_w = fightUnparsed.penalty_w;
	fight.age = fightUnparsed.age;
	fight.weight = fightUnparsed.weight;
	fight.date_raw = fightUnparsed.date_raw;
	fight.family_name_white = fightUnparsed.family_name_white;
	fight.given_name_white = fightUnparsed.given_name_white;
	fight.country_white = fightUnparsed.country_white;
	fight.family_name_blue = fightUnparsed.family_name_blue;
	fight.given_name_blue = fightUnparsed.given_name_blue;
	fight.country_blue = fightUnparsed.country_blue;
	callback(fight);
};

exports.getFights = function(categories, gender, count, callback){
	if(gender === 'f') count += 7;
	var competitorLength = categories[count.toString()].competitors.length;
	var i = 0;
	console.log('count: ' + count);
	console.log('cLength: ' + competitorLength);
	j = 0;
			async.whilst(
				function() {return i < competitorLength},
				function(callbackCompetitors){
					var competitor = {};
					async.parallel([
						function(callbackReq){
							competitor.id_person =  categories[count.toString()].competitors[j].id_person;
								var family_name = categories[count.toString()].competitors[j].family_name.toLowerCase();
								family_name[0].toUpperCase;
								competitor.name = categories[count.toString()].competitors[j].given_name + ' ' + family_name;
								competitor.country = categories[count.toString()].competitors[j].country;
								competitor.weight_name = categories[count.toString()].competitors[j].weight_name;
								competitor.gender = categories[count.toString()].competitors[j++].gender;
								callbackReq();
							},
						function(callbackReq){
							url_fight_stats = 'http://data.judobase.org/api/get_json?_ts=1407753954224&params%5Baction%5D=competitor.fights_statistics&params%5Bid_person%5D=' + competitor.id_person;
							request(url_fight_stats, function(error, response, body){
								competitor.fights_stats = body;
								callbackReq();
							});
						},
						function(callbackReq){
							url_fights = 'http://data.judobase.org/api/get_json?_ts=1407757319161&params%5Baction%5D=contest.find&params%5Bid_person%5D=' + competitor.id_person;
								request(url_fights, function(error, response, body){
									competitor.fights = JSON.parse(body).contests;
								});
								callbackReq();
						}

					], function(err){
						if(err) console.log(err);
						done = true;
						competitors.push(competitor);
						console.log(competitors.length);
						i++;
						callbackCompetitors();
					});
				},
				function(err){
					if(err) contests.log(err);
					console.log(gender + ' ' + j);
					callback();
				});
		//}
		

		/*setTimeout(function(){console.log(gender +' ' +j);
			callback();}, 60000);*/
};


exports.getCompetitors = function(gender, mastercallback){
url = 'http://data.judobase.org/api/get_json?_ts=1407426119434&params%5Baction%5D=wrl.by_category&params%5Blimit%5D=2200&params%5Bgender%5D='+ gender +'&params%5Bpart%5D=info%2Cpoints';
	competitors = [];
				var categories;
			request(url, function(error, response, body){
				if(error) console.log(error);
				var categoriesCount = 0;
				categories = JSON.parse(body).categories;
				async.series([
					function(callback){
						for(category in categories){
							if(categories.hasOwnProperty(category)){
								categoriesCount++;
							}
						}
						callback();
					},
					function(callback){
						var count = 1;
							async.whilst(
								function() { return count <= categoriesCount },
								function(callback2){
									_this.getFights(categories, gender, count, function(){
										count++;
										callback2();
									});
								},
								function(err){
									if(err) console.log('Error number 1');
									callback();
								}
							);
						
					},
					function(callback){
						console.log('3rd ' +  gender);
						console.log(competitors.length);
						console.log(competitors.length === 2135);
						callback();
						mastercallback(competitors);
					}
				]);

			});
};