""" This script runs a Zoom AI Bot using DataStax Langflow. """
import warnings
import logging
import sys
from typing import Optional
import requests
from colorama import Fore, Style, init
from astra_db import (
    LANGFLOW_APPLICATION_TOKEN,
    LANGFLOW_BASE_API_URL,
    LANGFLOW_ID,
    LANGFLOW_FLOW_ENDPOINT,
    LANGFLOW_FLOW_ID
)

# Initialize colorama
init(autoreset=True)

# Suppress specific undesirable warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langchain_astradb")
warnings.filterwarnings("ignore", category=Warning, module="langflow.schema.message")
logging.getLogger("langfuse").setLevel(logging.ERROR)

# Define the TWEAKS dictionary
TWEAKS = {
    "Memory-X9L1q": {
        "n_messages": 10,
    },
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
    if LANGFLOW_ID:
        # This implies DataStax Langflow is being used
        api_url = f"{LANGFLOW_BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{endpoint}"
    else:
        # This implies a local OSS version or a service like Render is being used
        api_url = f"{LANGFLOW_BASE_API_URL}/api/v1/run/{endpoint}"

    #print(f"API URL: {api_url}")

    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
        "session_id": session_id
    }
    headers = None
    if tweaks:
        payload["tweaks"] = tweaks
    if application_token:
        headers = {"Authorization": "Bearer " + application_token, "Content-Type": "application/json"}
    response = requests.post(api_url, json=payload, headers=headers, timeout=30)
    return response.json()


def get_response_from_api(user_input, session_id):
    """
    Run the flow using the DataStax Langflow API with the given user input and return the result.
    Use the session_id to track conversations across multiple users.

    Args:
        user_input (str): The input message from the user.
        session_id (str): The session ID for the user.

    Returns:
        str: The response from the flow.
    """
    endpoint = LANGFLOW_FLOW_ENDPOINT or LANGFLOW_FLOW_ID
    result = run_flow(
        message=user_input,
        endpoint=endpoint,
        tweaks=TWEAKS,
        session_id=session_id,
        application_token=LANGFLOW_APPLICATION_TOKEN,
    )

    # Extract the "Chat Output" message
    chat_output_message = result['outputs'][0]['outputs'][0]['messages'][0]['message']

    return chat_output_message


def main():
    """ Run the Zoom AI Bot in interactive mode or with a query from the command line. """
    if len(sys.argv) > 1:
        # If a query is provided as a command-line argument, assume this is coming from Zoom
        query = ' '.join(sys.argv[1:])
        response = get_response_from_api(query, session_id="ZAstraO_Bot")
        print(response)
    else:
        # If no arguments are provided, run the interactive mode locally
        print("Welcome to the Zoom AI Bot. Type 'exit' to quit.")
        while True:
            user_input = input("\nYou: ")
            if user_input.lower() == 'exit':
                print("Goodbye!")
                break
            response = get_response_from_api(user_input, session_id="LocalZoom_Bot")
            print(f"{Fore.GREEN}Bot: {Fore.CYAN}{response}{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
