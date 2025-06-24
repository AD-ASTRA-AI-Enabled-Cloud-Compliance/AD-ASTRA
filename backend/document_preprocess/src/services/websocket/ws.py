import os
import requests


FRONTEND_URL = os.getenv("FRONTEND_URL")
FRONTEND_PORT = os.getenv("FRONTEND_PORT")
FRONTEND_WS = os.getenv("FRONTEND_WS")

# NEXTJS_API_URL = 'http://localhost:3000/api/ws' 
NEXTJS_API_URL = (f"{FRONTEND_URL}:{FRONTEND_PORT}{FRONTEND_WS}").strip(' ')

def send_progress_update(
    message: str, 
    progress: float = None, 
    current_page: int = None, 
    total_pages: int = None
):
    """Send structured progress update to Next.js API."""
    data = {
        "message": message,
        "progress": progress if progress is not None else 0,
        "currentPage": current_page if current_page is not None else 0,
        "totalPages": total_pages if total_pages is not None else 0,
        "timestamp": None  # The frontend can add the timestamp if needed
    }

    try:
        print(f"Sending progress update to {NEXTJS_API_URL}: {data}")
        response = requests.post(NEXTJS_API_URL, json=data)
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
    except Exception as e:
        print(f"Failed to send progress update: {str(e)}")
        print(f"Error type: {type(e).__name__}")
