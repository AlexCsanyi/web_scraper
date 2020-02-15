# web_scraper

Web scraper to obtain additional information about the company based on an email address (Address, Phone Number, Other Email Addresses )

## Usage and installation

open your favourite editor / terminal and type in the following:  
`cd your-destination-folder`  
`git clone https://github.com/AlexCsanyi/web_scraper`  
`npm install` - this will install dependencies  
`node app.js` - run the app.js file

### Step 1

added [email-validator](https://www.npmjs.com/package/email-validator) module to validate an e-mail address  
ask user to type in an email address; if valid, log confirmation message, else ask user to retry or enter a different one

### Step 2

once we have a valid email - we need to get the domain name a simple indexOf method splits the email at the last index of the '@' sign - this will work with some edge cases as well: john\@doe , "john@@".doe , "j@hn".d\@e

### Step 3

using [request-promise](https://github.com/request/request-promise) and [cheerio](https://github.com/cheeriojs/cheerio) extract text from the site. Pass the requested string to [Knwl.js](https://github.com/benhmoore/Knwl.js) and use the default plugins (emails, phones, addresses) to parse through it.

### Step 4

`console.log` the results
