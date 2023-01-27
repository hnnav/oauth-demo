var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');

const CLIENT_ID = "43010ef9017ddeca7ba0";
const CLIENT_SECRET = "aea8c7e9f8f0d7f8ff1adb35d0e2fd2ca4a08853";

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (req, res){

    console.log(req.query.code);

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
});

app.get('/getUserData', async function(req, res) {
    req.get("Authorization");
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
});

app.listen(4000, function() {
    console.log("CORS server running on port 4000");
});