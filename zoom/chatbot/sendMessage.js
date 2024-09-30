const axios = require('axios');
const path = require('path');
const { getChatbotToken } = require('../authentication/chatbotTokenAuth');
const { fetchAllData } = require('../api/zoomApiCalls');
const { runPythonScript } = require('../../utils/pythonUtils');;

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
        console.log('Starting Zoom data update process...');
        await fetchAllData();
        console.log('Zoom data fetched successfully');
        
        const loadDataScriptPath = path.resolve(__dirname, '../../datastax', 'load_data.py');
        console.log(`Running load_data.py script: ${loadDataScriptPath}`);
        await runPythonScript(loadDataScriptPath);
        console.log('Data loaded into Astra DB successfully');
        
        return 'Zoom data has been updated and loaded into Astra DB successfully.';
    } catch (error) {
        console.error('Error updating Zoom data:', error);
        throw error;
    }
}

async function handleBotEvent(req, res) {
    try {
        const { payload } = req.body;
        const { cmd, toJid, userJid } = payload;

        console.log(`Received command: "${cmd}"`);

        let response;

        if (cmd.toLowerCase().trim() === 'update') {
            console.log('Update command detected. Initiating Zoom data update...');
            response = await updateZoomData();
        } else {
            console.log('Running Python script for regular query...');
            const scriptPath = path.resolve(__dirname, '../../datastax', 'zoom_ai_bot.py');
            response = await runPythonScript(scriptPath, cmd);
        }

        console.log(`Response: ${response}`);

        const chatbotToken = await getChatbotToken();
        await sendChatMessage(chatbotToken, response, toJid, userJid);

        console.log('Bot event handled successfully');
        res.status(200).json({ message: 'Query processed successfully and sent to Zoom Team Chat.' });
    } catch (error) {
        console.error('Error handling bot event:', error);
        res.status(500).send('Error handling bot event.');
    }
}

module.exports = { handleBotEvent };