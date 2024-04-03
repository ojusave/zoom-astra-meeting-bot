// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleOAuthRedirect } = require('./auth');
const { handleEmailRequests } = require('./emailAPI');
const { insertOrUpdateRow, fetchAccessToken, fetchDocumentsFromCollection } = require('./dataStax');

const app = express();

app.use(bodyParser.json());

app.get('/', handleOAuthRedirect);
app.get('/emails', handleEmailRequests);


app.listen(4000, () => console.log(`Listening at http://localhost:4000`));
