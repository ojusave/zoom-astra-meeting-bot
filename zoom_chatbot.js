const axios = require('axios');
//const { spawn } = require('child_process');
const path = require('path');
const { fetchAllData } = require('./zoomapi');
const { runPythonScript } = require('./utils/pythonUtils');


async function getChatbotToken() {
    console.log('Getting chatbot token...');
    try {
        const response = await axios.post('https://zoom.us/oauth/token?grant_type=client_credentials', {}, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString('base64')
            }
        });
        console.log('Chatbot token obtained successfully');
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting chatbot token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function sendChatMessage(chatbotToken, message, toJid, userJid) {
    console.log(`Sending chat message to ${toJid}...`);
    try {
        await axios.post('https://api.zoom.us/v2/im/chat/messages', {
            robot_jid: process.env.ZOOM_BOT_JID,
            to_jid: toJid,
            user_jid: userJid,
            content: {
                head: {
                    text: 'ZAstraO Bot Says'
                },
                body: [{
                    type: 'message',
                    text: message
                }]
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + chatbotToken
            }
        });
        console.log('Chat message sent successfully');
    } catch (error) {
        console.error('Error sending chat message:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function updateZoomData() {
    try {
        await fetchAllData();
        console.log('Fetch completed, starting Python script...');
        await runPythonScript(path.join(__dirname, 'scripts', 'load_data.py'));
        console.log('Python script completed successfully');
        return 'Data updated successfully';
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

async function handleBotEvent(req, res) {
    console.log('Handling bot event...');
    try {
        const event = req.body;
        console.log('Received event:', JSON.stringify(event, null, 2));

        if (event.event !== 'bot_notification' && event.type !== 'message') {
            console.log('Event is not a bot notification or message');
            return res.status(200).send('Event received');
        }

        const query = event.payload?.cmd || event.payload?.message;
        const toJid = event.payload?.toJid || event.payload?.accountId;
        const userJid = event.payload?.userId;

        console.log(`Query: ${query}`);
        console.log(`To JID: ${toJid}`);
        console.log(`User JID: ${userJid}`);

        if (!query || !toJid) {
            console.log('Invalid payload: missing query or toJid');
            return res.status(400).send('Invalid payload');
        }

        let response;
        if (query.toLowerCase() === 'update') {
            console.log('Received update command. Updating Zoom data...');
            response = await updateZoomData();
        } else {
            console.log('Running Python script...');
            response = await runPythonScript(path.join(__dirname, 'scripts', 'zoom_ai_bot.py'), query);
        }

        console.log(`Response: ${response}`);

        // Get chatbot token and send the response
        console.log('Getting chatbot token...');
        const chatbotToken = await getChatbotToken();
        console.log('Sending chat message...');
        await sendChatMessage(chatbotToken, response, toJid, userJid);

        console.log('Bot event handled successfully');
        res.status(200).json({ message: 'Query processed successfully and sent to Zoom Team Chat.' });
    } catch (error) {
        console.error('Error handling bot event:', error);
        res.status(500).send('Error handling bot event.');
    }
}

module.exports = { handleBotEvent };