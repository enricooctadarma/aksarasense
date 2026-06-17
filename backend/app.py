from flask import Flask, request, jsonify
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf

app = Flask(__name__)

MAX_LEN = 50

# LOAD MODEL

model = tf.keras.models.load_model(
    "bilstm_error_model.h5",
    compile=False
)

with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    text = data["text"]

    seq = tokenizer.texts_to_sequences([text])
    seq = pad_sequences(seq, maxlen=MAX_LEN, padding="post")

    pred = model.predict(seq)
    idx = np.argmax(pred)

    label = encoder.inverse_transform([idx])[0]
    confidence = float(np.max(pred))

    status = "SALAH" if label != "Correct" else "BENAR"

    return jsonify({
        "text": text,
        "status": status,
        "error_type": label,
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)