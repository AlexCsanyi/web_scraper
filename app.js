const readLine = require("readline");
const validator = require("email-validator");
const freemail = require("freemail");
const request = require("request-promise");
const cheerio = require("cheerio");
const Knwl = require("knwl.js");
const knwlInstance = new Knwl();

const readLineInterface = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getOutput = options =>
  request(options)
    .then(function($) {
      const text = $("html")
        .find("body")
        .text();

      knwlInstance.init(text);

      const parsedEmails = knwlInstance.get("emails");
      const parsedPhones = knwlInstance.get("phones");

      console.log(parsedEmails, parsedPhones);
    })
    .catch(function(err) {
      console.log(err);
    });

readLineInterface.question(`Please type your email address: \n`, userInput => {
  if (
    validator.validate(userInput.trim()) &&
    !freemail.isFree(userInput.trim())
  ) {
    let domain = userInput.substring(userInput.lastIndexOf("@") + 1);
    let options = {
      uri: `https://${domain}`,
      transform: function(body) {
        return cheerio.load(body);
      }
    };

    getOutput(options);

    readLineInterface.close();
  } else {
    if (!validator.validate(userInput.trim())) {
      readLineInterface.setPrompt(
        "Incorrect email, please try again or enter a different email \n"
      );
      readLineInterface.prompt();
    } else {
      readLineInterface.setPrompt(
        "Please use a professional email address: example@example-corporation.com \n"
      );
      readLineInterface.prompt();
    }
    readLineInterface.on("line", userInput => {
      if (
        validator.validate(userInput.trim()) &&
        !freemail.isFree(userInput.trim())
      ) {
        let domain = userInput.substring(userInput.lastIndexOf("@") + 1);

        let options = {
          uri: `https://${domain}`,
          transform: function(body) {
            return cheerio.load(body);
          }
        };

        getOutput(options);
        readLineInterface.close();
      } else {
        readLineInterface.setPrompt(
          `Your answer of ${userInput} is incorrect, or it is not a professional email, please try again \n`
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
