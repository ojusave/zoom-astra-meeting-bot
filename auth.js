
// This part of code handles the Zoom Authorization
const axios = require('axios');
const { createCollection, insertDocumentIntoCollection, fetchAccessToken } = require('./dataStax');

const redirectUri = process.env.REDIRECT_URI;

async function handleOAuthRedirect(req, res) {
    if (req.query.code) {
        const url = `https://zoom.us/oauth/token`;
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', req.query.code);
        params.append('redirect_uri', redirectUri);

        try {
            const response = await axios.post(url, params.toString(), {
                auth: {
                    username: process.env.ZOOM_CLIENT_ID,
                    password: process.env.ZOOM_CLIENT_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });
            const data = response.data;
            console.log('Access Token Response:', data);
            
            await createCollection('tokens'); // Ensure collection exists
            
            await insertDocumentIntoCollection('tokens', {
                ID: "1", 
                Access_Token: data.access_token,
                Refresh_Token: data.refresh_token,
            });

           
            const tokens = await fetchAccessToken(); 
            if (tokens) {   
                console.log('Tokens retrieved:', tokens);
                res.status(200).json(tokens); // Send the tokens as a response to frontend
            } else {
                throw new Error('Failed to fetch access token');
            }
        } catch (error) {
            console.error('Error during OAuth redirect handling:', error);
            res.status(500).send('Error obtaining access token');
        }
    } else {
        res.redirect(`https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${redirectUri}`);
    }
}

module.exports = { handleOAuthRedirect };

const axios = require('axios');
const qs = require('querystring');
const config = require('./config');

let cachedToken = null;
let tokenExpiration = null;

async function getToken() {
  if (cachedToken && tokenExpiration && new Date() < tokenExpiration) {
    return cachedToken;
  }

  try {
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
    const response = await axios.post('https://zoom.us/oauth/token',
      qs.stringify({
        grant_type: 'account_credentials',
        account_id: config.accountId
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

