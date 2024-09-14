const axios = require('axios');
const config = require('../config');
const { getToken } = require('../auth');

async function makeApiCall(endpoint, params = {}) {
  try {
    const token = await getToken();
    console.log(`Making API call to: ${config.zoomApiBaseUrl}${endpoint} with params:`, params);
    const response = await axios.get(`${config.zoomApiBaseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

async function pushDataToEndpoint(data) {
  try {
    const response = await axios.post(config.endpointUrl, data);
    console.log('Data successfully pushed to endpoint:', response.status);
  } catch (error) {
    console.error('Error pushing data to endpoint:', error.response ? error.response.data : error.message);
  }
}

module.exports = { makeApiCall, pushDataToEndpoint };
