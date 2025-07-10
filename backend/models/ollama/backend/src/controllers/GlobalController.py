# This controller generates the initial configuration of each request to the service

from uuid import uuid4
import uuid



from ..services.DriverStorage import DriverStorage
from ..services.websocket.ServiceWebsocket import WebsocketService
from ..services.DriverOllama import DriverOllama

from ..utils.db_connection import MongoDB, QdrantDB
from ..utils.system_prompts import chunk_size, chunk_overlap, top_k, max_token_limit, temperature


class GlobalRequestGenerate():
    def __init__(self, session_id=None):
        self.session(session_id)
        self.services()
        self.config()
        self.storage()

        print(f"userID => {self.userID}")
        print(f"sessionID => {self.sessionID}")
        print(f"companyID => {self.companyID}")
        print(f"storage frrom global=> {self.storage}")

    def session(self, session_id):
        self.sessionID = session_id or str(uuid.uuid4())
        self.companyID = str(uuid4())
        self.userID = str(uuid4())

    def services(self):
        self.mongo = MongoDB().client
        self.qdrant = QdrantDB().client
        self.ws = WebsocketService(self.sessionID)

    def config(self):
        self.temperature = temperature
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.top_k = top_k
        self.max_token_limit = max_token_limit

    def storage(self):
        self. storage = DriverStorage().directories()
        
    # Instanciate
    #   Document preprocessing
    #   AI service (Ollama, ChatGPT)
    #   Business Logic
    #   Propmt
    # ✅   socket service
    #   Storage
    #       Database
    #       File storage
    #   uuid
    # ✅       session
    # ✅      user
    # ✅       company
    #   session timestamp
    #   Database Controllers
    # ✅       Mongo
    # ✅       Qdrant
    #       Others...

    def index(self):
        pass

    def store(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass

    def close(self):
        pass
