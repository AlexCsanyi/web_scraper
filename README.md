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

once we have a valid email - I used the [extract-domain](https://www.npmjs.com/package/extract-domain) module to get the domain name.

### Step 3

using [request-promise](https://github.com/request/request-promise) and [cheerio](https://github.com/cheeriojs/cheerio) extract the relevant information from the site.

### Step 4

`console.log` the results
