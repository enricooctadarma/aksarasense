# AksaraSense – Sistem Deteksi Kesalahan Ejaan Bahasa Indonesia Menggunakan BiLSTM

## 📌 Deskripsi Singkat Proyek

AksaraSense adalah aplikasi berbasis Artificial Intelligence (AI) yang dirancang untuk mendeteksi kesalahan ejaan dalam kalimat Bahasa Indonesia secara otomatis. Sistem ini memanfaatkan model Deep Learning Bidirectional Long Short-Term Memory (BiLSTM) untuk menganalisis teks yang diberikan pengguna, kemudian menentukan apakah kalimat tersebut benar atau mengandung kesalahan ejaan. Selain itu, sistem juga mampu mengklasifikasikan jenis kesalahan yang ditemukan dan menampilkan tingkat keyakinan (confidence score) dari hasil prediksi.

Proyek ini dikembangkan sebagai solusi untuk membantu proses pemeriksaan ejaan Bahasa Indonesia yang lebih cepat, efisien, dan otomatis dibandingkan pengecekan manual.

---

# 🎯 Tujuan Proyek

* Mendeteksi kesalahan ejaan Bahasa Indonesia secara otomatis.
* Mengklasifikasikan jenis kesalahan yang ditemukan.
* Menampilkan confidence score dari hasil prediksi model.
* Menyediakan aplikasi berbasis web yang mudah digunakan.
* Mengimplementasikan model Deep Learning BiLSTM ke lingkungan produksi.

---

# ❗ Permasalahan yang Diselesaikan

Kesalahan ejaan Bahasa Indonesia sering ditemukan dalam berbagai bentuk penulisan, seperti:

### Kesalahan Spasi

Contoh:

* Saya pergi kerumah.
* Seharusnya: Saya pergi ke rumah.

### Kesalahan Typo

Contoh:

* Saya pigi ke sekolah.
* Seharusnya: Saya pergi ke sekolah.

### Kesalahan Huruf

Contoh:

* Sya pergi ke sekolah.
* Seharusnya: Saya pergi ke sekolah.

### Kesalahan Kapitalisasi

Contoh:

* indonesia adalah negara besar.
* Seharusnya: Indonesia adalah negara besar.

### Kesalahan Tanda Baca

Contoh:

* Apa kabar kamu
* Seharusnya: Apa kabar kamu?

Melakukan pengecekan secara manual membutuhkan waktu yang cukup lama, terutama jika jumlah data sangat banyak. Oleh karena itu, AksaraSense hadir sebagai solusi berbasis AI yang mampu melakukan proses deteksi secara otomatis.

---

# 📊 Dataset

Dataset yang digunakan terdiri dari dua kategori utama:

## 1. Kalimat Benar

Contoh:

* Saya pergi ke rumah.
* Dia sedang belajar.
* Kami makan bersama.

Label:

```text
correct
```

## 2. Kalimat Salah

Contoh:

* Saya pergi kerumah → spasi
* Dia sedang blajar → typo
* Sya pergi ke sekolah → huruf
* indonesia negara besar → kapitalisasi
* Apa kabar kamu → tanda_baca

Label yang digunakan:

```text
correct
spasi
typo
huruf
kapitalisasi
tanda_baca
```

---

# ⚙️ Tahapan Pengolahan Data

## 1. Pengumpulan Data

Data kalimat Bahasa Indonesia dikumpulkan dan diberi label sesuai kategori kesalahan ejaan yang ditentukan.

Output:

```text
Raw Dataset
```

## 2. Data Preprocessing

Tahap preprocessing dilakukan untuk membersihkan dan menyiapkan data sebelum digunakan pada proses training.

### Tokenization

Kalimat diubah menjadi representasi numerik.

Contoh:

```text
Saya pergi ke rumah
↓
[5, 23, 8, 14]
```

### Padding

Semua panjang input diseragamkan menggunakan padding.

Contoh:

```text
[5, 23, 8, 14]
↓
[5, 23, 8, 14, 0, 0, 0, ...]
```

Parameter:

```python
MAX_LEN = 50
```

---

# 🧠 Arsitektur Model

Model yang digunakan adalah Bidirectional Long Short-Term Memory (BiLSTM).

Alur Model:

```text
Input
↓
Embedding Layer
↓
Bidirectional LSTM
↓
Dropout
↓
Dense Layer
↓
Output Layer
```

## Embedding Layer

```python
Embedding(input_dim=30000, output_dim=128)
```

Mengubah kata menjadi representasi vektor numerik sehingga model dapat memahami hubungan antar kata.

## Bidirectional LSTM

```python
Bidirectional(LSTM(128))
```

Model membaca urutan kata dari dua arah:

* Kiri ke kanan
* Kanan ke kiri

Keunggulan:

* Memahami konteks kalimat secara lebih lengkap.
* Cocok untuk analisis teks dan Natural Language Processing (NLP).

## Dropout Layer

```python
Dropout(0.3)
```

Digunakan untuk mengurangi risiko overfitting selama proses training.

## Dense Layer

```python
Dense(64, activation='relu')
```

Digunakan untuk mengekstraksi fitur yang telah dipelajari oleh BiLSTM.

## Output Layer

```python
Dense(6, activation='softmax')
```

Kelas output:

* correct
* spasi
* typo
* huruf
* kapitalisasi
* tanda_baca

---

# 🏋️ Training Model

Konfigurasi training:

```text
Train Split : 80%
Test Split  : 20%
Epoch       : 3
Optimizer   : Adam
Loss        : categorical_crossentropy
```

Hasil Evaluasi:

```text
Accuracy : 83%
```

---

# 💾 Model AI

File model yang digunakan:

```text
bilstm_error_model.h5
tokenizer.pkl
label_encoder.pkl
```
---

# 🔥 Backend API

Backend dikembangkan menggunakan Flask dan TensorFlow.

Endpoint:

```http
POST /predict
```

Contoh Request:

```json
{
  "text": "Saya pergi kerumah"
}
```

Proses Backend:

1. Menerima input teks.
2. Melakukan tokenisasi.
3. Melakukan padding.
4. Menjalankan prediksi model BiLSTM.
5. Mengembalikan hasil dalam format JSON.

Contoh Response:

```json
{
  "status": "SALAH",
  "error_type": "spasi",
  "confidence": 0.9642
}
```

---

# 🌐 Frontend

Frontend dibangun menggunakan React dan Vite.

Fitur utama:

* Input kalimat Bahasa Indonesia.
* Analisis kesalahan ejaan secara real-time.
* Menampilkan status BENAR atau SALAH.
* Menampilkan jenis kesalahan.
* Menampilkan confidence score.
* Menampilkan riwayat analisis menggunakan Local Storage.
* Dark Mode dan Light Mode.

---

# 🚀 Cara Menjalankan Aplikasi

## Menjalankan Frontend

### Clone Repository

```bash
git clone https://github.com/enricooctadarma/aksarasense.git
```

```bash
cd aksarasense
```

### Install Dependency

```bash
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan pada:

```text
http://localhost:5173
```

---

## Menjalankan Backend

### Install Dependency

```bash
pip install -r requirements.txt
```

### Jalankan Flask

```bash
python app.py
```

Backend akan berjalan pada:

```text
http://localhost:5000
```

---

# ☁️ Deployment

Link Download Model:

https://drive.google.com/drive/folders/1BN5JqolhFwUr6S4htooLoiSCMI_omb7r?usp=drive_link

## Frontend (Vercel)

https://aksarasense.vercel.app/

## Backend (Hugging Face Spaces)

https://huggingface.co/spaces/enricooctadarma/aksarasense-backend

# 🔗 Tautan Penting Proyek

### Website Aplikasi

https://aksarasense.vercel.app/

### Repository GitHub

https://github.com/enricooctadarma/aksarasense

### Hugging Face Spaces

https://huggingface.co/spaces/enricooctadarma/aksarasense-backend

### Model AI

https://drive.google.com/drive/folders/1BN5JqolhFwUr6S4htooLoiSCMI_omb7r?usp=drive_link

### Google Colab Training


### Video Presentasi

https://www.youtube.com/watch?v=Iw7eave8eRo

### Panduan Produk

https://drive.google.com/file/d/1CkA3JFOgblNfmEnRqwM8b4bc6GE0N8LY/view?usp=drive_link

### Slide Presentasi

https://drive.google.com/file/d/10-OmWE5x_u6PahtyT3IvMguPnrpIaQ3e/view?usp=drive_link

---

# 🔄 Alur Sistem

```text
User
↓
Frontend React + Vite
↓
Axios Request
↓
Flask API
↓
Tokenizer
↓
Padding
↓
BiLSTM Model
↓
Prediksi
↓
JSON Response
↓
Frontend
↓
Hasil Analisis
```

---

# ✨ Keunggulan Sistem

* Berbasis Deep Learning (BiLSTM).
* Dapat mendeteksi beberapa kategori kesalahan ejaan.
* Prediksi dilakukan secara real-time.
* Mudah diakses melalui browser.
* Dapat dikembangkan untuk fitur koreksi otomatis.
* Sudah terintegrasi ke lingkungan deployment.

---

# 🔮 Pengembangan Selanjutnya

* Auto Correction.
* Saran perbaikan kalimat.
* Deteksi typo yang lebih kompleks.
* Dukungan dokumen panjang.
* Integrasi dengan aplikasi pengolah kata.
* Peningkatan akurasi model menggunakan dataset yang lebih besar.

---

# 🧾 Kesimpulan

AksaraSense merupakan sistem deteksi kesalahan ejaan Bahasa Indonesia berbasis Artificial Intelligence yang memanfaatkan model Bidirectional Long Short-Term Memory (BiLSTM). Sistem mampu mengidentifikasi apakah suatu kalimat benar atau salah, mengklasifikasikan jenis kesalahan ejaan, serta memberikan confidence score terhadap hasil prediksi. Aplikasi ini terdiri dari frontend React + Vite dan backend Flask yang telah berhasil di-deploy menggunakan Vercel dan Hugging Face Spaces sehingga dapat diakses secara online oleh pengguna.
