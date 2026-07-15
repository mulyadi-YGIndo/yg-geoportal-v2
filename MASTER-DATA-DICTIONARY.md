# Master Data Dictionary WebGIS Yayasan Gambut

## 1. Prinsip

1. Setiap objek memiliki identitas, lokasi, program, donor, periode, dan status.
2. Indikator teknis mengikuti jenis objek. Rumah bibit tidak memakai `Jumlah_Tanam`; penanaman tidak memakai `Kapasitas_Bibit`.
3. Output berasal dari pelaksanaan, outcome berasal dari monitoring, dan impact merupakan hasil analisis/metodologi.
4. Data target dan aktual disimpan terpisah.
5. Angka karbon tidak boleh dihitung dari jumlah bibit saja.
6. Satu capaian hanya dihitung satu kali melalui `Object_ID` dan periode pelaporan.

## 2. Field umum semua objek

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| Object_ID | teks unik | Ya | ID permanen, tidak berubah saat nama objek diperbarui |
| Nama_Objek | teks | Ya | Nama kegiatan/infrastruktur/lokasi |
| Layer_ID | enum | Ya | Jenis objek teknis |
| Status_Objek | enum | Ya | Aktif, selesai, nonaktif, rusak, rencana |
| Desa | teks | Ya | Desa lokasi |
| Kecamatan | teks | Tidak | Kecamatan |
| Kabupaten | teks | Ya | Kabupaten/kota |
| Provinsi | teks | Ya | Provinsi |
| Donor | teks terstandar | Ya | Penyandang dana utama |
| Program | teks terstandar | Ya | Nama program/proyek |
| Mitra_Pelaksana | daftar | Tidak | Mitra implementasi |
| Fase | teks | Tidak | Fase/tahap program |
| Tanggal_Mulai | tanggal | Ya | Mulai kegiatan |
| Tanggal_Selesai | tanggal | Tidak | Selesai kegiatan |
| Tahun | angka | Ya | Tahun agregasi utama |
| Sumber_Data | teks/URL | Ya | Laporan, kontrak, monitoring, atau dokumen lain |
| Verification_Status | enum | Ya | draft, diverifikasi_internal, diverifikasi_mitra, diaudit |

## 3. Field khusus

### Penanaman mangrove
`Jumlah_Tanam`, `Luas_Tanam_Ha`, `Spesies`, `Jarak_Tanam_M`, `Tanggal_Tanam`.
Monitoring: `Jumlah_Hidup`, `Jumlah_Mati`, `Survival_Persen`, `Tinggi_Rata_CM`, `Diameter_Rata_CM`, `Sedimentasi_CM`.

### Rumah bibit mangrove
`Kapasitas_Bibit`, `Jumlah_Bibit_Tersedia`, `Panjang_M`, `Lebar_M`, `Luas_M2`, `Spesies`, `Pengelola`, `Siklus_Produksi`.
Monitoring: `Bibit_Sehat`, `Bibit_Rusak`, `Bibit_Keluar`, `Jumlah_Bibit_Tersedia`.

### APO
`Panjang_M`, `Material`, `Tanggal_Selesai`.
Monitoring: `Kondisi_Struktur`, `Kerusakan_Persen`, `Sedimentasi_CM`.

### Sekat kanal
`Jumlah_Unit`, `Jenis_Sekat`, `Panjang_M`, `Luas_Pengaruh_Ha`.
Monitoring: `Tinggi_Muka_Air_CM`, `Kondisi_Struktur`, `Luas_Terbasahi_Ha`.

### FDRS
`Jumlah_Unit`, `Jenis_Alat`, `Tanggal_Pasang`.
Monitoring: `Status_Alat`, `Kategori_Bahaya`, `Tinggi_Muka_Air_CM`.

### Agroforestri/kopi
`Jumlah_Tanam`, `Luas_Tanam_Ha`, `Jumlah_Petani`, `Spesies`.
Monitoring: `Jumlah_Hidup`, `Survival_Persen`, `Produktif_Pohon`, `Produksi_KG`.

### Pelatihan
`Jumlah_Peserta`, `Peserta_Perempuan`, `Peserta_Laki_Laki`, `Peserta_Pemuda`, `Topik_Pelatihan`.
Outcome: `Peserta_Menerapkan`, `Usaha_Baru`, `Pendapatan_Tambahan_IDR`.

## 4. SDGs otomatis

SDGs awal ditetapkan dari jenis objek. Aturan tambahan memakai bukti aktual:
- SDG 5 hanya muncul bila ada data perempuan atau kegiatan khusus kesetaraan gender.
- SDG 8 muncul bila terdapat penerima manfaat ekonomi, petani, usaha, produksi, atau pendapatan.
- SDG 13 untuk restorasi, adaptasi, pencegahan kebakaran, dan intervensi iklim.
- SDG 14 untuk ekosistem pesisir/mangrove.
- SDG 15 untuk gambut, hutan, biodiversitas, dan restorasi daratan.

Pengguna harus dapat meninjau hasil klasifikasi dan melihat alasan setiap SDG.

## 5. Karbon

Field minimum: `Carbon_Method`, `Carbon_Baseline_Year`, `Carbon_Boundary`, `Carbon_Data_Source`, `Carbon_Status`, `Uncertainty_Persen`.

Status yang diperbolehkan:
- `belum_dihitung`
- `estimasi_awal`
- `terverifikasi_internal`
- `terverifikasi_pihak_ketiga`

Metrik karbon disimpan terpisah: `Carbon_Stock_tCO2e`, `Carbon_Sequestration_tCO2e`, dan `Emission_Avoided_tCO2e`.
