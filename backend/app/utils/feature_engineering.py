from sklearn.metrics.pairwise import cosine_similarity
from app.rag.embeddings import get_embedding
from app.utils.text_cleaner import clean_text


def extract_features(answer: str, expected: str):
    clean_ans = clean_text(answer)
    clean_ref = clean_text(expected)

    ans_emb = get_embedding(clean_ans)
    ref_emb = get_embedding(clean_ref)

    # 🔥 Semantic similarity
    similarity = cosine_similarity([ans_emb], [ref_emb])[0][0]

    # 🔥 Keyword match (improved)
    ref_words = set(clean_ref.split())
    ans_words = set(clean_ans.split())

    if len(ref_words) == 0:
        keyword_score = 0
    else:
        keyword_score = len(ref_words & ans_words) / len(ref_words)

    # 🔥 Length ratio (better than raw length)
    ref_len = len(clean_ref.split())
    ans_len = len(clean_ans.split())

    if ref_len == 0:
        length_ratio = 0
    else:
        length_ratio = min(ans_len / ref_len, 1.5)

    # 🔥 Vocabulary richness
    vocab_richness = len(ans_words) / (ans_len + 1)

    # 🔥 Length difference penalty
    length_diff = abs(ans_len - ref_len)

    return [
        similarity,
        keyword_score,
        length_ratio,
        vocab_richness,
        length_diff
    ]