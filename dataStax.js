// This part of the code handles the datastax logic like Creating a Collection, inserting data into a collection & getting the data from the collection
let fetch;

(async () => {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
})();

const baseUrl = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${process.env.ASTRA_DB_NAMESPACE}/collections`;
const headers = {
    'Content-Type': 'application/json',
    'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN,
};

async function createCollection(collectionName, options = null) {
    const body = options ? JSON.stringify({ name: collectionName, ...options }) 
                         : JSON.stringify({ name: collectionName });
    try {
        const response = await fetch(`${baseUrl}`, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (response.ok) {
            console.log(`Collection ${collectionName} created successfully.`);
        } else if (response.status === 409) {
            console.log(`Collection ${collectionName} already exists.`);
        } else {
            const errorText = await response.text(); 
            throw new Error(`Failed to create collection: ${collectionName}, Error: ${errorText}`);
        }
    } catch (error) {
        console.error(`Error creating collection ${collectionName}:`, error);
        throw error;
    }
}




async function insertDocumentIntoCollection(collectionName, document) {
    try {
        const response = await fetch(`${baseUrl}/${collectionName}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(document),
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error(`Failed to insert document into collection: ${collectionName}, Response: ${errorText}`);
            throw new Error(`Failed to insert document into collection: ${collectionName}`);
        }
        console.log(`Document inserted into collection ${collectionName} successfully.`);
    } catch (error) {
        console.error(`Error inserting document into collection ${collectionName}:`, error);
        throw error;
    }
}


async function fetchDocumentsFromCollection(collectionName) {
    try {
        const response = await fetch(`${baseUrl}/${collectionName}`, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) throw new Error(`Failed to fetch documents from collection: ${collectionName}`);
        const data = await response.json();
        console.log(`Documents fetched from collection ${collectionName} successfully.`);
        return data.data; 
    } catch (error) {
        console.error(`Error fetching documents from collection ${collectionName}:`, error);
        throw error;
    }
}


async function fetchAccessToken() {
    const collectionName = 'tokens'; 
    try {
        //check if the collection exists
        const listResponse = await fetch(`${baseUrl}/${collectionName}`, {
            method: 'GET',
            headers: headers,
        });

        if (!listResponse.ok) {
            throw new Error('Failed to list documents for access token retrieval.');
        }

        const listData = await listResponse.json();

      
        const documents = Object.keys(listData.data);
        if (documents.length === 0) {
            throw new Error('No access token document found.');
        }
        
        const latestDocumentId = documents[0]; 
        const response = await fetch(`${baseUrl}/${collectionName}/${latestDocumentId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the latest access token document.');
        }

        const data = await response.json();
        
       
        const accessToken = data.data.Access_Token; 
        if (!accessToken) {
            throw new Error('Access token not found in the document.');
        }

        console.log('Access token fetched successfully.');
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

async function fetchDocumentsFromCollection(collectionName) {
    try {
        const response = await fetch(`${baseUrl}/${collectionName}`, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) throw new Error(`Failed to fetch documents from collection: ${collectionName}`);
        const data = await response.json();
        console.log(`Documents fetched from collection ${collectionName} successfully.`);
        return data.data; // Adjust this return based on the actual structure of your response data
    } catch (error) {
        console.error(`Error fetching documents from collection ${collectionName}:`, error);
        throw error;
    }
}
module.exports = { createCollection, insertDocumentIntoCollection, fetchDocumentsFromCollection, fetchAccessToken, fetchDocumentsFromCollection };