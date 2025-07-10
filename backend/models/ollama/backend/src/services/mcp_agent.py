import os
from dotenv import load_dotenv
from .gpt_service import call_ollama
from src.utils.vector_store import search_chunks_and_rules
from .web_search_service import search_tavily

load_dotenv()

GREETINGS = [
    "hi", "hello", "hey", "how are you",
    "what's up", "good morning", "good evening"
]

def enhance_web_search(query: str, max_retries: int = 2) -> list:
    """Enhanced web search with retries and query reformulation"""
    attempts = 0
    while attempts <= max_retries:
        try:
            results = search_tavily(query)
            if results and any(r.strip() for r in results):
                return results
            
            # Reformulate query if no results
            attempts += 1
            if attempts <= max_retries:
                reformulated = f"{query} -site:wikipedia.org -site:reddit.com"
                results = search_tavily(reformulated)
                if results and any(r.strip() for r in results):
                    return results
        except Exception as e:
            print(f"Web search error: {str(e)}")
        attempts += 1
    return []

def react_loop_with_mcp(query: str, doc_id: str = "", top_k: int = 3):
    steps = []
    
    # Greeting check
    if query.strip().lower() in GREETINGS:
        return {
            "answer": "👋 Hello! How can I help you today?",
            "matched_rules": [],
            "mode": "greeting"
        }

    context_text = ""
    source = ""
    results = []

    # Document search if doc_id provided
    if doc_id:
        steps.append("🧠 **Thought**: Query contains known framework keyword.")
        steps.append(f"🔍 **Action**: Searching database for relevant content in `{doc_id.upper()}`...")
        results = search_chunks_and_rules(query, doc_id, top_k=top_k)
        
        if results:
            context_text = "\n\n".join(
                f"DOCUMENT_EXCERPT_{i}:\n{r['content']}\n"
                for i, r in enumerate(results[:3], 1)
            )
            source = "database"
            steps.append("✅ **Observation**: Found relevant content in database.")

    # Enhanced web search fallback
    if not context_text:
        steps.append("🧐 **Thought**: No relevant document content. Trying enhanced web search...")
        
        web_results = enhance_web_search(query)
        
        if web_results:
            context_text = "\n\n".join(
                f"WEB_RESULT_{i}:\n{res.strip()}\n"
                for i, res in enumerate(web_results[:3], 1)
                if res.strip()
            )
            source = "tavily"
            steps.append("✅ **Observation**: Retrieved web search results:")
            for i, res in enumerate(web_results[:3], 1):
                if res.strip():
                    steps.append(f"🌐 **Web Result {i}**:\n{res.strip()}\n")
        else:
            steps.append("⚠️ **Observation**: Web search didn't return usable content.")
            context_text = f"QUESTION: {query}"  # Still pass the question as context
            source = "general_knowledge"

    # Generate response - Modified to ensure context is used
    system_prompt = """You are a helpful assistant. Answer the question using:
- The provided context if available
- Your general knowledge otherwise
Be specific and factual in your response."""

    user_prompt = f"""Question: {query}


Please provide a direct answer to the question. If using specific sources, mention them."""

    gpt_response = call_ollama(system_prompt, user_prompt, 'gemma:2b')
    
    # Remove the general knowledge tag as it's now implied
    steps.append(f"💡 **Answer**:\n{gpt_response.strip()}")
    
    return {
        "answer": "\n\n".join(steps),
        "matched_rules": results,
        "mode": source
    }