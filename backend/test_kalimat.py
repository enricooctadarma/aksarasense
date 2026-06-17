import pickle
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

MAX_LEN = 50

print("Loading model...")
model = load_model("bilstm_error_model.h5")
print("Model berhasil dimuat!")

# Load tokenizer
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

print("\n=== INFO TOKENIZER ===")
print("Jumlah vocab:", len(tokenizer.word_index))
print("OOV token:", tokenizer.oov_token)

# Load label encoder
with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

print("\n=== DAFTAR LABEL ===")
for i, label in enumerate(encoder.classes_):
    print(f"{i} -> {label}")

while True:
    teks = input("\nMasukkan kalimat (ketik 'exit' untuk keluar): ")

    if teks.lower() == "exit":
        break

    # Tokenisasi
    seq = tokenizer.texts_to_sequences([teks])

    print("\n=== HASIL TOKENISASI ===")
    print("Kalimat :", teks)
    print("Sequence:", seq)

    # Padding
    pad = pad_sequences(
        seq,
        maxlen=MAX_LEN,
        padding="post",
        truncating="post"
    )

    # Prediksi
    pred = model.predict(pad, verbose=0)

    idx = np.argmax(pred)
    label = encoder.inverse_transform([idx])[0]

    status = "Benar" if label == "correct" else "Salah"

    print("\n=== HASIL PREDIKSI ===")
    print("Status :", status)
    print("Label  :", label)

    print("\n=== PROBABILITAS ===")
    for i, cls in enumerate(encoder.classes_):
        print(f"{cls:<20} {pred[0][i]:.4f}")