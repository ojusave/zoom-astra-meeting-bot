import os
import warnings
import logging
from langflow.load import run_flow_from_json
from colorama import Fore, Style, init  # Import colorama for colored output

# ASCII art to be logged at the start of the app
ASCII_ART = f"""{Fore.RED}
███████╗ ██████╗  ██████╗ ███╗   ███╗     █████╗ ██╗
╚══███╔╝██╔═══██╗██╔═══██╗████╗ ████║    ██╔══██╗██║
  ███╔╝ ██║   ██║██║   ██║██╔████╔██║    ███████║██║
 ███╔╝  ██║   ██║██║   ██║██║╚██╔╝██║    ██╔══██║██║
███████╗╚██████╔╝╚██████╔╝██║ ╚═╝ ██║    ██║  ██║██║
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝    ╚═╝  ╚═╝╚═╝
                                                    
██████╗  ██████╗ ████████╗                          
██╔══██╗██╔═══██╗╚══██╔══╝                          
██████╔╝██║   ██║   ██║                             
██╔══██╗██║   ██║   ██║                             
██████╔╝╚██████╔╝   ██║                             
╚═════╝  ╚═════╝    ╚═╝  Ask me about your meetings!
{Style.RESET_ALL}"""
print(ASCII_ART)

# Initialize colorama
init(autoreset=True)

# Suppress specific undesirable warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langchain_astradb")
warnings.filterwarnings("ignore", category=Warning, module="langflow.schema.message")
logging.getLogger("langfuse").setLevel(logging.ERROR)

# Define the TWEAKS dictionary
TWEAKS = {
    "ChatInput-mmwhX": {},
    "ParseData-GmsuE": {},
    "Prompt-xRexO": {},
    "ChatOutput-E1T42": {},
    "OpenAIModel-9HuFT": {
        "stream": False,
    },
    "AstraVectorize-QmWsS": {},
    "AstraDB-kAZ20": {
        "number_of_results": 10,
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
    json_file_path = os.path.join(script_dir, "Zoom_Astra.json")

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
    """
    Main function to handle user input and output.
    """
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
