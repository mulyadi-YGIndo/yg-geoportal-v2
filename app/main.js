import { loadObjects, loadSummary } from "./services/api.js";
import { state, p, valueOf } from "./services/state.js";

const statusEl = document.getElementById("connection-status");

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}

function route() {
  const current = (location.hash || "#dashboard").slice(1);
  document.querySelectorAll(".page").forEach(page => page.hidden = true);
  document.getElementById("page-" + current).hidden = false;
  document.querySelectorAll("[data-route]").forEach(link =>
    link.classList.toggle("active", link.dataset.route === current)
  );
  if (current === "spatial" && state.map) {
    setTimeout(() => state.map.invalidateSize(true), 80);
  }
}

function initMap() {
  state.map = L.map("map", { preferCanvas:true }).setView([1.2,102.1],8);
  const road = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:20, attribution:"&copy; OpenStreetMap"
  }).addTo(state.map);
  const sat = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom:20, attribution:"Tiles &copy; Esri" }
  );
  L.control.layers({"Peta Jalan":road,"Citra Satelit":sat}).addTo(state.map);
}

function styleFor(feature) {
  const type = feature?.geometry?.type || "";
  return {
    color:"#087653",weight:type.includes("Polygon")?2:3,
    fillColor:"#11a873",fillOpacity:type.includes("Polygon")?.2:.8,radius:7
  };
}

function renderMap(features) {
  if (state.geoLayer) state.map.removeLayer(state.geoLayer);
  state.geoLayer = L.geoJSON({type:"FeatureCollection",features}, {
    style:styleFor,
    pointToLayer:(_f,ll)=>L.circleMarker(ll,styleFor(_f)),
    onEachFeature:(feature,layer)=>{
      layer.on("click",()=>selectFeature(feature));
      layer.bindTooltip(valueOf(p(feature),["Nama_Objek","title","Desa"]) || "Objek");
    }
  }).addTo(state.map);
  const bounds = state.geoLayer.getBounds();
  if (bounds.isValid()) state.map.fitBounds(bounds,{padding:[20,20]});
}

function uniqueOptions(features,key,labelKeys) {
  const map = new Map();
  features.forEach(feature=>{
    const props = p(feature);
    const value = props[key] || "";
    if (!value) return;
    const label = labelKeys ? valueOf(props,labelKeys) || value : value;
    map.set(String(value),String(label));
  });
  return [...map.entries()].sort((a,b)=>a[1].localeCompare(b[1],"id"));
}

function fillSelect(id,items,placeholder) {
  const select = document.getElementById(id);
  const current = select.value;
  select.innerHTML = '<option value="">' + placeholder + '</option>' +
    items.map(([v,l])=>'<option value="'+esc(v)+'">'+esc(l)+'</option>').join("");
  if ([...select.options].some(o=>o.value===current)) select.value=current;
}

function buildFilters() {
  fillSelect("filter-program",uniqueOptions(state.features,"Program"),"Semua program");
  fillSelect("filter-layer",uniqueOptions(state.features,"Layer_ID",["Layer_Label"]),"Semua layer");
  fillSelect("filter-regency",uniqueOptions(state.features,"Kabupaten"),"Semua kabupaten");
  fillSelect("filter-district",uniqueOptions(state.features,"Kecamatan"),"Semua kecamatan");
  fillSelect("filter-village",uniqueOptions(state.features,"Desa"),"Semua desa");
}

function applyFilters() {
  const program = document.getElementById("filter-program").value;
  const layer = document.getElementById("filter-layer").value;
  const regency = document.getElementById("filter-regency").value;
  const district = document.getElementById("filter-district").value;
  const village = document.getElementById("filter-village").value;
  const query = document.getElementById("filter-search").value.trim().toLowerCase();

  state.filtered = state.features.filter(feature=>{
    const props = p(feature);
    const text = [
      props.Nama_Objek,props.Object_ID,props.Kategori,props.Program,
      props.Kabupaten,props.Kecamatan,props.Desa
    ].filter(Boolean).join(" ").toLowerCase();
    return (!program||props.Program===program) &&
      (!layer||props.Layer_ID===layer) &&
      (!regency||props.Kabupaten===regency) &&
      (!district||props.Kecamatan===district) &&
      (!village||props.Desa===village) &&
      (!query||text.includes(query));
  });

  renderObjectList();
  renderMap(state.filtered);
}

function renderObjectList() {
  const list = document.getElementById("object-list");
  document.getElementById("explorer-count").textContent =
    state.filtered.length + " objek";

  list.innerHTML = state.filtered.map((feature,index)=>{
    const props=p(feature);
    const active=state.selected && p(state.selected).Object_ID===props.Object_ID;
    return '<button class="object-item'+(active?' active':'')+'" data-index="'+index+'">'+
      '<strong>'+esc(props.Nama_Objek||"Objek tanpa nama")+'</strong>'+
      '<span>'+esc(props.Program||"-")+' · '+esc(props.Desa||"-")+'</span>'+
      '</button>';
  }).join("") || '<p style="padding:12px">Tidak ada objek.</p>';
}

function selectFeature(feature) {
  state.selected = feature;
  renderObjectList();
  const props = p(feature);
  document.getElementById("properties-empty").hidden = true;
  document.getElementById("properties-content").hidden = false;
  document.getElementById("prop-layer-label").textContent =
    props.Layer_Label || props.Layer_ID || "Layer";
  document.getElementById("prop-name").textContent =
    props.Nama_Objek || "Objek tanpa nama";

  const fields = [
    ["Object ID",props.Object_ID],["Program",props.Program],["Kategori",props.Kategori],
    ["Status",props.Status_Objek],["Kabupaten",props.Kabupaten],
    ["Kecamatan",props.Kecamatan],["Desa",props.Desa],
    ["Luas",props.Luas_Ha!==""&&props.Luas_Ha!=null?props.Luas_Ha+" ha":""],
    ["Panjang",props.Panjang_M!==""&&props.Panjang_M!=null?props.Panjang_M+" m":""],
    ["Jumlah tanam",props.Jumlah_Tanam],["Revisi",props.Revision]
  ];
  document.getElementById("property-grid").innerHTML = fields
    .filter(([,v])=>v!==undefined&&v!==null&&String(v).trim()!=="")
    .map(([l,v])=>'<div class="property-card"><small>'+esc(l)+'</small><strong>'+esc(v)+'</strong></div>')
    .join("");

  document.getElementById("open-current-editor").href =
    "polygon-editor.html?object=" + encodeURIComponent(props.Object_ID || "");

  if (state.geoLayer) {
    state.geoLayer.eachLayer(layer=>{
      if (p(layer.feature).Object_ID===props.Object_ID) {
        const b=layer.getBounds?.();
        if (b?.isValid()) state.map.fitBounds(b,{padding:[50,50],maxZoom:18});
      }
    });
  }
}

function groupCount(features,key,labelKey) {
  const result={};
  features.forEach(feature=>{
    const props=p(feature);
    const label=props[labelKey||key]||props[key]||"Belum terisi";
    result[label]=(result[label]||0)+1;
  });
  return Object.entries(result).sort((a,b)=>b[1]-a[1]);
}

function renderDashboard(summary) {
  const programCount = new Set(state.features.map(f=>p(f).Program).filter(Boolean)).size;
  const layerCount = new Set(state.features.map(f=>p(f).Layer_ID).filter(Boolean)).size;
  const villageCount = new Set(state.features.map(f=>p(f).Desa).filter(Boolean)).size;
  const area = state.features.reduce((sum,f)=>{
    const n=Number(p(f).Luas_Ha); return sum+(Number.isFinite(n)?n:0);
  },0);
  const monitoring = state.features.filter(f=>p(f).Source_Type==="monitoring_report").length;

  document.getElementById("stat-programs").textContent=programCount;
  document.getElementById("stat-layers").textContent=layerCount;
  document.getElementById("stat-objects").textContent=state.features.length;
  document.getElementById("stat-villages").textContent=villageCount;
  document.getElementById("stat-area").textContent=
    new Intl.NumberFormat("id-ID",{maximumFractionDigits:2}).format(area)+" ha";
  document.getElementById("stat-monitoring").textContent=monitoring;

  const rowHtml = items=>items.slice(0,12).map(([l,c])=>
    '<div class="summary-row"><span>'+esc(l)+'</span><strong>'+c+'</strong></div>'
  ).join("");

  document.getElementById("program-summary").innerHTML=
    rowHtml(groupCount(state.features,"Program"));
  document.getElementById("layer-summary").innerHTML=
    rowHtml(groupCount(state.features,"Layer_ID","Layer_Label"));
  document.getElementById("system-summary").innerHTML=
    '<p><b>Sumber:</b> '+esc(state.collection?.source||"YG_MASTER_DATABASE")+'</p>'+
    '<p><b>Diperbarui:</b> '+esc(state.collection?.generatedAt||"-")+'</p>'+
    '<p><b>Feature:</b> '+state.features.length+'</p>';
}

function renderMonitoring() {
  const list=document.getElementById("monitoring-list");
  const items=state.features.filter(f=>p(f).Source_Type==="monitoring_report");
  list.innerHTML=items.map(feature=>{
    const props=p(feature);
    return '<article class="monitor-card">'+
      '<span class="monitor-status">'+esc(props.Kondisi||"Monitoring")+'</span>'+
      '<h3>'+esc(props.Nama_Objek||props.title||"Monitoring")+'</h3>'+
      '<p>'+esc([props.Desa,props.Kecamatan,props.Kabupaten].filter(Boolean).join(", "))+'</p>'+
      '<p><b>Tanggal:</b> '+esc(props.activityDate||props.publishedAt||"-")+'</p>'+
      '<p><b>Survival:</b> '+esc(props.Survival||"-")+'</p>'+
      '</article>';
  }).join("") || '<p>Belum ada monitoring.</p>';
}

async function loadAll() {
  statusEl.textContent="Mengambil data…";
  try{
    const [collection,summary]=await Promise.all([loadObjects(),loadSummary()]);
    state.collection=collection;
    state.features=Array.isArray(collection.features)?collection.features:[];
    buildFilters();
    applyFilters();
    renderDashboard(summary);
    renderMonitoring();
    statusEl.textContent=state.features.length+" objek tersambung";
  }catch(error){
    statusEl.textContent="Gagal: "+error.message;
  }
}

document.querySelectorAll(
  "#filter-program,#filter-layer,#filter-regency,#filter-district,#filter-village"
).forEach(el=>el.addEventListener("change",applyFilters));
document.getElementById("filter-search").addEventListener("input",applyFilters);
document.getElementById("object-list").addEventListener("click",event=>{
  const button=event.target.closest("[data-index]");
  if(button) selectFeature(state.filtered[Number(button.dataset.index)]);
});
document.getElementById("fit-all").addEventListener("click",()=>{
  const b=state.geoLayer?.getBounds();if(b?.isValid())state.map.fitBounds(b,{padding:[20,20]});
});
document.getElementById("clear-selection").addEventListener("click",()=>{
  state.selected=null;document.getElementById("properties-empty").hidden=false;
  document.getElementById("properties-content").hidden=true;renderObjectList();
});
document.getElementById("refresh-app").addEventListener("click",loadAll);
window.addEventListener("hashchange",route);

initMap();
route();
loadAll();
