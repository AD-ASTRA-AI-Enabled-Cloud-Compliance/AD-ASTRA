# chat_service.py

# ✅ Replaced old flat imports with relative/local project imports
# from services.mcp_agent import react_loop_with_mcp
from .mcp_agent import react_loop_with_mcp
from src.utils.vector_store import get_available_doc_ids
import difflib

# Static framework detection list
FRAMEWORK_KEYWORDS = ["PCI", "HIPAA", "NIST", "GDPR"]

def is_framework_query(query: str):
    return next((fw for fw in FRAMEWORK_KEYWORDS if fw.lower() in query.lower()), None)

def handle_chat_query(query: str):
    matched_framework = is_framework_query(query)

    if matched_framework:
        available_ids = get_available_doc_ids()
        doc_id = None
        normalized_framework = matched_framework.lower()

        # Step 1: Try exact match
        for id_ in available_ids:
            if id_.lower() == normalized_framework:
                doc_id = id_
                break

        # Step 2: Try partial match
        if not doc_id:
            for id_ in available_ids:
                if normalized_framework in id_.lower():
                    doc_id = id_
                    break

        # Step 3: Fuzzy match fallback
        if not doc_id:
            lower_ids = [i.lower() for i in available_ids]
            matches = difflib.get_close_matches(normalized_framework, lower_ids, n=1, cutoff=0.4)
            if matches:
                matched_index = lower_ids.index(matches[0])
                doc_id = available_ids[matched_index]

        # ❗️FIX: Don’t return here — let agent handle full fallback flow
        response_obj = react_loop_with_mcp(query, doc_id=doc_id or "")
    else:
        # General chat fallback
        response_obj = react_loop_with_mcp(query)

    return {
        "answer": response_obj.get("answer", "No response"),
        "matched_rules": response_obj.get("matched_rules", []),
        "steps": response_obj.get("steps", []),
        "mode": response_obj.get("mode", "unknown")
    }

