""" Astra Database Helper Functions """
import os
import astrapy
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the DataStax Astra DataAPIClient
# For DataStax Astra, both the token and endpoint are required to connect to the database
ASTRA_DB_APPLICATION_TOKEN = os.environ.get("ASTRA_DB_APPLICATION_TOKEN")
if not ASTRA_DB_APPLICATION_TOKEN:
    raise EnvironmentError(
        "Please ensure that the environment variable 'ASTRA_DB_APPLICATION_TOKEN' is set."
    )

ASTRA_DB_API_ENDPOINT = os.environ.get("ASTRA_DB_API_ENDPOINT")
if not ASTRA_DB_API_ENDPOINT:
    raise EnvironmentError(
        "Please ensure that the environment variable 'ASTRA_DB_API_ENDPOINT' is set."
    )

# For Langflow, the base API URL is required,
# but the flow ID, endpoint, and token are optional
# depending on if you're using DataStax Langflow or a local OSS version
LANGFLOW_BASE_API_URL = os.environ.get("LANGFLOW_BASE_API_URL")
if not LANGFLOW_BASE_API_URL:
    raise EnvironmentError(
        "Please ensure that the environment variable 'LANGFLOW_BASE_API_URL' is set."
    )

LANGFLOW_ID=os.environ.get("LANGFLOW_ID", None)

# You can use either an endpoint value or a flow ID to reference a flow.
LANGFLOW_FLOW_ENDPOINT=os.environ.get("LANGFLOW_FLOW_ENDPOINT", None)
LANGFLOW_FLOW_ID=os.environ.get("LANGFLOW_FLOW_ID", None)

# DataStax Langflow requires an application token to run flows, local OSS versions do not
LANGFLOW_APPLICATION_TOKEN=os.environ.get("LANGFLOW_APPLICATION_TOKEN", None)

client = astrapy.DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
database = client.get_database(ASTRA_DB_API_ENDPOINT)

def create_collection(collection_name, embedding_and_chunk_size):
    """
    Create a collection in the Astra database with the specified name and embedding model dimension.

    Args:
        collection_name (str): The name of the collection to create.
        embedding_and_chunk_size (int): The dimension of the embedding model and chunk size.

    Returns:
        Collection: The created collection object.

    Raises:
        astrapy.exceptions.CollectionAlreadyExistsException: If the collection already exists.
    """
    print(f"Creating Astra database collection '{collection_name}'...")

    # Create collection with Nvidia's NV-Embed-QA embedding model
    try:
        collection = database.create_collection(
            collection_name,
            dimension=embedding_and_chunk_size,
            service={"provider": "nvidia", "modelName": "NV-Embed-QA"},
            metric=astrapy.constants.VectorMetric.COSINE,
            check_exists=True,
        )
        return collection
    except astrapy.exceptions.CollectionAlreadyExistsException:
        print(f"Astra database collection '{collection_name}' already exists, moving on...")
        return database.get_collection(collection_name)

def get_collection(collection_name):
    """
    Retrieve a collection from the Astra database with the specified name.

    Args:
        collection_name (str): The name of the collection to retrieve.

    Returns:
        Collection: The retrieved collection object.
    """
    return database.get_collection(collection_name)
