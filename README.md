# AksaraSense – Sistem Deteksi Kesalahan Ejaan Bahasa Indonesia Menggunakan BiLSTM

## 📌 Gambaran Umum Proyek

AksaraSense adalah aplikasi berbasis Artificial Intelligence yang digunakan untuk mendeteksi kesalahan ejaan dalam kalimat Bahasa Indonesia. Sistem ini menggunakan model Deep Learning **Bidirectional Long Short-Term Memory (BiLSTM)** untuk menganalisis teks dan menentukan apakah kalimat benar atau mengandung kesalahan, sekaligus mengklasifikasikan jenis kesalahannya.

### 🎯 Tujuan Sistem
- Menganalisis kalimat Bahasa Indonesia
- Menentukan apakah kalimat benar atau salah
- Mengklasifikasikan jenis kesalahan ejaan
- Menampilkan tingkat keyakinan (confidence score)

### 🧪 Contoh Input & Output

**Input:**
Saya pergi kerumah

**Output:**
Status      : SALAH  
Jenis Error : Spasi  
Confidence  : 96.5%

---

## ❗ Permasalahan

Kesalahan ejaan Bahasa Indonesia sering terjadi dalam penulisan sehari-hari, seperti:
- Kesalahan Spasi: kerumah → ke rumah  
- Kesalahan Typo: pigi → pergi  
- Kesalahan Tanda Baca: Apa kabar kamu → Apa kabar kamu?

Pengecekan manual tidak efisien untuk jumlah data yang besar, sehingga dibutuhkan sistem otomatis berbasis AI.

---

## 📊 Dataset

Dataset terdiri dari:

### 1. Kalimat Benar
- Saya pergi ke rumah.
- Dia sedang belajar.
- Kami makan bersama.

Label: `correct`

### 2. Kalimat Salah
- Saya pergi kerumah → spasi
- Dia sedang blajar → typo
- Kami makan bersama → tanda_baca

Label: `spasi`, `typo`, `huruf`, `kapitalisasi`, `tanda_baca`

---

## ⚙️ Data Preprocessing

### 🔤 Tokenization
Kalimat diubah menjadi angka:

Saya pergi ke rumah → [5, 23, 8, 14]

Mapping:
Saya = 5  
pergi = 23  
ke = 8  
rumah = 14  

### 📏 Padding
Semua input diseragamkan:

MAX_LEN = 50  

Contoh:
[5,23,8,14] → [5,23,8,14,0,0,0,...]

---

## 🧠 Arsitektur Model (BiLSTM)

### Struktur Model
Input → Embedding → BiLSTM → Dropout → Dense → Output

### Embedding Layer
Embedding(input_dim=30000, output_dim=128)

Mengubah kata menjadi representasi vektor agar model memahami konteks.

### Bidirectional LSTM
BiLSTM membaca kalimat dari dua arah:
- kiri → kanan
- kanan → kiri  

BiLSTM(LSTM(128))

Keunggulan: memahami konteks kalimat lebih lengkap.

### Dropout
Dropout(0.3)  
Mengurangi overfitting dengan mematikan sebagian neuron saat training.

### Dense Layer
Dense(64, activation="relu")  
Mengekstrak fitur lanjutan dari hasil BiLSTM.

### Output Layer
Dense(6, activation="softmax")

Kelas:
- correct  
- spasi  
- typo  
- huruf  
- kapitalisasi  
- tanda_baca  

---

## 🏋️ Training Model

- Split data: 80% training / 20% testing  
- Epoch: 3  
- Optimizer: Adam  
- Loss function: categorical_crossentropy  

### 📈 Hasil Training
- Akurasi: **83%**

---

## 💾 Penyimpanan Model

Model disimpan sebagai:
- bilstm_error_model.h5  
- tokenizer.pkl  
- label_encoder.pkl  

---

## 🔥 Backend (Flask API)

Endpoint:
POST /predict

Request:
{
  "text": "Saya pergi kerumah"
}

Proses:
1. Terima input teks
2. Tokenisasi
3. Padding
4. Prediksi model
5. Return hasil

Response:
{
  "status": "SALAH",
  "error_type": "spasi",
  "confidence": 0.9642
}

---

## 🌐 Frontend (React + Vite)

Fitur:
- Input kalimat
- Tombol analisis
- Menampilkan hasil prediksi
- History (localStorage)

Output:
- Status (Benar/Salah)
- Jenis error
- Confidence score
- Riwayat analisis

---

## 🚀 Deployment

### Backend
Hugging Face Spaces  
https://enricooctadarma-aksarasense-backend.hf.space

Stack:
Docker, Flask, TensorFlow, Gunicorn

### Frontend
Vercel  
React + Vite

---

## 🔄 Alur Sistem

User → Frontend React → Axios → Flask API → Tokenizer → Padding → BiLSTM Model → Prediksi → JSON Response → Frontend → Output

---

## ✨ Kelebihan Sistem

- Otomatis (tanpa koreksi manual)
- Cepat (real-time prediction)
- Deep Learning (BiLSTM)
- Web-based (akses browser)
- Mudah dikembangkan

---

## 🔮 Pengembangan Selanjutnya

- Auto-correction
- Highlight kata salah
- Saran perbaikan kalimat
- Deteksi typo lebih detail

---

## 🧾 Kesimpulan

AksaraSense adalah sistem berbasis AI untuk mendeteksi kesalahan ejaan Bahasa Indonesia menggunakan model BiLSTM. Model dilatih dengan epoch 3 dan mencapai akurasi 83%. Sistem ini terdiri dari backend Flask dan frontend React, serta telah di-deploy secara online menggunakan Hugging Face Spaces dan Vercel.
