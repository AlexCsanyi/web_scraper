const readLine = require("readline");
var validator = require("email-validator");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Please type your email address: \n`, userInput => {
  if (validator.validate(userInput.trim())) {
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
