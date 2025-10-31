let map, markersLayer, DATA=[];
const $ = (id)=>document.getElementById(id);
const regionSel = $('region'), typeSel = $('type'), parkingSel = $('parking');
const resultsEl = $('results'), summaryEl = $('summary'), errorEl = $('error');

(async function init(){
  try{
    const res = await fetch('data/places.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    DATA = await res.json();
  }catch(e){
    errorEl.textContent = 'Δεν φορτώνει το data/places.json. Άνοιξε το με Live Server ή κάνε deploy (π.χ. Vercel).';
    DATA = [];
  }
  initMap();
  initFilters();
  render();
  regionSel.addEventListener('change', render);
  typeSel.addEventListener('change', render);
  parkingSel.addEventListener('change', render);
  $('resetBtn').addEventListener('click', ()=>{
    regionSel.value=''; typeSel.value=''; parkingSel.value=''; render();
  });
})();

function initMap(){
  map = L.map('map',{zoomControl:true}).setView([37.98,23.73],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function initFilters(){
  const regions = Array.from(new Set(DATA.map(x=>x.περιοχή).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'el'));
  for(const r of regions){
    const o=document.createElement('option'); o.value=r; o.textContent=r; regionSel.appendChild(o);
  }
}

function applyFilters(){
  return DATA.filter(x=>{
    const byR = regionSel.value ? x.περιοχή===regionSel.value : true;
    const byT = typeSel.value ? x.τύπος===typeSel.value : true;
    const byP = parkingSel.value ? x.πάρκινγκ===parkingSel.value : true;
    return byR && byT && byP;
  });
}

function render(){
  const rows = applyFilters();
  summaryEl.textContent = rows.length + ' αποτελέσματα';
  resultsEl.innerHTML = rows.map(x=>`
    <div class="card" onclick="location.href='place.html?id=${encodeURIComponent(x.id)}'">
      <h3>${x.όνομα||'—'}</h3>
      <div class="muted">${x.περιοχή||'—'} · ${x.τύπος||'—'}</div>
      <div class="muted">Πάρκινγκ: ${x.πάρκινγκ||'-'}</div>
    </div>
  `).join('');

  markersLayer.clearLayers();
  const pts=[];
  for(const x of rows){
    if(x.lat && x.lng){
      const m = L.marker([x.lat,x.lng]).bindPopup(`<strong>${x.όνομα||'—'}</strong><br/>${x.περιοχή||''}`);
      markersLayer.addLayer(m); pts.push([x.lat,x.lng]);
    }
  }
  if(pts.length){ map.fitBounds(L.latLngBounds(pts).pad(0.2)); }
}