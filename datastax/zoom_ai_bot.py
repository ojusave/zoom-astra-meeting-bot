import os
import warnings
import logging
import sys
from typing import Optional
import requests
from langflow.load import run_flow_from_json
from colorama import Fore, Style, init
from astra_db import (
    ASTRA_DB_APPLICATION_TOKEN,
    ASTRA_DB_API_ENDPOINT,
    LANGFLOW_BASE_API_URL,
    LANGFLOW_FLOW_ENDPOINT,
    LANGFLOW_FLOW_ID,
    LANGFLOW_APPLICATION_TOKEN,
)

# Initialize colorama
init(autoreset=True)

# Suppress specific undesirable warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langchain_astradb")
warnings.filterwarnings("ignore", category=Warning, module="langflow.schema.message")
logging.getLogger("langfuse").setLevel(logging.ERROR)

CHAT_SESSION_ID = "local_zoom_ai_bot_user"

# Define the TWEAKS dictionary
TWEAKS = {
    "ChatInput-e99Az": {},
    "ParseData-QAU3e": {},
    "Prompt-vpRss": {},
    "ChatOutput-0wraO": {},
    "AstraDB-Q3sXh": {
        "number_of_results": 4,
        "token": ASTRA_DB_APPLICATION_TOKEN,
        "api_endpoint": ASTRA_DB_API_ENDPOINT,
    },
    "AstraDBChatMemory-GUm9k": {},
    "Memory-X9L1q": {
        "n_messages": 10,
    },
    "StoreMessage-CzDzu": {},
    "StoreMessage-xw28N": {},
    "OpenAIModel-E70M2": {
        "model_name": "gpt-4o-mini",
    },
}

def run_flow(message: str,
             endpoint: str,
             output_type: str = "chat",
             input_type: str = "chat",
             tweaks: Optional[dict] = None,
             application_token: Optional[str] = None,
             session_id: Optional[str] = None) -> dict:
    """
    Run a flow with a given message and optional tweaks.

    :param message: The message to send to the flow
    :param endpoint: The ID or the endpoint name of the flow
    :param tweaks: Optional tweaks to customize the flow
    :return: The JSON response from the flow
    """
    if LANGFLOW_FLOW_ID:
        api_url = f"{LANGFLOW_BASE_API_URL}/lf/{LANGFLOW_FLOW_ID}/api/v1/run/{endpoint}"
    else:
        api_url = f"{LANGFLOW_BASE_API_URL}/api/v1/run"

    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
        #"session_id": session_id
    }
    headers = None
    if tweaks:
        payload["tweaks"] = tweaks
    if application_token:
        headers = {"Authorization": "Bearer " + application_token, "Content-Type": "application/json"}
    response = requests.post(api_url, json=payload, headers=headers, timeout=30)
    return response.json()


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


def get_response_from_api(user_input, session_id=CHAT_SESSION_ID):
    """
    Run the flow from the JSON file with the given user input and return the result.

    Args:
        user_input (str): The input message from the user.

    Returns:
        str: The response from the flow.
    """
    result = run_flow(
        message=user_input,
        endpoint=LANGFLOW_FLOW_ENDPOINT,
        tweaks=TWEAKS,
        session_id=session_id,
        application_token=LANGFLOW_APPLICATION_TOKEN,
    )

    # Extract the "Chat Output" message
    chat_output_message = result['outputs'][0]['outputs'][0]['messages'][0]['message']

    return chat_output_message


def main():
    if len(sys.argv) > 1:
        # If a query is provided as a command-line argument, process it and print the response
        query = ' '.join(sys.argv[1:])
        response = get_response_from_api(query, session_id="ZAstraO_Bot")
        print(response)
    else:
        # If no arguments are provided, run the interactive mode
        print("Welcome to the Zoom AI Bot. Type 'exit' to quit.")
        while True:
            user_input = input("\nYou: ")
            if user_input.lower() == 'exit':
                print("Goodbye!")
                break
            response = get_response_from_api(user_input)
            print(f"{Fore.GREEN}Bot: {Fore.CYAN}{response}{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
