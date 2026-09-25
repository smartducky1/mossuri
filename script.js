const characters=[
 {name:'Goofy',file:'/assets/goofy.jpg'},
 {name:'Smart',file:'/assets/smart.jpg'},
 {name:'Hyper',file:'/assets/hyper.jpg'}
];
let selected=1;
const $=id=>document.getElementById(id);
function renderCharacter(){const c=characters[selected];$('selectorImage').src=c.file;$('selectorImage').alt=c.name;$('personalityImage').src=c.file;$('personalityImage').alt=c.name+' personality';$('personalityName').textContent=c.name}
$('prevChar').onclick=()=>{selected=(selected-1+characters.length)%characters.length;renderCharacter()};
$('nextChar').onclick=()=>{selected=(selected+1)%characters.length;renderCharacter()};
$('downloadBtn').onclick=()=>{const c=characters[selected];const a=document.createElement('a');a.href=c.file;a.download=`MOSSURI-${c.name}.jpg`;document.body.appendChild(a);a.click();a.remove()};
$('followBtn').onclick=()=>window.open('https://x.com/mossuris','_blank','noopener,noreferrer');
$('likeGo').onclick=()=>window.open('https://x.com/mossuris','_blank','noopener,noreferrer');
function validEvm(w){return /^0x[a-fA-F0-9]{40}$/.test(w.trim())}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
async function checkWallet(){const w=$('checkWallet').value.trim();if(!validEvm(w)){setCheck(false);return}try{const r=await fetch('/api/check',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({wallet:w})});const d=await r.json();setCheck(!!d.onList)}catch(e){setCheck(false)}}
function setCheck(yes){$('checkResult').textContent=yes?'🟢 YES — wallet is on the list':'🔴 NO — wallet is not on the list';$('checkResult').className='check-result '+(yes?'yes':'no')}
$('checkBtn').onclick=checkWallet;
async function register(){const username=$('username').value.trim().replace(/^@/,'');const wallet=$('wallet').value.trim();const quoteUrl=$('quoteUrl').value.trim();const tagUrl=$('tagUrl').value.trim();if(!username){toast('Enter your X username');return}if(!validEvm(wallet)){toast('Enter a valid EVM wallet');return}if(!quoteUrl||!tagUrl){toast('Complete all task links');return}const btn=$('registerBtn');btn.disabled=true;btn.textContent='SENDING...';try{const payload={username,wallet,personality:characters[selected].name,quoteUrl,tagUrl};const r=await fetch('/api/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.error||'Submission failed');$('successModal').classList.remove('hidden');$('username').value='';$('wallet').value='';$('quoteUrl').value='';$('tagUrl').value='';await loadBoard()}catch(e){toast(e.message||'Could not save your application')}finally{btn.disabled=false;btn.textContent='REGISTER'}}
$('registerBtn').onclick=register;
$('closeModal').onclick=()=>$('successModal').classList.add('hidden');$('successModal').onclick=e=>{if(e.target.id==='successModal')$('successModal').classList.add('hidden')};
async function loadBoard(){try{const r=await fetch('/api/board');const d=await r.json();if(!d.ok)return;$('boardRows').innerHTML=(d.rows||[]).map(x=>`<div class="board-row"><span>${escapeHtml(x.username)}</span><span>${escapeHtml(x.wallet)}</span></div>`).join('')}catch(e){}}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
renderCharacter();loadBoard();
