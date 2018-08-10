require("dotenv").config();
const fs = require("fs");
var keys = require("./keys");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');



var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArgs = process.argv
var userCommand = "";

///////////////////// Twitter///////////////////////
var params = { screen_name: 'iamcardib' };

if (nodeArgs[2] === "my-tweets") {

    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {
            for (let i in tweets)
                console.log(
                    `
    Date: ${[tweets[i].created_at]}
    iamcardib: ${tweets[i].text}
    `)
        }
    });
}
////////////////////Spotify////////////////////////
var track = "";


for (var i = 3; i < nodeArgs.length; i++) {
    // Loop through all the words in the node argument and create full track name.

    if (i > 2 && i < nodeArgs.length) {

        track = track + "+" + nodeArgs[i];

    }

    else {

        track += nodeArgs[i];

    }
};

if (nodeArgs[2] === "spotify-this-song") {
    spotify.search({ type: 'track', query: track, limit: '1' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let art = [];
        console.log("Track:" + data.tracks.items[0].name);

        for (let i in data.tracks.items[0].artists) {
            art.push(data.tracks.items[0].artists[i].name);
        }
        console.log("Artist:" + art)
        console.log("Preview:" + data.tracks.items[0].preview_url);
    });

}
////////////////////OMDB////////////////////////

if (nodeArgs[2] === "movie-this") {
    var movieName = "";

    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 2 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];
        }
        else {

            movieName += nodeArgs[i];
        }
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log(
                `
        Title: ${JSON.parse(body).Title}
        Actors: ${JSON.parse(body).Actors}
        Released: ${JSON.parse(body).Year}
        Rot-Tom: ${JSON.parse(body).Ratings[1].Value}
        Country: ${JSON.parse(body).Country}
        Language: ${JSON.parse(body).Language}
        Plot: ${JSON.parse(body).Plot}
        `)

        }
    });
}
////////////////////FS////////////////////////

if (nodeArgs[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        console.log(data);

        rand = data.split(" ");

        spotify.search({ type: 'track', query: rand[1], limit: '1' }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            let art = [];
            console.log("Track:" + data.tracks.items[0].name);

            for (let i in data.tracks.items[0].artists) {
                art.push(data.tracks.items[0].artists[i].name);
            }
            console.log("Artist:" + art)
            console.log("Preview:" + data.tracks.items[0].preview_url);
        });
    });
}
else {
    console.log(`
//////////////////////////////////////////////////////
                Try again!
                Here's a list of valid commands

                1. my-tweets
                2. spotify-this-song
                3. movie-this
                4. do-what-it-says
//////////////////////////////////////////////////////                
                `)
};