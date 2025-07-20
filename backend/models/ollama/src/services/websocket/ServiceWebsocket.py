import os
from uuid import uuid4
import requests

# FRONTEND_URL = os.getenv("FRONTEND_URL")
# FRONTEND_PORT = os.getenv("FRONTEND_PORT")
# FRONTEND_WS = os.getenv("FRONTEND_WS")
# NEXTJS_API_URL = f"{FRONTEND_URL}:{FRONTEND_PORT}{FRONTEND_WS}"

class WebsocketService:
    def __init__(self, session):
        self.FRONTEND_URL = os.getenv("FRONTEND_URL")
        self.FRONTEND_PORT = os.getenv("FRONTEND_PORT")
        self.FRONTEND_WS = os.getenv("FRONTEND_WS")
        # self.NEXTJS_API_URL = (f"{FRONTEND_URL}:{FRONTEND_PORT}{FRONTEND_WS}").trim(' ')
        self.FRONTEND_WS_ENDPOINT = f"{self.FRONTEND_URL}:{self.FRONTEND_PORT}/api/ws"

        if isinstance(session, str):
            self.id = session
        else:
            self.id = session.sessionID
        # else:
        #     self.id = str(uuid4())
    
    def info(self):
        return {
            "id": str(self.id),
            "frontend_url": self.FRONTEND_URL,
            "frontend_port": self.FRONTEND_PORT,
            "frontend_ws": self.FRONTEND_WS,
            "nextjs_api_url": self.NEXTJS_API_URL,
            "FRONTEND_WS_ENDPOINT": self.FRONTEND_WS_ENDPOINT
        }
    
    def send_progress_update(
        self,
        id: str = None,
        session: str = None, 
        message: str = None, 
        doc_name: str = None, 
        progress: float = None, 
        current_page: int = None, 
        total_pages: int = None,
        tf: any = None
    ):
        """Send structured progress update to Next.js API."""
        if current_page is not None and total_pages is not None:
            if current_page > 0 and total_pages > 0:
                # Proceed with sending the progress update
                progress = round((current_page / total_pages) * 100, 1)
            else:
                progress = None

        data = {
            "id": self.id,
            "message": message,
            "doc_name": doc_name,
            "progress": progress if progress is not None else 0,
            "currentPage": current_page if current_page is not None else 0,
            "totalPages": total_pages if total_pages is not None else 0,
            "timestamp": None,  # The frontend can add the timestamp if needed
            "tf": tf  # The frontend can add the timestamp if needed
        }

        try:
            response = requests.post(self.FRONTEND_WS_ENDPOINT, json=data)
        except Exception as e:
            print(f"Failed to send progress update: {str(e)}")
            print(f"Error type: {type(e).__name__}")
