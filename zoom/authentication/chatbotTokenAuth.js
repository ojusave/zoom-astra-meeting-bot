const axios = require('axios');
require('dotenv').config(); // Make sure this is at the top of your main file or included before this code runs

async function getChatbotToken() {
    console.log('Getting chatbot token...');

    // Check if credentials are loaded
    if (!process.env.ZOOM_CLIENT_ID || !process.env.ZOOM_CLIENT_SECRET) {
        console.error('Zoom credentials are not properly loaded from environment variables.');
        console.log('ZOOM_CLIENT_ID:', process.env.ZOOM_CLIENT_ID ? 'Loaded' : 'Not loaded');
        console.log('ZOOM_CLIENT_SECRET:', process.env.ZOOM_CLIENT_SECRET ? 'Loaded' : 'Not loaded');
        throw new Error('Zoom credentials not found in environment variables');
    }

    // Log the credentials (be careful with this in production!)
    console.log('ZOOM_CLIENT_ID:', process.env.ZOOM_CLIENT_ID);
    console.log('ZOOM_CLIENT_SECRET:', process.env.ZOOM_CLIENT_SECRET.substring(0, 4) + '...');

    const authHeader = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    console.log('Authorization Header:', authHeader);

    try {
        const response = await axios.post('https://zoom.us/oauth/token?grant_type=client_credentials', {}, {
            headers: {
                'Authorization': 'Basic ' + authHeader
            }
        });
        console.log('Chatbot token obtained successfully');
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting chatbot token:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
        throw error;
    }
}

module.exports = { getChatbotToken };