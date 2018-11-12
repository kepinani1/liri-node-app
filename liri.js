//store dependencies as variables.
var fs = require('fs');
var request = require("request");
var Spotify = require('node-spotify-api');


//Take in command line arguements
var userInput = process.argv[2];
var userInput2 = process.argv[3];
var moviesInput = "";
var artistInput = "";
// Execute parameters based on user input commands.
if (userInput === "concert-this") {
  // Shows listing of artists and concerts. Includes date information for venue. Will use bandsintown API.
  if (userInput2) {
    artistInput=userInput2;
    logConcerts();
  } else{
    artistInput = "Madonna";//Otherwise return the default artist which is Madonna (made up functionality) 
  logConcerts(); //If none of the userinput options chosen, set to default artist Madonna.
  }
} else if (userInput === "spotify-this-song") {
  if (userInput2) {
    logSpotify(userInput2);
  } else
    logSpotify("The Sign"); //If none of the userinput options chosen, set to default song of "The Sign" by Ace of Base
} else if (userInput === "movie-this") {
  if (userInput) {
    moviesInput = userInput2;
    logMovie();
  } else {
    moviesInput = "Mr.Nobody"; //Otherwise return the default movie which is "Mr.Nobody" 
    logMovie();
  }
} else if (userInput === "do-what-it-says") {
  readFile();
} else {
  console.log("The text in random.txt is faulty. Spotify could not be run from this file.");
};

//Data will be pulled from spotify and the following will be retrieved artist(s), song name, a preview link of the song from Spotify, and The album that the song is from
function logSpotify(queryInput) {
  var spotify = new Spotify({
    id: '26e95f104ac64837bcb82c48d15072d1',
    secret: '00cc91c62db74da5a85c90a792c58479',
  });

  //Search for song if input parameter exists 
  if (queryInput) {
    spotify.search({
      type: 'track',
      query: queryInput
    }, function (error, data) {
      if (error) throw JSON.stringify(error);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song title: " + data.tracks.items[0].name);
      console.log("Preview link: " + data.tracks.items[0].preview_url);
      console.log("Album title: " + data.tracks.items[0].album.name);
    });
  }
}
//I tried to get the bandsintown api to work similarly to OMDB movies API but for some reason, could not get it to work.
function logConcerts() {
  var concertsQuery="https://rest.bandsintown.com/artists/" + artistInput + "/events?app_id=codingbootcamp";
  console.log(concertsQuery);
  request(concertsQuery, function (error, response, body){
      if (!error && response.statusCode === 200) {
        console.log("\nVenue:" + JSON.parse(body).Venue);
        console.log("\nLocation: " + JSON.parse(body).City);
        console.log("\nDate: " + JSON.parse(body).Date);
      }
    });
}
//logMovie function 
function logMovie() {

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + moviesInput + "&y=&plot=short&apikey=81c2aaa4";
  console.log(queryUrl);
  request(queryUrl, function (error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

      console.log("Movie title: " + JSON.parse(body).Title);
      console.log("Movie release year: " + JSON.parse(body).Year);
      console.log("Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

function readFile() {

  //Use fs to read info from a local file
  fs.readFile("random.txt", "utf-8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // Then split the text into an array by commas (to make it more readable) and trim white spaces
    var dataArr = data.trim().split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr);

  });
} 