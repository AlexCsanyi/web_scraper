const readLine = require("readline");
const validator = require("email-validator");
const extractDomain = require("extract-domain");
const request = require("request-promise");
const cheerio = require("cheerio");

const readLineInterface = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

readLineInterface.question(`Please type your email address: \n`, userInput => {
  if (validator.validate(userInput.trim())) {
    let domain = extractDomain(userInput);

    var options = {
      uri: `https://www.${domain}`,
      transform: function(body) {
        return cheerio.load(body);
      }
    };

    request(options)
      .then(function($) {
        const footer = $(".footer");
        const output = footer.find("a").text();
        console.log(output);
      })
      .catch(function(err) {
        console.log(err);
      });
    readLineInterface.close();
  } else {
    readLineInterface.setPrompt(
      "Incorrect email, please try again or enter a different email \n"
    );
    readLineInterface.prompt();
    readLineInterface.on("line", userInput => {
      if (validator.validate(userInput.trim())) {
        readLineInterface.close();
      } else {
        readLineInterface.setPrompt(
          `Your answer of ${userInput} is incorrect, try again \n`
        );
        readLineInterface.prompt();
      }
    });
  }
});

readLineInterface.on("close", () => {
  console.log(
    "Thank you, the email is valid, now please wait until we look for the company's details"
  );
});
