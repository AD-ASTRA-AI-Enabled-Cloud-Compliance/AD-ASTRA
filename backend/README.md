```
# Document upload, text embeddings and DB storage
Front end
        |
  [Selects model]
  [PDF submission]
        ↓
Document Preprocessing
        |
      [output]
        ↓
RAG-LLM
    └── Model(n)
    |
    [Prompt embedding, DB query, output]

```
---
### Document Preprocessing Pipeline
This pipeline will:
- Receive file in request
- Text extraction via OCR
- Chunk creation
- Output: 
    - JSON
    - Sent to next pipeline (selected model)

```JSON
// Input[JSON]: network request
{
    "file": "file",
    "model": "model",
}
// Target: RAG-LLM(s)
// Output[JSON]
{
    "model": "model selected",
    "document": "document name",
    "chunks": "text chunk result",
}
```
---
### RAG-LLM Pipeline
**Document preprocessing** will:
- Request each or selected model embeddings
- Store embeddings in Vector DB
- Output: 
    - JSON
    - Insert to Vector DB

**User prompt** will:
- Prompt embedding
- Vector DB query
- Build prompt with:
    - Prompt embeddings
    - Context embeddings
    - Prompt constraint
    - Model temperature, ReAct
- Request response
- Output: 
    - JSON
    - Insert to Vector DB

```JSON
// Input[JSON]: preprocessing pipeline
{
    "model": "model selected",
    "document": "document name",
    "chunks": "text chunk result",
}
// Target: Vector DB
// Output[JSON]: 
{
    "uuid": "uuid",
    "model": "model selected",
    "document": "document name",
    "chunks": "text chunk result",
    "vectors": "model vectors",
    "timestamp": "Y-m-d H:s:s",
    "version": "Y-m-d H:s:s",
}
```
*Versioning: this is targeting later chunk sizing for fine-tuning*