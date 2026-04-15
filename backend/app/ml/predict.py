import pickle
import os
from app.utils.feature_engineering import extract_features

#  PATH SETUP
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "model.pkl")
scaler_path = os.path.join(BASE_DIR, "scaler.pkl")

#  LOAD MODEL
with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)

#  PREDICT
def predict_score(answer: str, expected: str):
    features = extract_features(answer, expected)

    features_scaled = scaler.transform([features])
    ml_score = model.predict(features_scaled)[0]

    similarity = features[0]

    final_score = 0.7 * ml_score + 0.3 * (similarity * 100)

    return float(round(final_score, 2)), float(round(similarity, 3))