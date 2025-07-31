# Modified for enhancing management dashboard functionality
# Service class for fetching compliance rules statistics from Qdrant vector database
# Provides methods to get rule counts, framework lists, and database connectivity status
import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http.exceptions import UnexpectedResponse

load_dotenv()

class RulesService:
    def __init__(self):
        """Initialize Qdrant client for rules statistics"""
        qdrant_host = os.getenv("QDRANT_HOST", "localhost")
        qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))
        self.qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = "framework_rules"  # Adjusted to match actual Qdrant collection name
        
    def get_rules_statistics(self):
        """Get statistics about compliance rules in Qdrant"""
        try:
            # Check if collection exists
            collections = self.qdrant.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.collection_name not in collection_names:
                return {
                    "total_rules": 0,
                    "frameworks": [],
                    "frameworks_count": 0,
                    "models": [],
                    "models_count": 0,
                    "collection_exists": False
                }
            
            # Get collection info
            collection_info = self.qdrant.get_collection(self.collection_name)
            total_rules = collection_info.points_count
            
            # Get all points to analyze frameworks and models
            # Note: For large collections, you might want to implement pagination
            points = self.qdrant.scroll(
                collection_name=self.collection_name,
                limit=1000,  # Adjust as needed
                with_payload=True,
                with_vectors=False
            )
            
            frameworks = set()
            models = set()
            
            for point in points[0]:  # points[0] contains the list of points
                payload = point.payload or {}
                
                # Extract framework information
                if 'framework' in payload:
                    frameworks.add(payload['framework'])
                
                # Extract model information
                if 'model' in payload:
                    models.add(payload['model'])
                elif 'source_model' in payload:
                    models.add(payload['source_model'])
            
            return {
                "total_rules": total_rules,
                "frameworks": list(frameworks),
                "frameworks_count": len(frameworks),
                "models": list(models),
                "models_count": len(models),
                "collection_exists": True
            }
            
        except UnexpectedResponse as e:
            print(f"Qdrant error: {e}")
            return {
                "total_rules": 0,
                "frameworks": [],
                "frameworks_count": 0,
                "models": [],
                "models_count": 0,
                "collection_exists": False,
                "error": "Qdrant connection error"
            }
        except Exception as e:
            print(f"Error getting rules statistics: {e}")
            return {
                "total_rules": 0,
                "frameworks": [],
                "frameworks_count": 0,
                "models": [],
                "models_count": 0,
                "collection_exists": False,
                "error": str(e)
            }
    
    def get_frameworks_list(self):
        """Get list of all available frameworks"""
        try:
            if self.collection_name not in [col.name for col in self.qdrant.get_collections().collections]:
                return {"frameworks": [], "count": 0}
            
            points = self.qdrant.scroll(
                collection_name=self.collection_name,
                limit=1000,
                with_payload=True,
                with_vectors=False
            )
            
            frameworks = set()
            for point in points[0]:
                payload = point.payload or {}
                if 'framework' in payload:
                    frameworks.add(payload['framework'])
            
            return {
                "frameworks": list(frameworks),
                "count": len(frameworks)
            }
        except Exception as e:
            print(f"Error getting frameworks list: {e}")
            return {"frameworks": [], "count": 0, "error": str(e)}

# Create global instance
rules_service = RulesService()
# End Modified for enhancing management dashboard functionality
