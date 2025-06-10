import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_with_openai(question, context):
    messages = [
        {"role": "system", "content": "You are Cric AI, an expert cricket assistant."},
        {"role": "user", "content": f"""User asked: {question}
Context:
{chr(10).join(context)}

Let's reason step-by-step in this format:
Thought:
Action:
Observation:
Thought:
Final Answer:"""}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-1106",
        messages=messages,
        temperature=0.2,
        max_tokens=800
    )

    return {"answer": response["choices"][0]["message"]["content"]}
