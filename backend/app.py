import gradio as gr
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

MAX_LEN = 50

# LOAD MODEL
model = load_model("bilstm_error_model.h5")

with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)


def predict_text(text):
    seq = tokenizer.texts_to_sequences([text])
    seq = pad_sequences(seq, maxlen=MAX_LEN, padding="post")

    pred = model.predict(seq)
    idx = np.argmax(pred)

    label = encoder.inverse_transform([idx])[0]
    confidence = float(np.max(pred))

    status = "SALAH" if label != "Correct" else "BENAR"

    return {
        "text": text,
        "status": status,
        "error_type": label,
        "confidence": confidence
    }


demo = gr.Interface(
    fn=predict_text,
    inputs=gr.Textbox(label="Masukkan Kalimat"),
    outputs="json",
    title="AksaraSense - BiLSTM Error Detection"
)

demo.launch()