# Zoom AstraDB RAG Chatbot 🤖🧠💬
A smart chatbot leveraging RAG (Retrieval-Augmented Generation) to update LLM context in real-time for Zoom meeting transcripts and summaries, powered by DataStax's AI Platform.

## Overview
This project integrates [Zoom's API](https://developers.zoom.us/docs/api/) with [Astra DB](https://www.datastax.com/products/datastax-astra) to create a chatbot that can fetch, process, and store Zoom meeting data, and respond to user queries about this data. The bot uses [OpenAI's language models](https://platform.openai.com/docs/models) for natural language processing and understanding.


## 🎯 What We're Trying to Achieve

The main goals of this project are:

1. Fetch Zoom meeting data, including recordings and summaries.
2. Store this data in Astra DB for efficient retrieval.
3. Provide a chatbot interface in Zoom Team Chat for users to query this data.
4. Use AI to interpret user queries and generate relevant responses based on the stored data.

## 📁 File Structure and Functionality

### server.js

This is the main entry point of the application. It sets up an Express server to handle incoming requests from Zoom's chatbot integration. Key functions:

- Initializes the server and middleware
- Defines routes for handling bot events
- Sets up error handling for uncaught exceptions and unhandled rejections

### Zoom/api/zoomApiCalls.js

This file contains functions for interacting with the Zoom API. Key functions:

- `fetchAllData()`: Retrieves user data and their recordings
- `fetchUserRecordings()`: Gets recordings for a specific user
- `fetchMeetingSummary()`: Retrieves the summary of a specific meeting

### Zoom/authentication/serverToServerAuth.js

Handles server-to-server authentication with Zoom's OAuth 2.0 system. It manages token generation and caching for API calls.

### Zoom/authentication/chatbotTokenAuth.js

Manages authentication for the Zoom chatbot, generating tokens for sending messages back to users.

### Zoom/chatbot/sendMessage.js

Contains logic for processing bot events and sending responses. Key functions:

- `handleBotEvent()`: Processes incoming bot events and determines the appropriate response
- `sendChatMessage()`: Sends a message back to the user via Zoom Chat
- `updateZoomData()`: Triggers the data update process

### datastax/astra_db.py

Python script for interacting with Astra DB. It sets up the database connection and provides functions for creating and accessing collections.

### datastax/load_data.py

Handles the process of loading fetched Zoom data into Astra DB.

### datastax/zoom_ai_bot.py

Contains the AI logic for processing user queries and generating responses based on the data stored in Astra DB.

### utils/pythonUtils.js

Provides utility functions for running Python scripts from Node.js, which is crucial for integrating the Python-based AI and database operations with the Node.js server.

## ⚙️ Environment Variables (.env)

The .env file contains crucial configuration and credentials. Here's what each variable represents:

- `ASTRA_DB_*`: Credentials and endpoints for your Astra DB instance
- `LANGFLOW_*`: Credentials and endpoints for your DataStax Langflow instance
- `ZOOM_CLIENT_ID` and `ZOOM_CLIENT_SECRET`: Credentials for Zoom OAuth app
- `ZOOM_BOT_JID`: Jabber ID for your Zoom chatbot
- `ZOOM_ACCOUNT_ID`: Your Zoom account ID
- `OAuth_Client_ID` and `OAuth_Client_Secret`: Credentials for Zoom server-to-server OAuth app
- `zoomApiBaseUrl`: Base URL for Zoom API calls

Take a look at the provided [.env.example](./.env.example) for reference.

## 🔑 Setting Up Credentials

### Zoom Teams Chatbot Configuration

1. Go to the [Zoom App Marketplace](https://marketplace.zoom.us/) and [create a new Chat App](https://developers.zoom.us/docs/team-chat-apps/create/).
2. Set up the necessary permissions (chat:write, etc.).
3. Configure the bot endpoint URL to point to your server's /anthropic endpoint.
4. Note down the Bot JID and Credentials (Client ID and Secret).

### Zoom Server-to-Server OAuth App Configuration

1. In the Zoom App Marketplace, [create a new Server-to-Server OAuth app](https://developers.zoom.us/docs/internal-apps/s2s-oauth/).
2. Grant it the necessary permissions to access user data and recordings.
3. Note down the Account ID, Client ID, and Client Secret.

### Astra DB Setup

1. Create an [Astra DB account](https://docs.datastax.com/en/astra-db-serverless/index.html) and set up a new database.
2. Create an application token with the necessary permissions.
3. Note down the Database ID, Application Token, and API Endpoint.

### OpenAI API Key

Obtain an API key from [OpenAI's platform](https://platform.openai.com/).

## 🛠️ Installation

### Prerequisites

1. **Python**: Ensure you have Python 3.7 or later installed. You can download it from [python.org](https://www.python.org/downloads/).
2. **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

### Python Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/ojusave/zmail_astradb.git
    cd zmail_astradb
    ```

2. **Create and activate a virtual environment**:
    ```sh
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install the required dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

4. **Create a `.env` file**:
    - Copy the contents of `.env.example` into a new file named `.env`.
    - Fill in the required environment variables with your own values.

### Node.js Setup

1. **Install the required dependencies**:
    ```sh
    npm install
    ```

2. **Run the Node.js application**:
    ```sh
    node server.js
    ```

## Testing the App

1. Ensure all environment variables are correctly set in the .env file.
2. Start the server with `node server.js` as stated above.
3. Use the Zoom Chat interface to send messages to your bot.

## Message Flow

When a user sends a message:

1. Zoom sends a POST request to your server's /anthropic endpoint.
2. `handleBotEvent()` in sendMessage.js processes the request.
3. If the message is "update", it triggers the data update process.
4. For other messages, it runs the zoom_ai_bot.py script to generate a response.
5. The response is sent back to the user via Zoom Chat using `sendChatMessage()`.

## Additional Notes

- Ensure your server is accessible to Zoom's servers for webhook delivery.
- Regularly update your Zoom data to keep the Astra DB current.
- Implement proper error handling and logging for production use.


