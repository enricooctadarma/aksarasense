from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os

# =====================
# APP SETUP
# =====================
app = Flask(__name__)
CORS(app)

MAX_LEN = 50

# =====================
# GLOBAL CACHE (lazy load)
# =====================
model = None
tokenizer = None
encoder = None


# =====================
# LOAD ALL RESOURCES
# =====================
def load_all():
    global model, tokenizer, encoder

    # LOAD MODEL (FIX KERAS COMPATIBILITY ISSUE)
    if model is None:
        try:
            model = tf.keras.models.load_model(
                "bilstm_error_model.h5",
                compile=False,
                custom_objects={
                    "InputLayer": tf.keras.layers.InputLayer
                }
            )
        except Exception as e:
            print("MODEL LOAD ERROR:", str(e))
            raise e

    # LOAD TOKENIZER
    if tokenizer is None:
        with open("tokenizer.pkl", "rb") as f:
            tokenizer = pickle.load(f)

    # LOAD LABEL ENCODER
    if encoder is None:
        with open("label_encoder.pkl", "rb") as f:
            encoder = pickle.load(f)

    return model, tokenizer, encoder


# =====================
# PREDICT ROUTE
# =====================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        model, tokenizer, encoder = load_all()

        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({
                "error": "Field 'text' wajib diisi"
            }), 400

        text = data["text"]

        # =====================
        # PREPROCESSING
        # =====================
        seq = tokenizer.texts_to_sequences([text])
        seq = pad_sequences(seq, maxlen=MAX_LEN, padding="post")

        # =====================
        # PREDICTION
        # =====================
        pred = model.predict(seq, verbose=0)
        idx = int(np.argmax(pred))

        label = encoder.inverse_transform([idx])[0]
        confidence = float(np.max(pred))

        # FIX STATUS LOGIC
        status = "BENAR" if label.strip().lower() in ["correct", "benar"] else "SALAH"

        return jsonify({
            "text": text,
            "status": status,
            "error_type": label,
            "confidence": confidence
        })

    except Exception as e:
        print("PREDICT ERROR:", str(e))
        return jsonify({
            "error": str(e)
        }), 500


# =====================
# HEALTH CHECK
# =====================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "API BiLSTM Error Detection aktif"
    })


# =====================
# RUN (Hugging Face friendly)
# =====================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port)