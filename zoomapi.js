const { makeApiCall } = require('./utils/apiutils');
const { getDateRange } = require('./utils/dateutils');
const { downloadVttFile, writeDataToFile } = require('./utils/fileutils');

function cleanUserData(user) {
  return {
    userid: user.id,
    firstname: user.first_name,
    lastname: user.last_name,
    email: user.email
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

async function processRecording(recording) {
  let vttContent = null;
  for (const file of recording.recording_files) {
    if (file.file_type === 'TRANSCRIPT' && file.file_extension === 'VTT') {
      vttContent = await downloadVttFile(file.download_url);
      break;
    }
  }

  const meetingSummary = await fetchMeetingSummary(recording.uuid);

  return {
    uuid: recording.uuid,
    topic: recording.topic,
    start_time: recording.start_time,
    duration: recording.duration,
    vtt_content: vttContent,
    summary: meetingSummary ? {
      summary_title: meetingSummary.summary_title,
      summary_overview: meetingSummary.summary_overview,
      summary_details: meetingSummary.summary_details,
      next_steps: meetingSummary.next_steps
    } : null
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
      console.log(`Fetched recordings for user ${userId} from ${dateRange.from} to ${dateRange.to}`);

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

async function fetchAllData() {
  try {
    const response = await makeApiCall('/users');
    console.log('Users API response:', JSON.stringify(response, null, 2));

    let users = [];
    if (response && response.users && Array.isArray(response.users)) {
      users = response.users;
    } else if (response && typeof response === 'object') {
      users = [response];
    }

    if (users.length === 0) {
      console.log('No users found in the API response');
      return;
    }

    // Limit to first 5 users
    const maxUsers = 1;
    let processedUsers = 0;

    for (const user of users) {
      if (processedUsers >= maxUsers) {
        console.log(`Reached limit of ${maxUsers} users. Stopping processing.`);
        break;
      }

      const cleanedUser = cleanUserData(user);
      const recordings = await fetchUserRecordings(user.id);

      const userData = {
        ...cleanedUser,
        recordings: recordings
      };

      await writeDataToFile(userData, `user_${user.id}`);
      console.log(`Processed ${recordings.length} recordings for user ${user.id}`);

      processedUsers++;
    }

    console.log(`All data fetched and saved successfully for ${processedUsers} users`);
  } catch (error) {
    console.error('Error in fetchAllData:', error);
  }
}

module.exports = { fetchAllData };