async function loadPlace(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  try{
    const res = await fetch('data/places.json');
    const list = await res.json();
    const p = list.find(it=>String(it.id)===String(id));
    if(!p){ document.body.innerHTML='<div class="container"><p>Δεν βρέθηκε ο παιδότοπος.</p><p><a class="btn" href="index.html">← Επιστροφή</a></p></div>'; return; }
    document.getElementById('placeName').textContent = p.όνομα||'—';
    document.getElementById('region').textContent = p.περιοχή||'—';
    document.getElementById('type').textContent = p.τύπος||'—';
    document.getElementById('parking').textContent = p.πάρκινγκ||'—';
    document.getElementById('address').textContent = p.διεύθυνση||'—';
    document.getElementById('price').textContent = p.τιμή||'-';
    document.getElementById('desc').textContent = p.περιγραφή||'';
    const g = document.getElementById('gmaps');
    if(p.lat && p.lng){ g.href = `https://www.google.com/maps?q=${p.lat},${p.lng}`; } else if(p.διεύθυνση){ g.href = `https://www.google.com/maps?q=${encodeURIComponent(p.διεύθυνση)}`; } else { g.remove(); }
    const photos = document.getElementById('photos');
    if(Array.isArray(p.φωτογραφίες)){
      photos.innerHTML = p.φωτογραφίες.map(src=>`<img src="${src}" alt="photo">`).join('');
    }
  }catch(e){
    document.body.innerHTML='<div class="container"><p>Σφάλμα φόρτωσης δεδομένων.</p><p><a class="btn" href="index.html">← Επιστροφή</a></p></div>';
  }
}
loadPlace();