// Replace corrupted content with a single, clean implementation
document.addEventListener('DOMContentLoaded', () => {
  const seatMapsEl = document.getElementById('seatMaps');
  const selectedSeatsEl = document.getElementById('selectedSeats');
  const confirmBtn = document.getElementById('confirmSeats');
  if (!(seatMapsEl && selectedSeatsEl && confirmBtn)) return;

  const trains = buildTrains(5);
  const selected = new Set();

  function buildTrains(count){
    const cols=['A','B','C','D']; const startRow=1, endRow=10; const out=[];
    for(let i=1;i<=count;i++){ const seats=[]; for(let r=startRow;r<=endRow;r++) cols.forEach(col=>seats.push({ code:`T${i}-${col}${r}`, row:r, col, available: Math.random()>0.18 })); out.push({ id:i, seats, cols, startRow, endRow }); }
    return out;
  }

  function createChairSVG(){
    // replaced chair SVG with a simple door box element for clarity
    const el = document.createElement('div');
    el.className = 'door-box';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Door');
    return el;
  }

  function renderSeatMaps(trainId){
    seatMapsEl.innerHTML=''; const train=trains.find(t=>t.id===trainId); if(!train) return;
    const map=document.createElement('div'); map.className='train-map';
    const title=document.createElement('h6'); title.textContent='Train '+train.id; map.appendChild(title);
    const carriage=document.createElement('div'); carriage.className='carriage'; const body=document.createElement('div'); body.className='seat-body'; const cabin=document.createElement('h3'); cabin.className='main-cabin text-center'; cabin.textContent='Main Cabin'; body.appendChild(cabin);

    // header with column labels centered
  const header=document.createElement('div'); header.className='seat-header d-flex align-items-center justify-content-center';
  const colLeft=document.createElement('div'); colLeft.className='col-group d-flex align-items-center gap-2 me-3'; train.cols.slice(0,2).forEach(c=>{ const lab=document.createElement('div'); lab.className='col-label'; lab.textContent=c; colLeft.appendChild(lab); });
  const colCenter=document.createElement('div'); colCenter.className='row-label text-center'; colCenter.textContent='';
  const colRight=document.createElement('div'); colRight.className='col-group d-flex align-items-center gap-2 ms-3'; train.cols.slice(2).forEach(c=>{ const lab=document.createElement('div'); lab.className='col-label'; lab.textContent=c; colRight.appendChild(lab); });
    header.appendChild(colLeft); header.appendChild(colCenter); header.appendChild(colRight); body.appendChild(header);

    const rows=document.createElement('div'); rows.className='rows-container d-flex flex-column';
    for(let r=train.startRow;r<=train.endRow;r++){
      const rowEl=document.createElement('div'); rowEl.className='seat-row d-flex align-items-center';

  // left row number
  const leftNum=document.createElement('div'); leftNum.className='row-num-left'; leftNum.textContent = r;

  // left seat group (A,B) - horizontal
  const leftGroup=document.createElement('div'); leftGroup.className='seat-group d-flex align-items-center me-3';
      train.cols.slice(0,2).forEach(col=>{ const seat=train.seats.find(s=>s.row===r && s.col===col); const sEl=document.createElement('div'); sEl.className='seat '+(seat.available?'available':'unavailable'); // keep code in dataset for accessibility but hide visible text
        sEl.dataset.code = seat.code; sEl.setAttribute('aria-label', seat.code); sEl.title = seat.code; sEl.textContent = '';
        if(seat.available) sEl.addEventListener('click',()=>toggleSeat(seat.code,sEl)); leftGroup.appendChild(sEl); });

  // center row number removed (we show left/right only)

  // right seat group (C,D) - horizontal
  const rightGroup=document.createElement('div'); rightGroup.className='seat-group d-flex align-items-center ms-3';
      train.cols.slice(2).forEach(col=>{ const seat=train.seats.find(s=>s.row===r && s.col===col); const sEl=document.createElement('div'); sEl.className='seat '+(seat.available?'available':'unavailable'); sEl.dataset.code = seat.code; sEl.setAttribute('aria-label', seat.code); sEl.title = seat.code; sEl.textContent = '';
        if(seat.available) sEl.addEventListener('click',()=>toggleSeat(seat.code,sEl)); rightGroup.appendChild(sEl); });

  // right row number
  const rightNum=document.createElement('div'); rightNum.className='row-num-right'; rightNum.textContent = r;

  rowEl.appendChild(leftNum);
  rowEl.appendChild(leftGroup);
  rowEl.appendChild(rightGroup);
  rowEl.appendChild(rightNum);

      rows.appendChild(rowEl);

      // insert door boxes after specific rows as vertical stacked boxes beside seat groups
      if([3,7].includes(r)){
  const doorRow=document.createElement('div'); doorRow.className='door-row d-flex align-items-center justify-content-center my-2';
        // show door row without repeating numbers in the space area
  const leftNumD=document.createElement('div'); leftNumD.className='row-num-left'; leftNumD.textContent = ( [3,7].includes(r) ? '' : r );
  const leftDoor=document.createElement('div'); leftDoor.className='door-slot d-flex align-items-center justify-content-center me-2'; leftDoor.appendChild(createChairSVG());
  const rightDoor=document.createElement('div'); rightDoor.className='door-slot d-flex align-items-center justify-content-center ms-2'; rightDoor.appendChild(createChairSVG());
        // add a blank spacer instead of repeating numbers in the center
        const centerSpacer=document.createElement('div'); centerSpacer.className='row-space'; centerSpacer.style.width='60px';
  const rightNumD=document.createElement('div'); rightNumD.className='row-num-right'; rightNumD.textContent = ( [3,7].includes(r) ? '' : r );
        doorRow.appendChild(leftNumD); doorRow.appendChild(leftDoor); doorRow.appendChild(centerSpacer); doorRow.appendChild(rightDoor); doorRow.appendChild(rightNumD);
  rows.appendChild(doorRow);
      }
    }

    body.appendChild(rows);
    carriage.appendChild(body); map.appendChild(carriage); seatMapsEl.appendChild(map); updateSelectedDisplay();
  }

  function toggleSeat(code, el){ if(el.classList.contains('unavailable')) return; if(selected.has(code)){ selected.delete(code); el.classList.remove('selected'); const star=el.querySelector('.seat-star'); if(star) star.remove(); } else { selected.add(code); el.classList.add('selected'); const star=document.createElement('span'); star.className='seat-star'; star.textContent='★'; el.appendChild(star); } updateSelectedDisplay(); }

  function updateSelectedDisplay(){ selectedSeatsEl.textContent = selected.size===0 ? 'None' : Array.from(selected).join(', '); }

  confirmBtn.addEventListener('click', ()=>{ if(selected.size===0){ showAlert('Please select at least one seat before confirming.', 'warning'); return; } showAlert('Reservation confirmed: '+Array.from(selected).join(', '), 'success'); selected.clear(); const activeBtn=document.querySelector('#trainSelector .btn.active'); const tid=activeBtn?Number(activeBtn.getAttribute('data-train')):1; renderSeatMaps(tid); });

  const selector=document.getElementById('trainSelector'); if(selector) selector.addEventListener('click',(e)=>{ const btn=e.target.closest('button[data-train]'); if(!btn) return; selector.querySelectorAll('button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); selected.clear(); renderSeatMaps(Number(btn.getAttribute('data-train'))); });

  renderSeatMaps(1);

  function showAlert(message, type){ const existing=document.getElementById('planAlert'); if(existing) existing.remove(); const d=document.createElement('div'); d.id='planAlert'; d.className=`alert alert-${type} alert-dismissible fade show m-3`; d.role='alert'; d.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`; document.body.prepend(d); setTimeout(()=>{ try{ bootstrap.Alert.getOrCreateInstance(d).close(); }catch(e){} },8000); }

});

