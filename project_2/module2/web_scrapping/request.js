const request = require('request');

request('http://www.google.com', cb);

function cb(error, response, body) {
    if(error)
        console.error('error:', error); // Print the error if one occurred
    else{
        console.log('body:', body); // Print the HTML for the Google homepage.
    }
}