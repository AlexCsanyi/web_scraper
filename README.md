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

using [request-promise](https://github.com/request/request-promise) and [cheerio](https://github.com/cheeriojs/cheerio) extract text from the site. Clean it and pass the cleaned string to [Knwl.js](https://github.com/benhmoore/Knwl.js) and use the default plugins (emails, phones) to parse through it.

### Step 4

`console.log` the results

#### getOutput()

this is the main function; it gets all of the body element's children's content on the webpage. If the type is text it gets the text content and trims the whitespace but keeps a single space between, then the results are moved in an array using the get() method and the elements of the array are joined.  
This was done becasue the text() method doesn't keep the single space between text content and that reduced the accuracy of getting email addresses.  
Once we have the raw text I used regex to remove space between phone numbers, and removed the '+' sign in front of them. After this I replaced all tabs, new lines, multiple spaces etc... with a single space.  
Once our string is cleaned I parsed them with knwl.js to find emails and phones.  
Then I got the unique values only from the array of objects.  
Using map I console log each element in the result arrays and their indexes + 1  
If nothing is found I log a 'not found' message.

#### Test Results

[A document listing the pages I visited with the outputs](test.md)

### Limitations

- A lot of sites don't share the email on the main page and have a dedicated contact page.
The solution I am currently working on:
  - Get all the 'a' HTML elements  from the first page => get the "href" attributes of these and store them in an array => see if any of the remaining links contain the word "contact" or "touch" or "find" => if yes try that page first and just go through the same process on it.
    - We only get to run this function if 3 circumstances are met: 1. no email found on first page 2. no phone found on first page 3. we found a link with any of the "contact" or "touch" or "find" keywords in it
    - you can test this working on the below example:  
    https://jonathanoakes.com/ test email : alex@jonathanoakes.com     
    First time around we get no results but then we visit the contact page and get the results from there, we log the link address and the results:  
    alt page (/contact): email 1: jonathan@jonathanoakes.com  
    alt page (/contact): phone 1: (783) 110-7405  

- Mobile numbers  
  Some mobile numbers are not recognized as phone numbers by knwl.js
