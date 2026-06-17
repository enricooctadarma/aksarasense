from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

MAX_LEN = 50

model = load_model("bilstm_error_model.h5")

with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)


@app.route("/")
def home():
    return "API Running"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "error": "text is required"
        }), 400

    text = data["text"]

    seq = tokenizer.texts_to_sequences([text])
    seq = pad_sequences(seq, maxlen=MAX_LEN, padding="post")

    pred = model.predict(seq)

    idx = np.argmax(pred)
    label = encoder.inverse_transform([idx])[0]
    confidence = float(np.max(pred))

    # STATUS
    status = "SALAH" if label != "Correct" else "BENAR"

    return jsonify({
        "text": text,
        "status": status,
        "error_type": label,
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(debug=True)