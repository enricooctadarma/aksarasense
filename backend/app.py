from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask_cors import CORS
import numpy as np
import pickle
import os

app = Flask(__name__)

# 🔥 FIX CORS (penting untuk Vercel)
CORS(app, resources={r"/*": {"origins": "*"}})

MAX_LEN = 50

model = load_model("bilstm_error_model.h5")

with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

@app.route("/")
def home():
    return jsonify({"message": "API Running"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "text is required"}), 400

    text = data["text"]

    seq = tokenizer.texts_to_sequences([text])
    seq = pad_sequences(seq, maxlen=MAX_LEN, padding="post")

    pred = model.predict(seq, verbose=0)[0]

    idx = int(np.argmax(pred))
    confidence = float(np.max(pred))

    classes = [
        "Deletion Error",
        "Insertion Error",
        "Punctuation Error",
        "Real word Error",
        "Substitution Error",
        "Transposition Error",
        "Correct"
    ]

    label = classes[idx]
    status = "Benar" if label == "Correct" else "Salah"

    probabilities = {classes[i]: float(pred[i]) for i in range(len(classes))}

    return jsonify({
        "text": text,
        "error_type": label,
        "status": status,
        "confidence": confidence,
        "probabilities": probabilities,
    })

# 🔥 IMPORTANT UNTUK DEPLOY (HuggingFace / Render / Railway)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)