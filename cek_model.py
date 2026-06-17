from tensorflow.keras.models import load_model

print("Loading model...")

model = load_model("bilstm_error_model.h5")

print("Model berhasil dimuat!")

print("\nOutput Shape:")
print(model.output_shape)