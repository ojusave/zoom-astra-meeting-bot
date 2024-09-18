import datetime
import os
import json
from astrapy import DataAPIClient
from dotenv import load_dotenv
from zoom_user import User
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables from .env file
load_dotenv()

# Define the path to the data directory
data_dir = os.path.join(os.path.dirname(__file__), '../data')

client = DataAPIClient(os.environ["ASTRA_DB_APPLICATION_TOKEN"])
database = client.get_database(os.environ["ASTRA_DB_API_ENDPOINT"])
collection = database.get_collection("user_logs")

# Function to load JSON and map to the User class
def load_user_from_json(json_file):
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

        # Create a User object from the loaded JSON data
        user_obj = User(**data)
        return user_obj

# Define a simple class to wrap the text content
class Document:
    def __init__(self, page_content, metadata=None):
        self.page_content = page_content
        self.metadata = metadata if metadata is not None else {}

# Iterate over all files in the data directory
for filename in os.listdir(data_dir):
    if filename.endswith('.json'):
        file_path = os.path.join(data_dir, filename)
        user = load_user_from_json(file_path)
        print(f"\n\n\nUser data from {filename}:")
        if user.recordings:
            print(user.recordings)
            print("Recordings found, chunking data...")
            for recording in user.recordings:
                if recording.vtt_content:
                    print(f"Recording {recording} has {len(recording.vtt_content)} characters.")
                    # Chunk the vtt_content into 1KB chunks
                    text_splitter = RecursiveCharacterTextSplitter(
                        chunk_size=1024,
                        chunk_overlap=128
                    )
                    # Wrap the vtt_content in a Document object
                    document = Document(recording.vtt_content)
                    chunked_vtt_content = text_splitter.split_documents([document])
                    print(f"Recording {recording.uuid} has {len(chunked_vtt_content)} chunks.")

                    for index, chunk in enumerate(chunked_vtt_content):
                        # Insert the user data into the collection
                        try:
                            collection.update_one(
                                {'_id': recording.uuid + str(index)},
                                {'$set': {
                                    'userid': user.userid, 
                                    'firstname': user.firstname,
                                    'lastname': user.lastname,
                                    'email': user.email,
                                    'topic': recording.topic,
                                    'start_time': recording.start_time,
                                    'duration': recording.duration,
                                    '$vectorize': chunk.page_content, 
                                    'content': chunk.page_content, 
                                    'metadata': { 'ingested': datetime.datetime.now() }
                                }},
                                upsert=True
                            )
                            print(f"Iteration {index}: Successfully inserted data for {recording.uuid}")
                        except Exception as e:
                            print(f"Iteration {index}: Error inserting data for {recording.uuid}: {e}")
        else:
            print("No recordings found.")
