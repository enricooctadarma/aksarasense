from tensorflow.keras.models import load_model

model = load_model("bilstm_error_model.h5")

model.summary()