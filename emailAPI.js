const axios = require('axios');
const { fetchAccessToken, createCollection, insertDocumentIntoCollection, fetchDocumentsFromCollection } = require('./dataStax');

const { execSync } = require('child_process');

function getEmailVector(emailContent) {
    try {
        
        const command = `python3 "/Users/ojusave/Desktop/MailAPIs/vector_conversion.py" "${emailContent}"`; 
        const vectorString = execSync(command);
        return JSON.parse(vectorString.toString()); 
    } catch (error) {
        console.error('Failed to generate email vector', error);
        return null;
    }
}

async function handleEmailRequests(req, res) {
    try {
        const accessToken = await fetchAccessToken();
        if (!accessToken) {
            console.error('Access token is missing. Attempting to authenticate.');
            return res.status(401).send('Access token is missing. Please authenticate first.');
        }
        console.log('Successfully fetched access token.');

        await createCollection('emails_list', {
            "vector": {
                "dimension": 5,
                "metric": "cosine"
            }
        });

        const messagesUrl = `https://api.zoom.us/v2/emails/mailboxes/${process.env.MAILBOX_EMAIL}/messages`;

        const messagesResponse = await axios.get(messagesUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Fetched email messages.');

        for (const msg of messagesResponse.data.messages) {
            const emailDetail = await axios.get(`${messagesUrl}/${msg.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(res => res.data);

            const vector = getEmailVector(emailDetail.snippet);
            await insertDocumentIntoCollection('emails_list', {
                id: emailDetail.id,
                threadId: emailDetail.threadId,
                labelIds: emailDetail.labelIds,
                snippet: emailDetail.snippet,
                historyId: emailDetail.historyId,
                internalDate: emailDetail.internalDate,
                expiration: emailDetail.expiration,
                lastMoved: emailDetail.lastMoved,
                sendTime: emailDetail.sendTime,
                userScheduled: emailDetail.userScheduled,
                payload: JSON.stringify(emailDetail.payload),
                sizeEstimate: emailDetail.sizeEstimate,
                vector: vector,
            });
            console.log(`Inserted email with ID ${emailDetail.id} into 'emails_list' collection.`);
        }

        // Fetching the inserted documents from AstraDB for display
        const response = await fetchDocumentsFromCollection('emails_list');
        const emailsFromDb = Object.values(response); // Convert object of objects into an array

        const listEmails = emailsFromDb.map(email => {
            return {
                id: email.id, // Unique identifier for the email
                threadId: email.threadId, // Identifier for the thread to which this email belongs
                labelIds: email.labelIds, // Labels associated with the email (e.g., INBOX, SENT)
                snippet: email.snippet, // A snippet or preview of the email content
                historyId: email.historyId, // An identifier for the email's history
                internalDate: email.internalDate, // The internal date of the email
                expiration: email.expiration, // Expiration time of the email, if applicable
                lastMoved: email.lastMoved, // The last time the email was moved
                sendTime: email.sendTime, // The sending time of the email
                userScheduled: email.userScheduled, // Indicates if the email was scheduled by the user
                payload: email.payload, // The full payload of the email, likely in JSON format
                sizeEstimate: email.sizeEstimate, // The estimated size of the email
                vector: email.vector, // The vector representation of the email, if applicable
            };
        });

        res.status(200).json(listEmails);
    } catch (error) {
        console.error('Failed to process and store emails:', error);
        res.status(500).send('Failed to list emails or insert data.');
    }
}

module.exports = { handleEmailRequests };
