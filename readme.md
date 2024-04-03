# Zoom Email Integration with AstraDB and Email Content Vectorization


This repository offers code designed to integrate Zoom Mail Service functionalities with AstraDB, a distributed cloud database built on Apache Cassandra™. Zoom Mail Service provides comprehensive email features including inbox management, outbox, drafts, sent messages, archiving, and more. By integrating Zoom Mail Service with AstraDB, users can securely store and manage email data while also leveraging advanced processing capabilities such as content vectorization for enhanced functionality

### Purpose

The main purpose of this code is to provide a seamless solution for managing and analyzing email data from Zoom within an AstraDB database. With the added functionality of email content vectorization, users can perform advanced operations such as similarity searches, clustering, and more, leveraging the scalability, reliability, and performance benefits of AstraDB.

## Key Functionalities

- **OAuth Authorization with Zoom**: Manages OAuth flow with Zoom to authorize access to email data. Handles redirection, code exchanges, and secure storage of tokens.
- **Email Retrieval and Vectorization**: Fetches email data from Zoom, vectorizes email content using a Python script and the `SentenceTransformer` model, and stores the data along with its vector representation in AstraDB.
- **AstraDB Storage**: Utilizes AstraDB collections for storing email data and vectors, supporting advanced data operations.
- **API Endpoints**: Exposes API endpoints for initiating OAuth authorization, fetching and processing emails from Zoom, and storing them in AstraDB with vector data.

## Installation

1. Clone this repository.
2. Install Node.js dependencies: `npm install`.
3. Ensure Python (version 3.6 or later) is installed along with the `sentence-transformers` library: `pip install sentence-transformers`.
4. Configure environment variables in a `.env` file in the root directory:

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

5. Run the server: `node server.js`.

## Obtaining Credentials for Zoom Integration

To create an OAuth app that integrates with Zoom, follow the updated guidelines provided by Zoom for app development. This process is part of the new Zoom app creation build flow, which simplifies the development and integration of third-party applications with Zoom products.

### Prerequisites

Before you begin, ensure that:
- You have a Zoom account with the necessary permissions to create apps.
- You are familiar with Zoom's Key Concepts, which are essential for app development on the Zoom platform.

### Steps to Create an OAuth Client App

1. **Log into the Zoom Marketplace**: Access the [Zoom Marketplace](https://marketplace.zoom.us) and sign in with your Zoom account credentials.

2. **Initiate App Creation**:
   - Navigate to the section for building apps and select to create a general (OAuth) app.
   - You'll be guided through the process of specifying your app's details, such as name, app type (user-managed or admin-managed), and OAuth redirect URIs.
   - Curently mail scopes are only available in the user-managed app 

3. **Configure OAuth & Permissions**:
   - In the OAuth settings, provide your development redirect URI, which is essential for the OAuth flow between your application and Zoom.
   - Select the necessary Zoom mail scopes (i.e: mail:write mail:read). These scopes define the level of access your app will have to Zoom accounts and data.

4. **Development and Testing**:
   - Utilize the development credentials provided during the app setup to build and test your application.
   - Preview your app and conduct internal testing to ensure it functions as expected.

5. **App Review and Publication [Optional]** :
   - If you intend for your app to be used outside of your zoom account,submit it for review.
   - After approval, your app will be published to the Zoom App Marketplace, making it available to Zoom users worldwide.

For a detailed guide and additional resources, refer to Zoom's [official documentation](https://developers.zoom.us/docs/build-flow/create-oauth-apps/).

## Obtaining AstraDB Credentials

To obtain your AstraDB credentials for use in your application, log into the AstraDB Console and navigate to the database you wish to connect with. Your ASTRA_DB_ID and ASTRA_DB_REGION are found in the database's details page. For ASTRA_DB_NAMESPACE, these are specific to your database setup. To integrate with AstraDB, you'll need to generate an application token. This token provides access to AstraDB's APIs for your application.

1. **Access Astra Portal**: Sign in to your AstraDB account and navigate to the "Organization Settings".
2. **Token Management**: Go to "Token Management" within the settings.
3. **Generate Token**: Select the appropriate role for your application and create a token.

For detailed instructions, visit [AstraDB Documentation](https://docs.datastax.com/en/astra-serverless/docs/astra-faq.html).


## Usage

Interact with the integration through the following endpoints:

- `GET /`: Initiates Zoom OAuth flow for authorization.
- `GET /emails`: Fetches and vectorizes emails from Zoom, storing them and their vectors in AstraDB.

## Components

- `server.js`: Sets up the Express server, API endpoints, and integrates other components.
- `auth.js`: Handles the Zoom OAuth authorization flow.
- `emailAPI.js`: Manages email fetching, content vectorization, and storage in AstraDB.
- `dataStax.js`: Functions for AstraDB interactions, such as creating collections and inserting documents.
- `vector_conversion.py`: Python script for converting email content into vectors.

## Dependencies

Node.js:
- `express`, `body-parser`, `axios`, `dotenv`, `node-fetch` for server setup and API interactions.
- Ensure `child_process` module is available for executing Python scripts (built-in with Node.js).

Python:
- `sentence-transformers` for email content vectorization.

This integration facilitates advanced email data management and analysis by combining the strengths of Zoom, AstraDB, and modern vectorization techniques.
