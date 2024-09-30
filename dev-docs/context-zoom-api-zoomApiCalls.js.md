

---
# High Level Context
## context
**Last Updated at:** 9/30/2024, 8:04:04 PM

Summary:
This code file contains functions for interacting with the Zoom API, specifically for fetching user data, recordings, and meeting summaries. It includes utility functions for authentication, date range calculation, and API call handling.

Methods:

1. getDateRange(months = 6)
   Calculates date ranges for the past specified number of months.
   
   Example:
   ```javascript
   const ranges = getDateRange(3);
   console.log(ranges);
   ```

2. makeApiCall(endpoint, params = {})
   Makes an authenticated API call to the Zoom API.
   
   Example:
   ```javascript
   const userData = await makeApiCall('/users/me');
   console.log(userData);
   ```

3. fetchAllData()
   Fetches user data and recordings for a limited number of users.
   
   Example:
   ```javascript
   const result = await fetchAllData();
   console.log(result);
   ```

4. cleanUserData(user)
   Cleans and formats user data.
   
   Example:
   ```javascript
   const cleanedUser = cleanUserData(rawUserData);
   console.log(cleanedUser);
   ```

5. fetchUserRecordings(userId)
   Fetches recordings for a specific user within the last 6 months.
   
   Example:
   ```javascript
   const recordings = await fetchUserRecordings('user123');
   console.log(recordings);
   ```

6. processRecording(recording)
   Processes a recording and fetches its meeting summary.
   
   Example:
   ```javascript
   const processedRecording = await processRecording(rawRecording);
   console.log(processedRecording);
   ```

7. fetchMeetingSummary(meetingId)
   Fetches the summary for a specific meeting.
   
   Example:
   ```javascript
   const summary = await fetchMeetingSummary('meeting456');
   console.log(summary);
   ```
