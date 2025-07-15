# This controller generates the initial configuration of each request to the service

from uuid import uuid4
import uuid



from ..services.DriverStorage import DriverStorage
from ..services.websocket.ServiceWebsocket import WebsocketService
from ..services.DriverOllama import DriverOllama

from ..utils.db_connection import MongoDB, QdrantDB
from ..utils.system_prompts import chunk_size, chunk_overlap, top_k, max_token_limit, temperature


class TerraformController():
    def __init__(self, session, request=None):
        # Global variables
        self.session = session
        self.sessionID = session.sessionID
        self.companyID = session.companyID
        self.userID = session.userID

        self.mongo = session.mongo
        self.qdrant = session.qdrant
        self.ws = session.ws

        self.temperature = session.temperature
        self.chunk_size = session.chunk_size
        self.chunk_overlap = session.chunk_overlap
        self.top_k = session.top_k
        self.max_token_limit = session.max_token_limit
        # self.upload_folder = storage.upload_folder
        # self.output_folder = storage.output_folder
        # self.terraform_folder = storage.terraform_folder

        # Controller variables
        self.request = request


    def index(self):
        pass

    def generate(self, OLLAMA, text):
        self.ws.send_progress_update(
            f"Using {OLLAMA.model} model to generate Terraform configuration.",
        )
        return OLLAMA.generate(text)
        # This method is a placeholder for generating text using the Ollama service
        # It should be implemented in the derived class or service

        pass

    def store(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

    def close(self):
        pass
