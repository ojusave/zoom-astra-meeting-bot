# Zoom Email Integration with AstraDB

The code in this repository enables the integration of Zoom email functionality with AstraDB. Zoom is a popular video conferencing platform that also provides email features. AstraDB is a distributed cloud database built on Apache Cassandra™. By integrating Zoom email functionality with AstraDB, users can fetch and store email data from Zoom into an AstraDB database efficiently and securely.

### Purpose

The main purpose of this code is to provide a seamless solution for managing email data from Zoom within an AstraDB database. This integration allows users to leverage the scalability, reliability, and performance benefits of AstraDB while utilizing the email features of Zoom.

## Functionality

The code facilitates the following key functionalities:

- **OAuth Authorization with Zoom**: The code initiates the OAuth flow with Zoom to obtain authorization for accessing email data. It handles the redirection flow, exchanges authorization codes for access tokens, and stores the tokens securely.

- **Email Retrieval from Zoom**: Once authorized, the code fetches email data from Zoom using the obtained access tokens. It interacts with the Zoom API to retrieve email messages and their details.

- **Storage in AstraDB**: The fetched email data is stored in AstraDB collections. The code manages the creation of collections, insertion of email documents, and retrieval of stored emails as needed.

- **API Endpoints**: The code exposes API endpoints to trigger OAuth authorization, fetch emails from Zoom, and retrieve stored emails from AstraDB. These endpoints provide an interface for users or applications to interact with the integration.

## Installation

1. Clone this repository to your local machine.
2. Install dependencies by running `npm install`.
3. Set up your environment variables by creating a `.env` file in the root directory with the following content:

    ```plaintext
    # Zoom OAuth settings
    ZOOM_CLIENT_ID=
    ZOOM_CLIENT_SECRET=
    REDIRECT_URI=

    # Mailbox details
    MAILBOX_EMAIL=

    # AstraDB
    ASTRA_DB_ID=
    ASTRA_DB_REGION=
    ASTRA_DB_KEYSPACE=
    ASTRA_DB_NAMESPACE=
    ASTRA_DB_APPLICATION_TOKEN=
    ```

4. Run the server using `node server.js`.

## Usage

Once the server is running, you can interact with the following endpoints:

- `GET /`: Initiates Zoom OAuth flow. Redirects to Zoom OAuth authorization page.
- `GET /emails`: Fetches emails from the Zoom mailbox and stores them in the AstraDB database.


## Components

### `server.js`

This file initializes the Express server and defines routes for handling OAuth redirection, email requests from AstraDB.

### `auth.js`

Handles the Zoom OAuth flow, obtains access tokens, and stores them in the AstraDB collection.

### `emailapi.js`

Fetches emails from the Zoom API and stores them in the AstraDB collection.

### `dataStax.js`

Contains functions for interacting with AstraDB, including creating collections, inserting documents, and fetching data.


## Dependencies

- `express`: Web framework for Node.js
- `body-parser`: Middleware to parse JSON bodies
- `axios`: Promise-based HTTP client for the browser and Node.js
- `dotenv`: Loads environment variables from a `.env` file
- `node-fetch`: A light-weight module that brings `window.fetch` to Node.js



