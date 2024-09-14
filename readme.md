# Zoom Data Fetcher

This project is a Node.js application designed to fetch and process data from the Zoom API, including user information, meeting recordings, and meeting summaries. It stores the processed data in local files and can optionally push the data to an external endpoint.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Key Features](#key-features)
- [API Endpoints Used](#api-endpoints-used)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
.
├── auth.js
├── config.js
├── server.js
├── utils
│   ├── apiutils.js
│   ├── dateutils.js
│   └── fileutils.js
└── zoomapi.js
```

- `auth.js`: Handles OAuth 2.0 authentication with Zoom API.
- `config.js`: Contains configuration settings for the application.
- `server.js`: The main entry point of the application.
- `utils/`: Directory containing utility functions.
  - `apiutils.js`: Utility functions for making API calls.
  - `dateutils.js`: Functions for date manipulation.
  - `fileutils.js`: Functions for file operations (downloading, writing).
- `zoomapi.js`: Core logic for fetching and processing Zoom data.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/ojusave/zmail_astradb
   cd zoom-data-fetcher
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your `config.js` file with the necessary credentials and settings.

## Configuration

Edit the `config.js` file to include your Zoom API credentials and other settings:

```javascript
const config = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  accountId: 'YOUR_ACCOUNT_ID',
  zoomApiBaseUrl: 'https://api.zoom.us/v2',
  endpointUrl: 'YOUR_ENDPOINT_URL' // Optional: for pushing data to an external service
};

module.exports = config;
```

## Usage

To run the application:

```
node server.js
```

This will start the process of fetching data from the Zoom API, processing it, and saving it to local files.

## Key Features

1. **OAuth 2.0 Authentication**: Securely authenticates with the Zoom API using the account credentials grant type.
2. **User Data Fetching**: Retrieves information about Zoom users in the account.
3. **Recording Data Retrieval**: Fetches recording data for each user over the past 6 months.
4. **Meeting Summary Fetching**: Retrieves meeting summaries for each recording when available.
5. **Transcript Download**: Downloads and processes VTT transcript files for recordings.
6. **Data Processing**: Cleans and structures the fetched data for easier analysis.
7. **File Storage**: Saves processed data to local text files.
8. **Date Range Handling**: Splits API requests into 30-day chunks to handle Zoom's date range limitations.

## API Endpoints Used

- `/users`: To fetch user data
- `/users/{userId}/recordings`: To fetch recording data for each user
- `/meetings/{meetingId}/meeting_summary`: To fetch meeting summaries

## Error Handling

The application includes error handling for API calls, file operations, and data processing. Errors are logged to the console for debugging purposes.

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a new Pull Request



---
