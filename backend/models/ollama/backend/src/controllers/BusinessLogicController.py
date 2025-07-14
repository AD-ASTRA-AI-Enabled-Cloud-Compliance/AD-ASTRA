# Controller that handles and implements AD Astra's core business logic
# Business offerings must be integrated in this controller by consuming services and drivers

from ..services.DriverOllama import DriverOllama
from ..services.ServiceOCR import ServiceOCR

from ..controllers.RulesController import RulesController
from ..controllers.DocumentController import DocumentController
from ..controllers.TerraformController import TerraformController


class BusinessLogicController:
    def __init__(self, session):
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
        # print(self.session.storage.output_folder)

    def full_pipeline(self, request):
        # this processes the document: upload, store file, ocr, chunk, embed, store rag,
        self.framework = request.form.get("framework")
        self.model = request.form.get("model")

        DOC = DocumentController(self.session, request)
        OCR = ServiceOCR(self.session)
        OLLAMA = DriverOllama(self.session, self.model)
        TF = TerraformController(self.session)
        # OLLAMA.healthCheck(
        # print(f"fom business ontroller {self.session.storage.upload_folder}"),
        DOC.store()
        # text = OCR.extract_text_from_path(DOC.filepath)
        # chunks = OCR.chunk_text(text, OLLAMA, request.form.get(
        #     "framework"), self.model)
        # print(f"Chunks: {len(chunks)}")

        # rules = RulesController(self.session, request).search_chunks_and_rules(
        #     OLLAMA, self.qdrant, self.framework)
        tf = TF.generate(OLLAMA, 'Generate a Terraform configuration for a VM in Azure. NO EXPLANATION NEEDED. ONLY THE CODE.')

        print(self.model)
        # print(rules)
        print(tf)
        # document.file
        pass

    def store(self):
        pass

    def update(self):
        pass

    def delete(self):
        pass
