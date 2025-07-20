# services/web_search_service.py
import os
import requests

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

def search_tavily(query: str, num_results: int = 5):
    url = "https://api.tavily.com/search"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TAVILY_API_KEY}"
    }

    payload = {
        "query": query,
        "search_depth": "basic",
        "include_answer": False,
        "include_raw_content": False,
        "max_results": num_results
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            json_data = response.json()
            return [r.get("content", "") for r in json_data.get("results", [])]
        else:
            return [f"❌ Tavily API error: {response.status_code} - {response.text}"]
    except Exception as e:
        return [f"❌ Tavily request failed: {str(e)}"]
