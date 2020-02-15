const readLine = require("readline");
const validator = require("email-validator");
const extractDomain = require("extract-domain");
const rp = require("request-promise");
const cheerio = require("cheerio");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Please type your email address: \n`, userInput => {
  if (validator.validate(userInput.trim())) {
    let domain = extractDomain(userInput);

    var options = {
      uri: `https://www.${domain}`,
      transform: function(body) {
        return cheerio.load(body);
      }
    };

    rp(options)
      .then(function($) {
        const footer = $(".footer");
        const output = footer.find("a").text();
        console.log(output);
      })
      .catch(function(err) {
        console.log(err);
      });
    rl.close();
  } else {
    rl.setPrompt(
      "Incorrect email, please try again or enter a different email \n"
    );
    rl.prompt();
    rl.on("line", userInput => {
      if (validator.validate(userInput.trim())) {
        rl.close();
      } else {
        rl.setPrompt(`Your answer of ${userInput} is incorrect, try again \n`);
        rl.prompt();
      }
    });
  }
});

rl.on("close", () => {
  console.log(
    "Thank you, the email is valid, now please wait until we look for the company's details"
  );
});
