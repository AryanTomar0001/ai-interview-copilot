import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_PATH = os.path.join(BASE_DIR, "data", "answers.csv")

df = pd.read_csv(DATA_PATH)

# create mapping
QUESTION_DB = {}

for _, row in df.iterrows():
    q = row["question"]
    exp = row["expected_answer"]

    # ek question ka ek hi expected answer rakhenge
    if q not in QUESTION_DB:
        QUESTION_DB[q] = exp