import whisper
import tempfile
import os

model = whisper.load_model("base")

def speech_to_text(audio_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    result = model.transcribe(temp_audio_path)

    os.remove(temp_audio_path)  # cleanup

    return result["text"]