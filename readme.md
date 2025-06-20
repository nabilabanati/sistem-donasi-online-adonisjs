# NIM Berakhir 6

## Sistem Donasi Online

### Tabel:

donasi(id, donatur_id, kategori_id, jumlah, tanggal)

donatur(id, nama, email, telepon)

kategori(id, nama_kategori)

kampanye(id, nama_kampanye, kategori_id, target)

transaksi_donasi(id, donasi_id, kampanye_id, status)

### Relasi:

- donasi → belongsTo donatur, kategori
- kampanye → belongsTo kategori
- transaksi_donasi → belongsTo donasi, kampanye

### Instruksi:

- Buat fitur CRUD untuk kampanye, kategori, dan donasi.
- Buat halaman donatur untuk melihat histori donasinya.
- Tampilkan progres donasi per kampanye (jumlah terkumpul vs target).
- Validasi agar donasi tidak melebihi target kampanye.