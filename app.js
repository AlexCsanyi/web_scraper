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

const domainName = [];

const getOutput = options =>
  request(options)
    .then(function($) {
      // get all the content, but keep spaces and line breaks so emails and numbers stay separated
      // we reomve these later
      const rawText = $("body *")
        .contents()
        .map(function() {
          return this.type === "text"
            ? $(this)
                .text()
                .trim() + " "
            : "";
        })
        .get()
        .join(" ");

      // regex to remove spaces between numbers, after this remove the '+' sign in front of the numbers
      const regex = /(\d)\s+(?=\d)/g;
      const subst = `$1`;
      const correctedText = rawText.replace(regex, subst).replace(/\+/g, "");

      // regex to remove spaces, tabs, newlines, and replace them with a single space
      const text = correctedText.replace(/\s\s+/g, " ");

      // find emails in the text using knwl.js
      knwlInstance.init(text);
      const parsedEmails = knwlInstance.get("emails");

      // get only unique emails using Set and map
      const uniqueEmails = Array.from(
        new Set(parsedEmails.map(email => email.address))
      ).map(address => {
        return parsedEmails.find(email => email.address === address);
      });

      // get knwl.js to find numbers
      const parsedPhones = knwlInstance.get("phones");

      // get only unique phone numbers using Set and map
      const uniquePhones = Array.from(
        new Set(parsedPhones.map(phone => phone.number))
      ).map(number => {
        return parsedPhones.find(phone => phone.number === number);
      });

      // if we found emails log the addresses and their indexs else 'not found'
      if (uniqueEmails.length !== 0) {
        uniqueEmails.map((element, index) =>
          console.log(`email ${index + 1}: ${element.address}`)
        );
      } else {
        console.log("No email address found");
      }

      // if we found numbers at the first attempt log the numbers and their indexes
      // or if nothing found see if knwl.js has anything
      // if still nothing found log 'not found'
      if (uniquePhones.length !== 0) {
        uniquePhones.map((element, index) =>
          console.log(`phone number ${index + 1}: ${element.phone}`)
        );
      } else {
        console.log("No phone numbers found");
      }
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
    domainName.push(domain);
    let options = {
      uri: `https://www.${domain}`,
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
        domainName.push(domain);
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
    "Thank you, the email is valid, now please wait until we look for the company's details ",
    domainName
  );
});
