(() => {
  "use strict";

  const API = "https://script.google.com/macros/s/AKfycbxeGTDZXkR0DyLZmBHTq2M-52Iu4dTTGpH164S7sYHg8qPzvffobC6-r-TBLVHMT3HU-A/exec?page=objects";
  const CALLBACK = "ygDashboardV4Callback";

  const FIELD_ALIASES = {
    village: ["Desa", "WADMKD", "village", "desa"],
    category: ["Kategori", "Layer_Label", "category"],
    layer: ["Layer_Label", "Layer_ID", "Source_Layer"],
    area: ["Luas_Ha", "luas_ha", "Area_Ha", "areaHa"],
    planted: ["Jumlah_Tanam", "jumlah_tanam", "Bibit_Tanam", "plantedCount", "Jumlah_Bibit", "Jumlah_Bibit_Tertanam"],
    donor: ["Donor", "donor", "Pendana", "pendana", "Funding_Source", "Sumber_Dana", "Mitra_Donor"],
    program: ["Program", "program", "Nama_Program", "Project", "project", "Proyek", "Kegiatan"],
    status: ["Status_Objek", "status"]
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function valueOf(props, aliases, fallback = "") {
    for (const key of aliases) {
      const value = props[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") return value;
    }
    return fallback;
  }

  function numberOf(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const normalized = String(value == null ? "" : value)
      .trim()
      .replace(/\s/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(",", ".")
      .replace(/[^0-9.-]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(Number(value || 0));
  }

  function increment(map, key, amount = 1) {
    const label = String(key || "").trim();
    if (!label) return;
    map[label] = (map[label] || 0) + amount;
  }

  function normalizeDonor(value) {
    const raw = String(value || "").trim();
    if (!raw) return "Belum diklasifikasikan";
    const key = raw.toLowerCase();
    const rules = [
      [/aramco/, "Aramco"],
      [/global environment centre|\bgec\b/, "Global Environment Centre (GEC)"],
      [/peatland programme conservation fund|\bppcf\b/, "PPCF"],
      [/pertamina foundation/, "Pertamina Foundation"],
      [/giz|promangrovepeat/, "GIZ"],
      [/penabulu/, "Penabulu Foundation"],
      [/restor/, "Restor"],
      [/one earth|ma earth/, "One Earth / Ma Earth"],
      [/recoftc/, "RECOFTC"],
      [/yayasan gambut|internal|swadaya/, "Yayasan Gambut / Swadaya"]
    ];
    const match = rules.find(([pattern]) => pattern.test(key));
    return match ? match[1] : raw;
  }

  function renderRanking(elementId, data, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const limit = options.limit || 8;
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, limit);
    element.innerHTML = entries.length
      ? entries.map(([name, count], index) =>
          '<div class="ranking-row">' +
            '<span class="ranking-number">' + (index + 1) + '</span>' +
            '<span class="ranking-name">' + escapeHtml(name) + '</span>' +
            '<strong>' + formatNumber(count, options.digits || 0) + (options.suffix || "") + '</strong>' +
          '</div>'
        ).join("")
      : '<div class="dashboard-empty">Belum ada data.</div>';
  }

  window[CALLBACK] = function(data) {
    if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
      document.getElementById("dashboard-updated").textContent = "Respons database tidak valid.";
      return;
    }

    const active = data.features.filter(feature => {
      const props = feature.properties || {};
      return String(valueOf(props, FIELD_ALIASES.status, "Aktif")).toLowerCase() !== "nonaktif";
    });

    const villages = new Set();
    const categories = {};
    const layers = {};
    const villageCounts = {};
    const donors = {};
    const donorSeedlings = {};
    const programs = {};
    let mangroveArea = 0;
    let interventionArea = 0;
    let plantedTotal = 0;
    let reports = 0;

    active.forEach(feature => {
      const props = feature.properties || {};
      const village = valueOf(props, FIELD_ALIASES.village);
      const category = valueOf(props, FIELD_ALIASES.category, "Lainnya");
      const layer = valueOf(props, FIELD_ALIASES.layer, "Lainnya");
      const area = numberOf(valueOf(props, FIELD_ALIASES.area));
      const planted = numberOf(valueOf(props, FIELD_ALIASES.planted));
      const donor = normalizeDonor(valueOf(props, FIELD_ALIASES.donor));
      const program = valueOf(props, FIELD_ALIASES.program, "Belum diklasifikasikan");

      if (village) {
        villages.add(String(village).trim().toLowerCase());
        increment(villageCounts, village);
      }

      increment(categories, category);
      increment(layers, layer);
      increment(donors, donor);
      increment(programs, program);
      increment(donorSeedlings, donor, planted);

      interventionArea += area;
      plantedTotal += planted;

      if ((props.Layer_ID || props.Source_Layer) === "area_mangrove") mangroveArea += area;
      if ((props.Layer_ID || "") === "community_reports" || props.Source_Type === "community_report") reports += 1;
    });

    document.getElementById("dash-objects").textContent = formatNumber(active.length);
    document.getElementById("dash-villages").textContent = formatNumber(villages.size);
    document.getElementById("dash-seedlings").textContent = formatNumber(plantedTotal);
    document.getElementById("dash-intervention-area").textContent = formatNumber(interventionArea, 2) + " ha";
    document.getElementById("dash-mangrove-area").textContent = formatNumber(mangroveArea, 2) + " ha";
    document.getElementById("dash-donors").textContent = formatNumber(Object.keys(donors).filter(k => k !== "Belum diklasifikasikan").length);
    document.getElementById("dash-reports").textContent = formatNumber(reports);

    const categoryGrid = document.getElementById("category-grid");
    categoryGrid.innerHTML = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) =>
        '<article class="category-card"><span>' + escapeHtml(name) + '</span><strong>' +
        formatNumber(count) + '</strong><small>objek aktif</small></article>'
      ).join("");

    renderRanking("village-ranking", villageCounts);
    renderRanking("layer-ranking", layers);
    renderRanking("donor-ranking", donors, { limit: 10 });
    renderRanking("donor-seedling-ranking", donorSeedlings, { limit: 10, suffix: " bibit" });
    renderRanking("program-ranking", programs, { limit: 10 });

    document.getElementById("dashboard-updated").textContent =
      "Sumber: YG Master Database · " + formatNumber(active.length) +
      " objek aktif · diperbarui " + new Date(data.generatedAt || Date.now()).toLocaleString("id-ID");
  };

  const script = document.createElement("script");
  script.src = API + "&callback=" + CALLBACK + "&t=" + Date.now();
  script.async = true;
  script.onerror = function() {
    document.getElementById("dashboard-updated").textContent =
      "Master Database belum dapat dimuat. Periksa deployment Apps Script.";
  };
  document.head.appendChild(script);
})();
