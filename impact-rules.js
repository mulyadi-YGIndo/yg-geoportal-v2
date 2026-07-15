(() => {
  "use strict";

  const RULES = {
    area_mangrove: [13, 14, 15],
    nursery_mangrove: [8, 13, 14, 15],
    apo: [9, 11, 13, 14],
    sekat_kanal: [6, 13, 15],
    fdrs: [11, 13, 15],
    kopi: [1, 2, 8, 12, 13, 15],
    forest_restoration: [8, 10, 13, 15, 16],
    training: [4, 8, 10, 13]
  };

  function number(value) {
    const parsed = Number(String(value ?? "").replace(/,/g, "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function layerId(properties = {}) {
    return String(properties.Layer_ID || properties.Source_Layer || properties.Object_Type || "").trim();
  }

  function classifySdgs(properties = {}, monitoring = []) {
    const result = new Set(RULES[layerId(properties)] || []);

    if (number(properties.Peserta_Perempuan) > 0) result.add(5);
    if (number(properties.Jumlah_Petani) > 0 || number(properties.Jumlah_Peserta) > 0) result.add(8);
    if (String(properties.Kelompok_Sasaran || "").toLowerCase().includes("adat")) {
      result.add(10);
      result.add(16);
    }
    if (monitoring.some(item => number(item.Produksi_KG) > 0 || number(item.Pendapatan_Tambahan_IDR) > 0)) {
      result.add(1);
      result.add(8);
    }

    return [...result].sort((a, b) => a - b);
  }

  function calculateVerifiedOutputs(properties = {}, monitoring = []) {
    const latest = monitoring
      .slice()
      .sort((a, b) => new Date(b.Tanggal_Monitoring || 0) - new Date(a.Tanggal_Monitoring || 0))[0] || {};

    return {
      objectType: layerId(properties),
      planted: number(properties.Jumlah_Tanam),
      nurseryAvailable: number(latest.Jumlah_Bibit_Tersedia || properties.Jumlah_Bibit_Tersedia),
      nurseryCapacity: number(properties.Kapasitas_Bibit),
      areaHa: number(properties.Luas_Tanam_Ha || properties.Luas_Ha),
      beneficiaries: number(properties.Jumlah_Penerima_Manfaat || properties.Jumlah_Peserta),
      survivalPercent: number(latest.Survival_Persen),
      sdgs: classifySdgs(properties, monitoring)
    };
  }

  function carbonStatus(properties = {}) {
    const allowed = new Set(["belum_dihitung", "estimasi_awal", "terverifikasi_internal", "terverifikasi_pihak_ketiga"]);
    const status = String(properties.Carbon_Status || "belum_dihitung");
    return allowed.has(status) ? status : "belum_dihitung";
  }

  window.YG_IMPACT_RULES = {
    classifySdgs,
    calculateVerifiedOutputs,
    carbonStatus
  };
})();
