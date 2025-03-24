const axios = require('axios');
const { getToken } = require('../authentication/serverToServerAuth');
require('dotenv').config();




function getDateRange(months = 6) {
    const end = new Date();
    const start = new Date(end);
    start.setMonth(start.getMonth() - months);
  
    const dateRanges = [];
    let currentDate = new Date(start);
  
    while (currentDate < end) {
      let rangeEnd = new Date(currentDate);
      rangeEnd.setDate(rangeEnd.getDate() + 29);
  
      if (rangeEnd > end) {
        rangeEnd = new Date(end);
      }
  
      dateRanges.push({
        from: currentDate.toISOString().split('T')[0],
        to: rangeEnd.toISOString().split('T')[0]
      });
  
      currentDate = new Date(rangeEnd);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateRanges;
}

async function makeApiCall(endpoint, params = {}) {
    try {
      const token = await getToken();
      // Temporarily hardcode the base URL for testing
      const baseUrl = 'https://zoom-test-apis.onrender.com';
      console.log('Environment variables:', {
        zoomApiBaseUrl: process.env.zoomApiBaseUrl,
        NODE_ENV: process.env.NODE_ENV,
        PWD: process.env.PWD
      });
      console.log('API Base URL:', baseUrl);
      console.log(`Making API call to: ${baseUrl}${endpoint} with params:`, params);
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      return response.data;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
  

async function fetchAllData() {
    try {
        const response = await makeApiCall('/users');
        let users = response.users || [response];

        const maxUsers = 1;
        let processedUsers = 0;

        for (const user of users) {
            if (processedUsers >= maxUsers) break;

            const cleanedUser = cleanUserData(user);
            const recordings = await fetchUserRecordings(user.id);

            const userData = {
                ...cleanedUser,
                recordings: recordings
            };

            console.log(`Processed ${recordings.length} recordings for user ${user.id}`);

            processedUsers++;
        }

        console.log(`All data fetched successfully for ${processedUsers} users`);
        return 'Data fetch completed';
    } catch (error) {
        console.error('Error in fetchAllData:', error);
        throw error;
    }
}

function cleanUserData(user) {
    return {
        userid: user.id,
        firstname: user.first_name,
        lastname: user.last_name,
        email: user.email
    };
}

async function fetchUserRecordings(userId) {
    console.log(`Fetching recordings for user ${userId}`);
    const recordings = [];

    const dateRanges = getDateRange(6);

    for (const dateRange of dateRanges) {
        try {
            const response = await makeApiCall(`/users/${userId}/recordings`, {
                from: dateRange.from,
                to: dateRange.to,
                page_size: 300
            });

            if (response && Array.isArray(response.meetings)) {
                for (const meeting of response.meetings) {
                    const processedRecording = await processRecording(meeting);
                    recordings.push(processedRecording);
                }
            } else {
                console.log(`No recordings found for user ${userId} in date range ${dateRange.from} to ${dateRange.to}`);
            }
        } catch (error) {
            console.error(`Error fetching recordings for user ${userId}:`, error.message);
        }
    }

    return recordings;
}

async function processRecording(recording) {
    const meetingSummary = await fetchMeetingSummary(recording.uuid);

    return {
        uuid: recording.uuid,
        topic: recording.topic,
        start_time: recording.start_time,
        duration: recording.duration,
        summary: meetingSummary ? {
            summary_title: meetingSummary.summary_title,
            summary_overview: meetingSummary.summary_overview,
            summary_details: meetingSummary.summary_details,
            next_steps: meetingSummary.next_steps
        } : null
    };
}

async function fetchMeetingSummary(meetingId) {
    try {
        const response = await makeApiCall(`/meetings/${meetingId}/meeting_summary`);
        console.log(`Fetched meeting summary for meeting ${meetingId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching meeting summary for meeting ${meetingId}:`, error.message);
        return null;
    }
}

module.exports = { fetchAllData, fetchUserRecordings, fetchMeetingSummary };
