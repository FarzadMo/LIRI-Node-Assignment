// add code to read and set any environment variables with the dotenv package:
require("dotenv").config();

//require the keys and store them
var keys = require("./keys.js");

//--------------------------------------------------------------------------------------------
//Packages:
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

//variable
//var inputString = process.argv;

//---------------------------------------------------------------------------------------------
//Getting what user wants to do with inquirer and execute the corresponding function

inquirer
    .prompt([
        {
            name: "operand",
            message: "what you want to do?",
            type: "list",
            choices: ["concert-this",
                "movie-this",
                "spotify-this-song",
                "do-what-it-says"
            ]
        }   
    ]).then(function (answer) {

        //concert-this
        if (answer.operand === "concert-this") {

            inquirer
                .prompt([
                    {
                        name: "artist",
                        message: "who is your favorite artist?"
                    }
                ]).then(function(reply){
                    var queryUrl = "https://rest.bandsintown.com/artists/" + reply.artist + "/events?app_id=codingbootcamp";

                    console.log(queryUrl);
        
                    axios.get(queryUrl).then(
                        function (response) {
                            console.log("venue name: " + response.data[0].venue.name + " " + "venue location: " + response.data[0].venue.city + ". date: " +
                                moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm:ss a'));
                            // console.log(response)
                        }
                    );
                });
 
        } 
        
        //movie-this
        if (answer.operand === "movie-this") {

            inquirer
                .prompt([
                    {
                        name: "movieName",
                        message: "what is your favorite movie?"
                    }
                ]).then(function(reply){
                    var queryUrl = "http://www.omdbapi.com/?t=" + reply.movieName + "&y=&plot=short&apikey=trilogy";
                    if (reply.movieName === "") {
                        var queryUrl = "http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy";
                        // console.log(queryUrl);
                        axios.get(queryUrl).then(

                            function (response) {
                                console.log("plot: " + response.data.Plot + " " + "Release title: " + response.data.Title),
                                    console.log(response.data.Ratings[1])
                                console.log("imdb rating: " + response.data.imdbRating)
                                console.log("country: " + response.data.Country)
                                console.log("language: " + response.data.Language)
                                console.log("actors: " + response.data.Actors)
                            }
                        );
                    }
                });

        } 
        
        //spotify-this-song
        if(answer.operand === "spotify-this-song") {
            
            inquirer
                .prompt([
                    {
                        name: "album",
                        message: "what is your favorite album?"
                    }
                ]).then(function(reply){
                    //I modified the query from album to reply.album (?)
                    spotify.search({
                        type: 'track',
                        query: reply.album,
                        limit: 1
                    }, function (err, data) {
                        var theSign = "https://api.spotify.com/v1/search?query=ace+of+base&type=track&offset=1&limit=5"
                        if (err) {
                            spotify
                                .request(theSign)
                                .then(function (data) {
                                    console.log("artist: " + data.tracks.items[3].artists[0].name)
                                    console.log("track name :" + data.tracks.items[3].name + ", track: ")
                                    console.log(data.tracks.items[3].external_urls);
                                    console.log(data.tracks.items[3].album.name);
                                    // console.log(data)
                                })
                                .catch(function (err) {
                                    console.error('Error occurred: ' + err);
                                });
                            // return console.log('Error occurred: ' + theSign);
                        }
                        // source - http://jsfiddle.net/JMPerez/0u0v7e1b/
                        console.log("artist: " + data.tracks.items[0].artists[0].name)
                        console.log("track name :" + data.tracks.items[0].name + ", track: ")
                        console.log(data.tracks.items[0].external_urls);
                        console.log(data.tracks.items[0].album.name);
                        // console.log(data)
                    });
                });
            
        } 
        
        //do-what-it-says
    
        if (answer.operand === "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) {
                    return console.log("Error occurred: " + err);
                }
    
                var dataArr = data.split(",");
                var command = dataArr[0];

                console.log(command);
                console.log("---------------------");
                if (command === "spotify-this-song") {
                    song = dataArr[1];
                } else if (command === "movie-this") {
                    movie = dataArr[1];
                } else if (command === "concert-this") {
                    artist = dataArr[1];
                    console.log(artist);
                }
            });
        }
    });










    