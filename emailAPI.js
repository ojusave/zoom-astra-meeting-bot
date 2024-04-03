const axios = require('axios');
const { fetchAccessToken, createCollection, insertDocumentIntoCollection } = require('./dataStax');

async function handleEmailRequests(req, res) {
    try {
        const accessToken = await fetchAccessToken();
        if (!accessToken) {
            console.error('Access token is missing. Attempting to authenticate.');
            return res.status(401).send('Access token is missing. Please authenticate first.');
        }
        console.log('Successfully fetched access token.');

       
        await createCollection('emails_list');

        const messagesUrl = `https://api.zoom.us/v2/emails/mailboxes/me/messages`;

    
        const messagesResponse = await axios.get(messagesUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Fetched email messages.');

        const listEmails=[];
        
        for (const msg of messagesResponse.data.messages) {
            const emailDetail = await axios.get(`${messagesUrl}/${msg.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(res => res.data);

           
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
            });
            console.log(`Inserted email with ID ${emailDetail.id} into 'emails_list' collection.`);
            listEmails.push(emailDetail);
        }

        res.status(200).json(listEmails);
    } catch (error) {
        console.error('Failed to process and store emails:', error);
        res.status(500).send('Failed to list emails or insert data.');
    }
}

module.exports = { handleEmailRequests };
