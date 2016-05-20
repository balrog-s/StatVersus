var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser') //to deal with form handling
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
     extended: false
}));
var path = require('path');

app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use(express.static(path.join(__dirname, 'public')));

var APIKEY = '';


var summoner_one_name;
var sum1_id;
var sum1_stats;
var compare_stats;
var summoner_two_name;
var sum2_id;
var sum2_stats;


app.get('/', function(req, res){
     res.sendFile(__dirname + '/public/welcome.html');
});

app.post('/data' , function(req, res){
     summoner_one_name = req.body.sumname1.toLowerCase();
     summoner_two_name = req.body.sumname2.toLowerCase();
     console.log("Summoner One Name: "+summoner_one_name+" Summoner Two Name: "+summoner_two_name);
     request({url:'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'+summoner_one_name+'?api_key='+APIKEY, json:true},function(err, resp, json){
          sum1_id = json[summoner_one_name]['id'];
          request({url:'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/'+sum1_id+'/ranked?api_key='+APIKEY, json:true},function(err, resp, json){
               console.log(json);
               for(var x = 0; x < json['champions'].length; x++){
                    if(json['champions'][x].id == 0){
                         sum1_stats = json['champions'][x]['stats'];
                    }
               }
          request({url:'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'+summoner_two_name+'?api_key='+APIKEY, json:true},function(err, resp, json){
               sum2_id = json[summoner_two_name]['id'];
               request({url:'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/'+sum2_id+'/ranked?api_key='+APIKEY, json:true},function(err, resp, json){
                    for(var x = 0; x < json['champions'].length; x++){
                         if(json['champions'][x].id == 0){
                              sum2_stats = json['champions'][x]['stats'];
                         }
                    }

          /**
          The compared statistics between Summoner 1 and 2. More stats to be added.
          **/
          console.log(sum1_stats);
          var winrate1 = sum1_stats.totalSessionsWon/sum1_stats.totalSessionsPlayed;
          var winrate2 = sum2_stats.totalSessionsWon/sum2_stats.totalSessionsPlayed;
          compare_stats = {
               Summoner_One: sum1_stats,
               Summoner_Two: sum2_stats
          }

          //response containing the comparison statistics
          res.type('json');
          res.send(compare_stats);
               });
          });
          });
     });
});

app.listen(3000);
