import json
import os
from typing import List

import requests
import subprocess

class DriverOllama():
    def __init__(self, session, model: str, temperature: float = 0.1,system_prompt: str = None, user_prompt: str = None):
        self.url = os.getenv("OLLAMA_API_URL")
        self.session = session.sessionID
        self.ws = session.ws
        self.temperature = session.temperature
        
        self.model = model
        self.system_prompt = system_prompt
        self.user_prompt = user_prompt
        self.healthCheck()

    def healthCheck(self):
        info = requests.post(f"{self.url}/api/show", json={"model": self.model})
        info_json = info.json()
        model_info = info_json['model_info']

        print("Available model:", self.model)

        self.context_length, self.embedding_length = self.get_model_dimensions(model_info)

        print(f"📏 Context Length: {self.context_length}")
        print(f"📐 Embedding Length: {self.embedding_length}")
        self.context_length = self.context_length
        self.embedding_length = self.embedding_length

    def get_model_dimensions(self, model_info): 
        context_length = None
        embedding_length = None

        for key, value in model_info.items():
            if key.endswith("context_length"):
                context_length = value
            elif key.endswith("embedding_length"):
                embedding_length = value

        return context_length, embedding_length
        # "llama.context_length": 4096,
        # "llama.embedding_length": 5120,
        pass
    
    def list_models(self) -> List[str]:
        """List available models on the Ollama server"""
        response = self.session.get(f"{self.url}/api/tags")
        response.raise_for_status()

        # # Replace with your actual container name or ID
        # container_name = "my_container"

        # # Command to pull gemma:2b using ollama inside the container
        # command = ["docker", "exec", container_name, "ollama", "pull", "gemma:2b"]

        # # Run the command
        # try:
        #     subprocess.run(command, check=True)
        #     print("Model pulled successfully.")
        # except subprocess.CalledProcessError as e:
        #     print(f"Error occurred: {e}")

        print([m['name'] for m in response.json().get("models", [])])

        return [m['name'] for m in response.json().get("models", [])]
    
    def embed(self, text: str | List[str]) -> List[float] | List[List[float]]:
        """Generate embeddings for text or list of texts"""
        url = f"{self.url}/api/embeddings"

        # self.ws.send_progress_update(
        #     f"Using {self.model} model to generate embeddings.",
        # )

        # Handle single text
        if isinstance(text, str):
            payload = {
                "model": self.model,
                "prompt": text
            }
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return response.json()["embedding"]

        # Handle list of texts
        embeddings = []
        for t in text:
            payload = {
                "model": self.model,
                "prompt": t
            }
            try:
                response = requests.post(url, json=payload)
                print(f"Embedding for text: {response}")  # Debug print
                embeddings.append(response.json()["embedding"])
            # break
            except:
                response.raise_for_status()

        self.clearMemory()

        return embeddings


    def chat(self):

        try:
            url = f"{self.url}api/chat"
            self.ws.send_progress_update(message=url)
            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],
                "stream": False,
                "temperature": self.temperature
            }
            # print(f"Sending payload: {json.dumps(payload, indent=2)}")  # Debug print

            response = requests.post(url, json=payload)
            response.raise_for_status()

            if response.status_code != 200:
                # Debug print
                print(f"Error response content: {response.text}")
                error_content = response.json()
                raise Exception(f"Ollama API error: {error_content}")

            response_json = response.json()
            # print(f"Response received: {json.dumps(response_json, indent=2)}")  # Debug print

            content = response_json["message"]["content"]
            print('content')
            print(content)
            if not content:
                raise ValueError("Ollama returned empty response.")

            # Unloads model from memory to save resources
            self.clearMemory()

            return content
        except Exception as e:
            print(f"❌ Ollama API call error: {str(e)}")
            print(f"Full error: {repr(e)}")  # More detailed error info
            return "I'm sorry, I couldn't generate a response at the moment."

    def generate(self, user_prompt: str):
        try:
            url = f"{self.url}/api/generate"
            self.ws.send_progress_update(message=url)
            payload = {
                "model": self.model,
                "prompt": user_prompt,
                "stream": False
            }
            # print(f"Sending payload: {json.dumps(payload, indent=2)}")  # Debug print

            response = requests.post(url, json=payload)
            response.raise_for_status()
            
            if response.status_code != 200:
                print(f"Error response content: {response.text}")  # Debug print
                error_content = response.json()
                raise Exception(f"Ollama API error: {error_content}")

            response_json = response.json()
            # print(f"Response received: {json.dumps(response_json, indent=2)}")  # Debug print

            content = response_json["response"]
            print('content')
            print(content)
            if not content:
                raise ValueError("Ollama returned empty response.")

            # Unloads model from memory to save resources
            self.clearMemory()
            

            return content
        except Exception as e:
            print(f"❌ Ollama API call error: {str(e)}")
            print(f"Full error: {repr(e)}")  # More detailed error info
            self.clearMemory()
            return "I'm sorry, I couldn't generate a response at the moment."

    def clearMemory(self):

        url = f"{self.url}/api/generate"
        payloadUnload = {
            "model": self.model,
            "keep_alive": 0
        }
        response = requests.post(url, json=payloadUnload)

        return response

