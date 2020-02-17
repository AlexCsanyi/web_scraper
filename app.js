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

      // get all links and see if any of thoe include key words that might be a contact page
      const isThereContactLink = $("a")
        .map(function() {
          return $(this).attr("href");
        })
        .toArray()
        .filter(
          link =>
            link.includes("contact") ||
            link.includes("touch") ||
            link.includes("find")
        );

      // if we found emails log the addresses and their indexs else 'not found'
      if (uniqueEmails.length !== 0) {
        uniqueEmails.map((element, index) =>
          console.log(`email ${index + 1}: ${element.address}`)
        );
      } else {
        console.log("No email address found on first page");
      }

      // log the numbers and their indexes else log 'not found'
      if (uniquePhones.length !== 0) {
        uniquePhones.map((element, index) =>
          console.log(`phone number ${index + 1}: ${element.phone}`)
        );
      } else {
        console.log("No phone numbers found on first page");
      }

      if (
        uniquePhones.length === 0 &&
        uniqueEmails.length === 0 &&
        isThereContactLink.length !== 0
      ) {
        console.log(
          "No phone numbers or email addresses found on page 1, please wait while we look for one on another page"
        );
        let options = {
          uri: isThereContactLink[0].startsWith("http")
            ? `${isThereContactLink[0]}`
            : `https://www.${domainName[0]}${isThereContactLink[0]}`,
          transform: function(body) {
            return cheerio.load(body);
          }
        };
        request(options)
          .then(function($) {
            const rawContactText = $("body *")
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

            const correctedContacTText = rawContactText
              .replace(regex, subst)
              .replace(/\+/g, "");
            const ContactText = correctedContacTText.replace(/\s\s+/g, " ");
            knwlInstance.init(ContactText);
            const parsedContactEmails = knwlInstance.get("emails");
            const parsedContactPhones = knwlInstance.get("phones");

            parsedContactEmails.map((element, index) =>
              console.log(
                `alt page (${isThereContactLink[0]}): email ${index + 1}: ${
                  element.address
                }`
              )
            );

            parsedContactPhones.map((element, index) =>
              console.log(
                `alt page (${isThereContactLink[0]}): phone ${index + 1}: ${
                  element.phone
                }`
              )
            );
          })
          .catch(function(err) {
            console.log(err);
          });
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
    "Thank you, the email is valid, now please wait until we look for the company's details "
  );
});
