const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

let cachedToken = null;
let tokenExpiration = null;

async function getToken() {
  if (cachedToken && tokenExpiration && new Date() < tokenExpiration) {
    return cachedToken;
  }

  try {
    const auth = Buffer.from(`${process.env.OAuth_Client_ID}:${process.env.OAuth_Client_Secret}`).toString('base64');
    const response = await axios.post('https://zoom.us/oauth/token',
      qs.stringify({
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID
      }), {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    
    cachedToken = response.data.access_token;
    tokenExpiration = new Date(Date.now() + response.data.expires_in * 1000);
    console.log('New token generated:', cachedToken);
    return cachedToken;
  } catch (error) {
    console.error('Error fetching token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { getToken };
