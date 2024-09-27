import datetime
import os
import json
import sys  # Import sys for exit
from zoom_user import User  # Objects to handle Zoom data
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from tqdm import tqdm  # tqdm for progress bar
from colorama import Fore, Style, init  # colorama for pretty output
from astra_db import create_collection, get_collection

def main():
    try:
        # ASCII art to be logged at the start of the app
        ASCII_ART = f"""{Fore.RED}
        ███████╗ ██████╗  ██████╗ ███╗   ███╗    ████████╗ ██████╗ 
        ╚══███╔╝██╔═══██╗██╔═══██╗████╗ ████║    ╚══██╔══╝██╔═══██╗
          ███╔╝ ██║   ██║██║   ██║██╔████╔██║       ██║   ██║   ██║
        ███╔╝  ██║   ██║██║   ██║██║╚██╔╝██║       ██║   ██║   ██║
        ███████╗╚██████╔╝╚██████╔╝██║ ╚═╝ ██║       ██║   ╚██████╔╝
        ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝       ╚═╝    ╚═════╝ 
                                                                    
        █████╗ ███████╗████████╗██████╗  █████╗                   
        ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗                  
        ███████║███████╗   ██║   ██████╔╝███████║                  
        ██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║                  
        ██║  ██║███████║   ██║   ██║  ██║██║  ██║                  
        ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  data loader!
        {Style.RESET_ALL}"""
        print(ASCII_ART)

        # Initialize colorama
        init(autoreset=True)

        # Define the path to the Zoom data directory
        data_dir = os.path.join(os.path.dirname(__file__), '../data')

        # Define embedding model dimension and chunk size
        EMBEDDING_AND_CHUNK_SIZE = 1024
        ASTRA_COLLECTION_NAME = "user_logs"

        # Create the collection in DataStax Astra DB
        create_collection(ASTRA_COLLECTION_NAME, EMBEDDING_AND_CHUNK_SIZE)

        # Get the collection from Astra DB
        collection = get_collection(ASTRA_COLLECTION_NAME)

        def dict_to_string(d):
            if isinstance(d, str):
                return d
            elif isinstance(d, dict):
                return ", ".join(f"{k}: {v}" for k, v in d.items())
            else:
                return str(d)

        # Function to load JSON and map to the User class
        def load_user_from_json(json_file):
            """
            Load JSON data from a file and map it to a User object.
            """
            with open(json_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
                return User(**data)

        # Iterate over all files in the data directory,
        for filename in os.listdir(data_dir):
            if filename.endswith('.json'):
                file_path = os.path.join(data_dir, filename)
                user = load_user_from_json(file_path)
                print(
                    f"\nUser data from {Fore.MAGENTA}{filename}:{Style.RESET_ALL}\n"
                    f"Name: {Fore.MAGENTA}{user.get_firstname()} {user.get_lastname()}{Style.RESET_ALL}\n"
                    f"Email: {Fore.MAGENTA}{user.get_email()}{Style.RESET_ALL}"
                )
                if user.recordings:
                    print(f"{Fore.GREEN}Recordings found, chunking data...{Style.RESET_ALL}")
                    for recording in user.recordings:
                        if recording.summary:
                            summary_text = f"Title: {recording.summary.summary_title}\n"
                            summary_text += f"Overview: {recording.summary.summary_overview}\n"
                            
                            if recording.summary.summary_details:
                                details_text = "; ".join(dict_to_string(detail) for detail in recording.summary.summary_details)
                                summary_text += f"Details: {details_text}\n"
                            
                            if recording.summary.next_steps:
                                next_steps_text = "; ".join(dict_to_string(step) for step in recording.summary.next_steps)
                                summary_text += f"Next Steps: {next_steps_text}"

                            document = Document(page_content=summary_text)

                            # Chunk the vtt_content into 1KB chunks
                            text_splitter = RecursiveCharacterTextSplitter(
                                chunk_size=EMBEDDING_AND_CHUNK_SIZE,
                                chunk_overlap=128
                            )

                            chunked_vtt_content = text_splitter.split_documents([document])
                            print(
                                f"Recording {Fore.MAGENTA}{Style.DIM}{recording.uuid}{Style.RESET_ALL} "
                                f"has {len(summary_text)} characters in {len(chunked_vtt_content)} chunks."
                            )

                            with tqdm(total=len(chunked_vtt_content), desc="Inserting chunks") as pbar:
                                for index, chunk in enumerate(chunked_vtt_content):
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
                                                'metadata': {'ingested': datetime.datetime.now()}
                                            }},
                                            upsert=True
                                        )
                                        pbar.update(1)
                                    except Exception as e:
                                        print(
                                            f"{Fore.RED}Iteration {index}: Error inserting data for {recording.uuid}: {e}{Style.RESET_ALL}"
                                        )
                else:
                    print(f"{Fore.RED}No recordings found.{Style.RESET_ALL}")

    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
