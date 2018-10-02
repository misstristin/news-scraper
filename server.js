// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// sets up body parser for POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// make assets folder static
app.use(express.static("views"));

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.render("pages/index");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Retrieve data from the db
app.get("/none", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.remove({}, function(error, deleted) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, redirect to homepage
      else {
        console.log(deleted);
        res.redirect("/");
      }
    });
  });

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of `ycombinator`
  request("https://www.buzzfeednews.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a ".newsblock-story-card__info"
    $(".newsblock-story-card__info").each(function(i, element) {

    // Save the title, link, author, and summary of each link enclosed in the current element
      var title = $(element).children("h2").children("a").text().trim();
      var link = $(element).children("h2").children("a").attr("href");
      var author = $(element).children("div").children("div").children("a").children("span").text().trim();
      var summary = $(element).children("p").text();

      // If this found element had a title, link, author, and summary
      if (title && link && author && summary) {
          // check if the title already exists, then don't add
          // if (db.scrapedData.find({title: title})){
          //   console.log('duplicate: ' + title);
          // }        
          // Insert the data in the scrapedData db
          db.scrapedData.insert({
            title: title, 
            link: link,
            author: author,
            summary: summary,
            notes: ""
            
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });
 
  // Send a "Scrape Complete" message to the browser
  console.log("Scrape Complete");

  setTimeout(function(){ 
    res.redirect("/");
 }, 1000);
  
});

// comment and add data to database
app.get("/comment", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
