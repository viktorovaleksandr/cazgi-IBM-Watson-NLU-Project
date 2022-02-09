const express = require('express');
const cors_app = require('cors');
const dotenv = require('dotenv');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
app.use(cors_app());

/*This loan the environment variables that you set up in the .env file*/
dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    return new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    });
}

//The default endpoint for the webserver
app.get("/", (req, res) => {
    res.render('index.html');
});

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req, res) => {

    const analyzeParams = {
        "url": req.query.url,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    }

    const analizer = getNLUInstance();

    analizer.analyze(analyzeParams)
        .then(analysisResults => {
            //Print the JSON returned by NLU instance as a formatted string
            console.log(JSON.stringify(analysisResults.result.keywords[0].emotion, null, 2));
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.keywords[0].emotion);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req, res) => {

    const analyzeParams =
    {
        "url": req.query.url,
        "features": {
            "sentiment": {}
        }
    }

    const analyzer = getNLUInstance();

    analyzer.analyze(analyzeParams)
        .then(analysisResults => {
            //Print the JSON returned by NLU instance as a formatted string
            console.log(JSON.stringify(analysisResults.result.sentiment, null, 2));
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.sentiment);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req, res) => {

    const analyzeParams =
    {
        "text": req.query.text,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    }

    const analyzer = getNLUInstance();

    analyzer.analyze(analyzeParams)
        .then(analysisResults => {
            //Print the JSON returned by NLU instance as a formatted string
            console.log(JSON.stringify(analysisResults.result.keywords[0].emotion, null, 2));
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.keywords[0].emotion);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

app.get("/text/sentiment", (req, res) => {
    // return res.send("text sentiment for " + req.query.text);

    const analyzeParams =
    {
        "text": req.query.text,
        "features": {
            "sentiment": {}
        }
    }

    const analyzer = getNLUInstance();

    analyzer.analyze(analyzeParams)
        .then(analysisResults => {
            //Print the JSON returned by NLU instance as a formatted string
            console.log(JSON.stringify(analysisResults.result.sentiment, null, 2));
            //Please refer to the image to see the order of retrieval
            return res.send(analysisResults.result.sentiment);
        })
        .catch(err => {
            return res.send("Could not do desired operation " + err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})