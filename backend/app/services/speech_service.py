# from faster_whisper import WhisperModel
# import tempfile
# import os

# model = WhisperModel("base", device="cpu", compute_type="int8")

# def speech_to_text(audio_bytes):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
#         temp_audio.write(audio_bytes)
#         temp_audio_path = temp_audio.name

#     segments, info = model.transcribe(temp_audio_path, beam_size=5)
    
#     transcript = " ".join([segment.text for segment in segments])

#     os.remove(temp_audio_path)

#     return transcript

import requests
import tempfile
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def speech_to_text(audio_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    url = "https://api.groq.com/openai/v1/audio/transcriptions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }

    files = {
        "file": ("audio.webm", open(temp_audio_path, "rb"), "audio/webm")
    }

    data = {
        "model": "whisper-large-v3",
        "language": "en",
        "temperature": 0
    }
    
    response = requests.post(url, headers=headers, files=files, data=data)

    os.remove(temp_audio_path)

    print("API Response:", response.json())  # 🔥 DEBUG

    return response.json().get("text", "No transcription found")