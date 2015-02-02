#!/usr/bin/env node
var browser = require("zombie");
var assert = require("assert");
var open = require('open');
var colors = require('colors/safe');
var fs = require('fs');
var cli = require("nomnom")
   .option('login', {
      abbr: 'l',
      required: true,
      help: 'Your email address'
   })
   .option('pass', {
      abbr: 'p',
      required: true,
      help: 'Your ChallengePost password'
   })
   .option('slug', {
      abbr: 's',
      required: true,
      help: 'Project slug (e.g. foo in http://challengepost.com/software/foo)',
   })
   .option('tagline', {
      abbr: 't',
      help: 'New project tagline (117 characters max)',
   })
   .option('readme', {
      abbr: 'r',
      default: 'readme.md',
      help: 'Readme filename',
   })
   .parse();

var email = cli.login;
var pass = cli.pass;
var slug = cli.slug;

// open readme & load in new description
var newDescription;
fs.readFile(cli.readme, 'utf8', function (err,data) {
  if (err) {
    return console.log(colors.red("Error opening "+cli.readme+" / file not found"));
  }
  newDescription = data;
  //console.log(newDescription);
});

// launch browser & get down to business
b = new browser();
b.visit("https://challengepost.com/software/"+slug+"/edit",
function () {
  // Login & go to edit software form
  b.
    fill("user[email]", email).
    fill("user[password]", pass).
    pressButton("commit", function() {
      assert.ok(b.success);
      console.log(colors.green(">> Logged in as "+email+" & editing '"+slug+"'\n"));

      // confirm path, page title, and 'edit your project' prompt in h1.
      assert.equal(b.document.URL, "http://challengepost.com/software/"+slug+"/edit");
      assert.equal(b.text("title"), "ChallengePost");
      assert.equal(b.document.querySelector("h1").textContent, "Edit your project");

      // set new tagline & description data
      console.log(colors.yellow(">> Updating tagline & description\n"));

      // get tagline & description elements
      var tagline = b.document.getElementById("software_tagline");
      var description = b.document.getElementById("software_description");

      console.log(colors.cyan("CURRENT TAGLINE:\n"), tagline.value,"\n");
      console.log(colors.cyan("CURRENT DESCRIPTION:\n"), description.value,"\n");

      // if no new tagline was supplied, use the old one.
      var newTagline;
      if (cli.tagline){
        newTagline = cli.tagline;
      } else { newTagline = tagline.value; }

      console.log(colors.magenta("NEW TAGLINE:\n"), newTagline,"\n");
      console.log(colors.magenta("NEW DESCRIPTION:\n"),newDescription,"\n");

      b.
        fill("software[tagline]", newTagline.substring(0,117)).
        fill("software[description]", newDescription).
        pressButton("software_form_save_button", function() {

          // confirm submission & path
          assert.ok(b.success);
          assert.equal(b.document.URL, "http://challengepost.com/software/"+slug);
          console.log(colors.green("\n>> Project updated, confirm visually\n"));

          // open local browser window to software (visual confirmation)
          open(b.document.URL);
          process.exit(0);
        });

    });

});
