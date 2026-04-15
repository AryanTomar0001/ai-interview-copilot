import pandas as pd
import pickle
import os

from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor

from app.utils.feature_engineering import extract_features


#  PATH SETUP

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # app/ml
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))  # backend
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "answers.csv")

#  LOAD DATA
df = pd.read_csv(DATA_PATH)

df = df[df["score"] != "score"]
df["score"] = pd.to_numeric(df["score"], errors="coerce")
df = df.dropna(subset=["score"])

#  FEATURE EXTRACTION
X = []
y = []

for _, row in df.iterrows():
    features = extract_features(row["answer"], row["expected_answer"])
    X.append(features)
    y.append(row["score"])

#  SCALING
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

#  MODEL TRAIN
model = GradientBoostingRegressor(n_estimators=150)
model.fit(X_scaled, y)

#  SAVE MODEL (IMPORTANT FIX)
model_path = os.path.join(BASE_DIR, "model.pkl")
scaler_path = os.path.join(BASE_DIR, "scaler.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

with open(scaler_path, "wb") as f:
    pickle.dump(scaler, f)

print(" Model saved at:", model_path)