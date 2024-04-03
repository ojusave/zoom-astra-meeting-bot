# Zoom Email Integration with AstraDB

This repository contains code for integrating Zoom email functionality with AstraDB, allowing users to fetch and store email data from Zoom into an AstraDB database.

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

### `.env`

Stores environment variables including Zoom OAuth settings, mailbox details, and AstraDB configuration.

## Dependencies

- `express`: Web framework for Node.js
- `body-parser`: Middleware to parse JSON bodies
- `axios`: Promise-based HTTP client for the browser and Node.js
- `dotenv`: Loads environment variables from a `.env` file
- `node-fetch`: A light-weight module that brings `window.fetch` to Node.js

## License



