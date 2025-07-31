# This controller generates the initial configuration of each request to the service

from uuid import uuid4
import uuid



class GlobalRequestGenerate():
    def __init__(self, session_id=None):
        self.session(session_id)
        print(f"userID => {self.userID}")
        print(f"sessionID => {self.sessionID}")
        print(f"companyID => {self.companyID}")

    def session(self, session_id):
        self.sessionID = session_id or str(uuid.uuid4())
        self.companyID = str(uuid4())
        self.userID = str(uuid4())

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
