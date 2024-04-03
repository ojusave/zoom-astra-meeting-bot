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
app.get('/fetch-emails', async (req, res) => {
    try {
        const emailData = await fetchDocumentsFromCollection('emails_list');
        res.status(200).json(emailData);
    } catch (error) {
        console.error('Failed to fetch emails:', error);
        res.status(500).send('Failed to fetch emails from AstraDB.');
    }
});

app.listen(4000, () => console.log(`Listening at http://localhost:4000`));
