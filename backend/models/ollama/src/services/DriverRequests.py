import os
from services.websocket.ServiceWebsocket import WebsocketService


class DriverRequests():
    def __init__(self, sessionID):
        self.session = sessionID
        self.ws = WebsocketService()
        
    def processRequest(self, request):
        if not request.form.get("model"):
            self.ws.send_progress_update(
                message="No model selected"
            )
            return {"error": "No model selected"}, 400
        
        if not request.form.get("framework"):
            self.ws.send_progress_update(
                message="No framework selected"
            )
            return {"error": "No framework selected"}, 400
        
        if not request.files.get("file"):
            self.ws.send_progress_update(
                message="No  file uploaded"
            )
            return {"error": "No file uploaded"}, 400
        
        self.ws.send_progress_update(
            session=self.session,
            message="📥 Upload received"
        )

    def processDatabase(self):
        pass
