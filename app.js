(() => {
'use strict';
const perfumes = window.SCENTELIER_PERFUMES;
const NOTES = ['木質調','花香調','柑橘調','水生調','綠葉調','麝香調','辛香調','皮革調'];
const MOODS = ['清冷疏離','溫柔乾淨','神祕性感','陽光活力','沉穩知性'];
const state = {notes:new Set(),moods:new Set(),keyword:'',brand:'',budget:0};
const $ = id => document.getElementById(id);
const normalize = s => s.toLocaleLowerCase().trim();
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const palettes = [['#e4e9dd','#bdcdbb'],['#eee5dc','#d9c7b8'],['#e3e8ea','#b6cdd0'],['#e8e3d7','#c9c2ab'],['#e8e0e7','#c7b8c7']];
function addChips(id, values, type) {
 const target = $(id);
 values.forEach(value => {
  const button = document.createElement('button'); button.type='button'; button.className='chip';button.textContent=value;button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>{const selected=state[type];selected.has(value)?selected.delete(value):selected.add(value);button.setAttribute('aria-pressed',String(selected.has(value)));render();});target.append(button);
 });
}
// Filter precedence: all selected dimensions > partial matches; keyword and brand remain strict.
function score(p) {
 const brandMatch = !state.brand || p.brand === state.brand;
 const searchable = normalize([p.brand,p.name,...p.ingredients,...p.notes,...p.moods].join(' '));
 if (!brandMatch || !searchable.includes(normalize(state.keyword))) return -1;
 if (state.budget && p.priceTWD != null && p.priceTWD > state.budget) return -1;
 const hasNotes = state.notes.size > 0, hasMoods = state.moods.size > 0;
 const noteHits = [...state.notes].filter(n=>p.notes.includes(n)).length;
 const moodHits = [...state.moods].filter(m=>p.moods.includes(m)).length;
 if (!hasNotes && !hasMoods) return 100;
 if (hasNotes && hasMoods) {
   if (noteHits && moodHits) return 100 + noteHits + moodHits;
   if (noteHits || moodHits) return 10 + noteHits + moodHits;
   return -1;
 }
 if (hasNotes) return noteHits ? 100 + noteHits : -1;
 return moodHits ? 100 + moodHits : -1;
}
function priceLabel(p){return p.priceTWD == null ? '請於專櫃或門市確認' : `正裝 ${p.volumeMl}ml · NT$${p.priceTWD.toLocaleString('en-US')}（定價參考）`;}
function openDetail(p){
 $('detail-content').innerHTML=`<p class="brand">${escapeHTML(p.brand)}</p><h2>${escapeHTML(p.name)}</h2><p>${escapeHTML(p.description)}</p><h3>正裝參考定價</h3><p>${escapeHTML(priceLabel(p))}</p>${p.priceSourceUrl ? `<a class="official" href="${escapeHTML(p.priceSourceUrl)}" target="_blank" rel="noopener noreferrer">查看價格來源與查詢日 ↗</a>` : `<p>請於專櫃或門市確認；目前無法判定是否符合設定預算。</p>`}${p.priceCheckedAt ? `<p style="font-size:11px">價格查詢日：${escapeHTML(p.priceCheckedAt)} · 非即時報價</p>` : ``}<h3>香調分類</h3><div class="tags">${p.notes.map(n=>`<span class="tag">${escapeHTML(n)}</span>`).join('')}</div><h3>香氣氛圍（編輯主觀標籤）</h3><div class="tags">${p.moods.map(m=>`<span class="tag">${escapeHTML(m)}</span>`).join('')}</div><h3>代表性香材／氣息</h3><p>${p.ingredients.map(escapeHTML).join(' · ')}</p><a class="official" target="_blank" rel="noopener noreferrer" href="${escapeHTML(p.url)}">查看品牌官方資料來源 ↗</a><p style="font-size:11px">香調與描述供探索參考，產品資訊請以品牌官方資料為準。</p>`;
 $('detail').showModal();
}
function render(){
 const ranked=perfumes.map(p=>({p,score:score(p)})).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score||a.p.brand.localeCompare(b.p.brand,'en'));
 // Preserve scent relevance as the primary grouping; within each group, show confirmed-in-budget products before unknown-price products.
 const priceOrder=(a,b)=>Number(a.p.priceTWD==null)-Number(b.p.priceTWD==null);
 const full=ranked.filter(x=>x.score>=100).sort((a,b)=>priceOrder(a,b)||b.score-a.score), partial=ranked.filter(x=>x.score<100).sort((a,b)=>priceOrder(a,b)||b.score-a.score);
 $('count').textContent=`(${ranked.length})`;$('empty').hidden=ranked.length!==0;
 const unknownCount=ranked.filter(x=>x.p.priceTWD==null).length;
 $('result-summary').textContent=(partial.length ? `完全符合 ${full.length} 款 · 部分符合 ${partial.length} 款` : `完全符合 ${full.length} 款`) + (state.budget && unknownCount ? ` · 其中 ${unknownCount} 款價格待確認（未驗證符合預算）` : '');
 const target=$('results');target.replaceChildren();
 function section(title,subtitle,entries,kind){
  if(!entries.length)return;
  const heading=document.createElement('div');heading.className='match-heading';
  heading.innerHTML=`<h3>${escapeHTML(title)} <span>${entries.length} 款</span></h3><p>${escapeHTML(subtitle)}</p>`;
  target.append(heading);
  const grid=document.createElement('div');grid.className='results-grid';
  entries.forEach(({p})=>{
   const palette=palettes[perfumes.indexOf(p)%palettes.length];const button=document.createElement('button');button.type='button';button.className='perfume-card';button.setAttribute('aria-label',`查看 ${p.brand} ${p.name} 詳細資訊`);
   button.innerHTML=`<div class="card-visual" style="--tone1:${palette[0]};--tone2:${palette[1]}"><div class="mini-bottle"><span>SCENTELIER</span></div></div><div class="card-body"><span class="brand">${escapeHTML(p.brand)}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description)}</p><div class="tags">${p.notes.map(n=>`<span class="tag">${escapeHTML(n)}</span>`).join('')}${p.moods.slice(0,1).map(m=>`<span class="tag">${escapeHTML(m)}</span>`).join('')}</div><span class="price-tag">${escapeHTML(priceLabel(p))}</span><span class="card-more">探索香氣 ↗</span></div>`;
   button.addEventListener('click',()=>openDetail(p));grid.append(button);
  });target.append(grid);
 }
 const both=state.notes.size&&state.moods.size;
 section('完全符合',both?'同時符合所選香調與氛圍，依符合條件數排序。':'符合目前的篩選條件。',full,'full');
 section('部分符合','符合所選香調或氛圍其中一類，供你延伸探索。',partial,'partial');
}
addChips('note-filters',NOTES,'notes');addChips('mood-filters',MOODS,'moods');
[...new Set(perfumes.map(p=>p.brand))].sort((a,b)=>a.localeCompare(b,'en')).forEach(brand=>{const option=document.createElement('option');option.value=brand;option.textContent=brand;$('brand').append(option);});
$('keyword').addEventListener('input',e=>{state.keyword=e.target.value;render();});
$('brand').addEventListener('change',e=>{state.brand=e.target.value;render();});
$('budget').addEventListener('input',e=>{state.budget=Number(e.target.value);$('budget-label').textContent=state.budget?`NT$${state.budget.toLocaleString('en-US')} 以下`:'不限預算';render();});
$('reset').addEventListener('click',()=>{state.notes.clear();state.moods.clear();state.keyword='';state.brand='';state.budget=0;$('budget').value='0';$('budget-label').textContent='不限預算';$('keyword').value='';$('brand').value='';document.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed','false'));render();});
$('close-detail').addEventListener('click',()=>$('detail').close());
$('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close();});
render();
})();
