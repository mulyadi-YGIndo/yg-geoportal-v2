window.YG_OBJECT_SCHEMA = {
  version: "3.0",
  api: "https://script.google.com/macros/s/AKfycbxeGTDZXkR0DyLZmBHTq2M-52Iu4dTTGpH164S7sYHg8qPzvffobC6-r-TBLVHMT3HU-A/exec",
  layers: [
    { id: "apo", label: "Alat Pemecah Ombak (APO)", category: "APO", prefix: "APO", include: true, unit: "m", url: "data/apo.geojson" },
    { id: "area_mangrove", label: "Area Penanaman Mangrove", category: "Penanaman Mangrove", prefix: "MANGROVE", include: true, unit: "ha", url: "data/area_mangrove.geojson" },
    { id: "fdrs", label: "FDRS / Water Table", category: "FDRS", prefix: "FDRS", include: true, unit: "unit", url: "data/fdrs.geojson" },
    { id: "kopi", label: "Distribusi Lahan Kopi", category: "Agroforestri/Kopi", prefix: "KOPI", include: true, unit: "lokasi", url: "data/kopi.geojson" },
    { id: "nursery_mangrove", label: "Rumah Pembibitan Mangrove", category: "Pembibitan Mangrove", prefix: "NURSERY", include: true, unit: "unit", url: "data/nursery_mangrove.geojson" },
    { id: "sekat_kanal", label: "Sekat Kanal", category: "Sekat Kanal", prefix: "SEKAT", include: true, unit: "unit", url: "data/sekat_kanal.geojson" },
    { id: "desa_intervensi", label: "Batas Desa Intervensi", category: "Administrasi", prefix: "DESA", include: false, unit: "desa", url: "data/desa_intervensi.geojson" },
    { id: "titik_desa", label: "Titik Desa Intervensi", category: "Administrasi", prefix: "TITIKDESA", include: false, unit: "desa", url: "data/titik_desa.geojson" },
    { id: "kawasan_hutan_sk_903", label: "Kawasan Hutan SK 903", category: "Referensi Kawasan", prefix: "KH", include: false, unit: "polygon", url: "data/kawasan_hutan_sk_903.geojson" }
  ],
  aliases: {
    objectId: ["Object_ID", "objectId", "OBJECTID", "Id", "No"],
    objectName: ["Nama_Objek", "Nama", "nama", "title", "Desa", "NAMA_DESA", "NAMOBJ"],
    village: ["Desa", "desa", "NAMA_DESA", "NAMOBJ", "WADMKD"],
    district: ["Kecamatan", "kecamatan", "NAMA_KEC", "WADMKC"],
    regency: ["Kabupaten", "kabupaten", "NAMA_KAB", "WADMKK"],
    year: ["Tahun", "tahun", "Fase", "Phase"],
    donor: ["Donor", "Pendana", "Funding_Source", "Sumber_Dana", "Mitra_Donor"],
    program: ["Program", "Nama_Program", "Project", "Proyek"],
    areaHa: ["Luas_Tanam_Ha", "Luas_Ha", "luas_ha", "Area_Ha", "areaHa"],
    plantedCount: ["Jumlah_Tanam", "jumlah_tanam", "Bibit_Tanam", "plantedCount"],
    nurseryCapacity: ["Kapasitas_Bibit", "kapasitas_bibit"],
    nurseryAvailable: ["Jumlah_Bibit_Tersedia", "Jumlah_Bibit", "jumlah_bibit"],
    beneficiaries: ["Jumlah_Penerima_Manfaat", "Jumlah_Peserta", "Beneficiaries"],
    lengthM: ["Panjang_M", "panjang_m", "Length_M", "lengthM"]
  },
  metricProfiles: {
    area_mangrove: ["Jumlah_Tanam", "Luas_Tanam_Ha", "Spesies", "Survival_Persen"],
    nursery_mangrove: ["Kapasitas_Bibit", "Jumlah_Bibit_Tersedia", "Panjang_M", "Lebar_M", "Luas_M2", "Spesies", "Pengelola"],
    apo: ["Panjang_M", "Material", "Kondisi_Struktur", "Sedimentasi_CM"],
    sekat_kanal: ["Jumlah_Unit", "Jenis_Sekat", "Luas_Pengaruh_Ha", "Tinggi_Muka_Air_CM"],
    fdrs: ["Jumlah_Unit", "Jenis_Alat", "Status_Alat", "Kategori_Bahaya", "Tinggi_Muka_Air_CM"],
    kopi: ["Jumlah_Tanam", "Luas_Tanam_Ha", "Jumlah_Petani", "Survival_Persen", "Produksi_KG"]
  }
};
