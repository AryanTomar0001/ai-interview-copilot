import os
import json
from typing import Dict, Any
import re
from groq import Groq

from dotenv import load_dotenv
load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("GROQ_API_KEY not set in environment")

        self.client = Groq(api_key=api_key)

        # 🔥 Best model (fast + free)
        self.model="llama-3.1-8b-instant"

    # 🔥 Common LLM call (reusable)
    def _call_llm(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.6
        )

        return response.choices[0].message.content.strip()


    def _safe_json_load(self, text: str) -> Dict[str, Any]:
        try:
            cleaned = text.strip()

            # 🔥 remove markdown
            cleaned = re.sub(r"```json|```", "", cleaned).strip()

            # 🔥 extract JSON block
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                cleaned = match.group()

            # 🔥 fix common issues
            cleaned = cleaned.replace('\n', ' ')
            cleaned = re.sub(r'"\s*"', '" "', cleaned)  # fix broken quotes

            return json.loads(cleaned)

        except Exception as e:
            return {
                "error": "Invalid JSON",
                "details": str(e),
                "raw_response": text
            }
    # ================================
    # 🔥 QUESTION GENERATION
    # ================================
    def generate_questions(self, context: str) -> Dict[str, Any]:
        system_prompt = """
Rules:
You are a senior Amazon interviewer.
IMPORTANT RULE:
- Generate questions ONLY from the resume content
- DO NOT add external or generic DSA questions
- If a concept is not mentioned, DO NOT ask about it
"""

        user_prompt = f"""
Resume:
{context}

Generate:
- 5 technical questions
- 3 HR questions
- 2 project questions

Each question MUST include:
- question
- difficulty (Easy/Medium/Hard)
- topic
- expected_answer

Format:
{{
  "technical": [
    {{
      "question": "",
      "difficulty": "",
      "topic": "",
      "expected_answer": ""
    }}
  ],
  "hr": [],
  "project": []
}}
"""

        try:
            raw = self._call_llm(system_prompt, user_prompt)
            return self._safe_json_load(raw)

        except Exception as e:
            return {"error": str(e)}

        # =========================
    # 🔥 FEEDBACK GENERATION (ADVANCED)
    # =========================
    def generate_feedback(
        self,
        question: str,
        answer: str,
        expected: str,
        score: float
    ) -> Dict[str, Any]:

        system_prompt = """
You are a strict technical interviewer.

Analyze answers deeply and give constructive feedback.
"""

        user_prompt = f"""
Question:
{question}

Candidate Answer:
{answer}

Expected Answer:
{expected}

Score: {score}

Provide:
1. Missing points
2. Improvements
3. Ideal answer

Return STRICT JSON only.
Do NOT include markdown.
Do NOT use unescaped quotes inside values.

Return JSON:
{{
  "missing": [],
  "improvements": [],
  "ideal_answer": ""
}}
"""

        try:
            raw = self._call_llm(system_prompt, user_prompt)
            return self._safe_json_load(raw)

        except Exception as e:
            return {"error": str(e)}


# Singleton instance
llm_service = LLMService()