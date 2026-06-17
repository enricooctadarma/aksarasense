import pickle

with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

print(encoder.classes_)