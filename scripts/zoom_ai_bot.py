import os
import warnings
import logging
import uuid
import sys
from langflow.load import run_flow_from_json
from colorama import Fore, Style, init
from astra_db import ASTRA_DB_APPLICATION_TOKEN

# Initialize colorama
init(autoreset=True)

# Suppress specific undesirable warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langchain_astradb")
warnings.filterwarnings("ignore", category=Warning, module="langflow.schema.message")
logging.getLogger("langfuse").setLevel(logging.ERROR)

CHAT_SESSION_ID = uuid.uuid4()

# Define the TWEAKS dictionary
TWEAKS = {
    "ChatInput-mmwhX": {
        "session_id": CHAT_SESSION_ID,
    },
    "ParseData-GmsuE": {},
    "Prompt-xRexO": {},
    "ChatOutput-E1T42": {
        "session_id": CHAT_SESSION_ID,
    },
    "AstraVectorize-QmWsS": {},
    "AstraDB-kAZ20": {
        "number_of_results": 4,
        "token": ASTRA_DB_APPLICATION_TOKEN,
    },
    "AstraDBChatMemory-ID3YR": {
        "session_id": CHAT_SESSION_ID,
    },
    "Memory-VD7Lm": {
        "n_messages": 10,
        "session_id": CHAT_SESSION_ID,
    },
    "StoreMessage-n9PGX": {
        "session_id": CHAT_SESSION_ID,
    },
    "StoreMessage-Vlb7O": {
        "session_id": CHAT_SESSION_ID,
    },
    "OpenAIModel-VgMj3": {
        "model_name": "gpt-4o-mini",
    },
}

def get_response(user_input):
    """
    Run the flow from the JSON file with the given user input and return the result.

    Args:
        user_input (str): The input message from the user.

    Returns:
        str: The response from the flow.
    """
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the full path to the JSON file
    json_file_path = os.path.join(script_dir, "static/Zoom_Astra.json")

    result = run_flow_from_json(
        flow=json_file_path,
        input_value=user_input,
        fallback_to_env_vars=True,  # False by default
        tweaks=TWEAKS,
        env_file=os.path.join(script_dir, ".env"),
    )

    # Extract the "Chat Output" message
    chat_output_message = result[0].outputs[0].messages[0].message

    return chat_output_message


def main():
    if len(sys.argv) > 1:
        # If a query is provided as a command-line argument, process it and print the response
        query = ' '.join(sys.argv[1:])
        response = get_response(query)
        print(response)
    else:
        # If no arguments are provided, run the interactive mode
        print("Welcome to the Zoom AI Bot. Type 'exit' to quit.")
        while True:
            user_input = input("\nYou: ")
            if user_input.lower() == 'exit':
                print("Goodbye!")
                break
            response = get_response(user_input)
            print(f"{Fore.GREEN}Bot: {Fore.CYAN}{response}{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
