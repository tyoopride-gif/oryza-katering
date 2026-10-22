const WA = "62895360411714"; // ganti dengan nomor WhatsApp Anda
// Kirim teks ke WhatsApp (teks otomatis di-encode agar tidak hilang)
function kirimWA(teks){
  const url = `https://api.whatsapp.com/send?phone=${WA}&text=${encodeURIComponent(teks)}`;
  const w = window.open(url, "_blank");
  if(!w) window.location.href = url; // jika popup diblokir
}
const rp = n => "Rp " + n.toLocaleString("id-ID");

const MENU = [
  {id:1,nama:"Nasi Goreng Spesial",kat:"Makanan Utama",harga:25000,emoji:"🍛",desc:"Nasi goreng dengan telur, ayam suwir, dan kerupuk."},
  {id:2,nama:"Rendang Sapi",kat:"Makanan Utama",harga:38000,emoji:"🥘",desc:"Daging sapi empuk dimasak dengan bumbu rempah khas Padang."},
  {id:3,nama:"Ayam Bakar Madu",kat:"Makanan Utama",harga:30000,emoji:"🍗",desc:"Ayam bakar dengan olesan madu, lalapan, dan sambal."},
  {id:4,nama:"Soto Ayam",kat:"Makanan Utama",harga:22000,emoji:"🍲",desc:"Soto kuah kuning hangat dengan bihun dan telur."},
  {id:5,nama:"Gado-Gado",kat:"Sayur",harga:20000,emoji:"🥗",desc:"Sayuran segar dengan saus kacang gurih."},
  {id:6,nama:"Sayur Asem",kat:"Sayur",harga:15000,emoji:"🥬",desc:"Sayur kuah asam segar dengan jagung dan kacang panjang."},
  {id:7,nama:"Sate Ayam (10 tusuk)",kat:"Camilan",harga:28000,emoji:"🍢",desc:"Sate ayam bumbu kacang dengan lontong."},
  {id:8,nama:"Risoles Ragout",kat:"Camilan",harga:5000,emoji:"🥟",desc:"Risoles isi ragout ayam dan sayuran."},
  {id:9,nama:"Lemper Ayam",kat:"Camilan",harga:5000,emoji:"🍙",desc:"Ketan isi ayam suwir dibungkus daun pisang."},
  {id:10,nama:"Es Teh Manis",kat:"Minuman",harga:6000,emoji:"🧋",desc:"Teh manis dingin menyegarkan."},
  {id:11,nama:"Es Jeruk",kat:"Minuman",harga:9000,emoji:"🍹",desc:"Perasan jeruk segar dengan es batu."},
  {id:12,nama:"Es Cendol",kat:"Dessert",harga:12000,emoji:"🍧",desc:"Cendol, santan, dan gula merah."},
  {id:13,nama:"Pudding Cokelat",kat:"Dessert",harga:10000,emoji:"🍮",desc:"Pudding lembut dengan vla vanila."},
  {id:14,nama:"Bakso Urat",kat:"Makanan Utama",harga:24000,emoji:"🍜",desc:"Bakso urat kenyal dengan mie dan kuah kaldu sapi."}
];

const PAKET = [
  {id:"p1",nama:"Paket Hemat",harga:25000,min:20,pop:false,isi:["Nasi putih","Ayam goreng/bakar","Sayur tumis","Sambal & kerupuk","Air mineral"]},
  {id:"p2",nama:"Paket Reguler",harga:38000,min:30,pop:true,isi:["Nasi putih","Ayam/daging pilihan","2 jenis sayur","Gorengan & sambal","Buah potong","Air mineral"]},
  {id:"p3",nama:"Paket Premium",harga:55000,min:50,pop:false,isi:["Nasi putih/liwet","Rendang atau ayam bakar madu","3 jenis lauk","Sayur & lalapan","Dessert pilihan","Es teh/jus"]},
  {id:"p4",nama:"Paket Snack Box",harga:18000,min:30,pop:false,isi:["2 kue basah","1 gorengan","Buah potong","Air mineral"]}
];

let cart = {};   // {id: qty}
let activeCat = "Semua";


/* ---------- Metode Pembayaran ---------- */
// GANTI nomor rekening / e-wallet & nama pemilik sesuai milik Anda.
// Untuk QRIS: simpan gambar QRIS Anda sebagai "qris.png" di folder yang sama.
const PAYMENT = [
  {id:"dana",    nama:"DANA",         grup:"E-Wallet",      icon:"💙", nomor:"0812-3456-7890",   an:"Dapur Nusantara"},
  {id:"gopay",   nama:"GoPay",        grup:"E-Wallet",      icon:"💚", nomor:"0812-3456-7890",   an:"Dapur Nusantara"},
  {id:"qris",    nama:"QRIS",         grup:"QRIS",          icon:"📱", qr:"qris.png",            an:"Dapur Nusantara"},
  {id:"mandiri", nama:"Bank Mandiri", grup:"Transfer Bank", icon:"🏦", nomor:"123-00-1234567-8", an:"Dapur Nusantara"},
  {id:"bni",     nama:"Bank BNI",     grup:"Transfer Bank", icon:"🏦", nomor:"0123456789",       an:"Dapur Nusantara"},
  {id:"bca",     nama:"Bank BCA",     grup:"Transfer Bank", icon:"🏦", nomor:"1234567890",       an:"Dapur Nusantara"}
];
const pay = {cart:null, form:null};

function payText(key){
  const p = PAYMENT.find(x=>x.id===pay[key]);
  if(!p) return "-";
  return p.nomor ? `${p.nama} (${p.nomor} a.n. ${p.an})` : `${p.nama} a.n. ${p.an}`;
}
function setPay(key,id){ pay[key]=id; renderPay(key); }
function salin(teks){
  try{ navigator.clipboard.writeText(teks.replace(/-/g,"")).then(()=>toast("Nomor disalin")); }
  catch(e){ toast("Salin manual ya"); }
}
function renderPay(key){
  const el = document.getElementById(key==="cart" ? "payCart" : "payForm");
  const groups = [...new Set(PAYMENT.map(p=>p.grup))];
  let h = '<div class="pay-title">Metode Pembayaran</div>';
  h += groups.map(g=>`<div class="pay-group"><span>${g}</span><div class="pay-opts">` +
    PAYMENT.filter(p=>p.grup===g).map(p=>
      `<button type="button" class="pay-opt ${pay[key]===p.id?"active":""}" onclick="setPay('${key}','${p.id}')">${p.icon} ${p.nama}</button>`
    ).join("") + `</div></div>`).join("");
  const sel = PAYMENT.find(p=>p.id===pay[key]);
  if(sel){
    h += '<div class="pay-detail">';
    if(sel.qr){
      h += `Scan QRIS a.n. <b>${sel.an}</b>
        <img src="${sel.qr}" alt="QRIS" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <small style="display:none">Gambar QRIS belum ditambahkan (simpan sebagai qris.png).</small>`;
    }else{
      h += `${sel.nama}: <b>${sel.nomor}</b> <button type="button" class="copy" onclick="salin('${sel.nomor}')">Salin</button><br>a.n. ${sel.an}`;
    }
    h += '<small>Setelah membayar, kirim bukti transfer lewat WhatsApp.</small></div>';
  }
  el.innerHTML = h;
}


/* ---------- Daftar Pemesan ---------- */
const ADMIN_PIN = "1234";          // GANTI PIN admin
const STORE_KEY = "dn_orders";
let orders = [];
try{ orders = JSON.parse(localStorage.getItem(STORE_KEY)) || []; }catch(e){ orders = []; }
let unlocked = false;

const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtTgl = t => t ? t.split("-").reverse().join("/") : "-";

function saveOrders(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(orders)); }catch(e){} }
function tambahOrder(o){
  orders.unshift({id:Date.now(), waktu:new Date().toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"}), ...o});
  saveOrders(); renderOrders();
}
function hapusOrder(id){
  if(!confirm("Hapus pesanan ini?")) return;
  orders = orders.filter(o=>o.id!==id); saveOrders(); renderOrders();
}
function hapusSemua(){
  if(!orders.length || !confirm("Hapus SEMUA daftar pemesan?")) return;
  orders = []; saveOrders(); renderOrders();
}
function bukaDaftar(){
  const p = prompt("Masukkan PIN admin:");
  if(p === null) return;
  if(p === ADMIN_PIN){ unlocked = true; renderOrders(); } else toast("PIN salah");
}
function kunciDaftar(){ unlocked = false; renderOrders(); }

function renderOrders(){
  const box = document.getElementById("orderBox");
  if(!unlocked){
    box.innerHTML = `<div class="lock"><p>Daftar pemesan berisi data pelanggan, jadi dikunci.</p>
      <button class="btn" onclick="bukaDaftar()">🔒 Buka (Admin)</button></div>`;
    return;
  }
  const rows = orders.map((o,i)=>`<tr>
    <td>${i+1}</td>
    <td><b>${esc(o.nama)}</b><br><small>${esc(o.jenis)} · ${esc(o.waktu)}</small></td>
    <td>${esc(o.alamat)}</td>
    <td>${esc(o.hp)}</td>
    <td>${esc(o.porsi)}</td>
    <td>${fmtTgl(o.tgl)}</td>
    <td>${esc(o.catatan || "-")}</td>
    <td><button class="mini" onclick="hapusOrder(${o.id})">Hapus</button></td></tr>`).join("");
  box.innerHTML = `<div class="ord-head">
      <span>Total pesanan: <b>${orders.length}</b></span>
      <span><button class="mini" onclick="kunciDaftar()">🔒 Kunci</button>
      <button class="mini danger" onclick="hapusSemua()">Hapus semua</button></span></div>` +
    (orders.length ? `<div class="tbl-wrap"><table>
      <thead><tr><th>No</th><th>Nama</th><th>Alamat</th><th>No HP</th><th>Porsi</th><th>Tanggal</th><th>Catatan</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table></div>` : '<div class="empty">Belum ada pesanan</div>');
}

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  t.classList.add("active");
  document.getElementById(t.dataset.tab).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}));

/* ---------- Menu ---------- */
function renderChips(){
  const cats = ["Semua",...new Set(MENU.map(m=>m.kat))];
  const el = document.getElementById("chips");
  el.innerHTML = cats.map(c=>`<button class="chip ${c===activeCat?"active":""}" data-c="${c}">${c}</button>`).join("");
  el.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{activeCat=b.dataset.c;renderChips();renderMenu();});
}
function renderMenu(){
  const q = document.getElementById("search").value.toLowerCase().trim();
  const list = MENU.filter(m=>(activeCat==="Semua"||m.kat===activeCat)&&(m.nama.toLowerCase().includes(q)||m.desc.toLowerCase().includes(q)));
  document.getElementById("menuGrid").innerHTML = list.map(m=>`
    <article class="card">
      <div class="emoji">${m.emoji}</div>
      <div class="body">
        <span class="cat">${m.kat}</span>
        <h3>${m.nama}</h3>
        <p>${m.desc}</p>
        <div class="row"><span class="price">${rp(m.harga)}</span>
        <button class="btn" onclick="addCart(${m.id})">+ Tambah</button></div>
      </div>
    </article>`).join("");
  document.getElementById("empty").style.display = list.length?"none":"block";
}
document.getElementById("search").addEventListener("input",renderMenu);

/* ---------- Katering ---------- */
function renderPaket(){
  document.getElementById("paketGrid").innerHTML = PAKET.map(p=>`
    <div class="paket ${p.pop?"pop":""}">
      ${p.pop?'<span class="tag">Terlaris</span>':""}
      <h3>${p.nama}</h3>
      <div class="harga">${rp(p.harga)}</div><small>per porsi · min. ${p.min} porsi</small>
      <ul>${p.isi.map(i=>`<li>${i}</li>`).join("")}</ul>
      <button class="btn ${p.pop?"":"ghost"}" onclick="pilihPaket('${p.id}')">Pilih Paket</button>
    </div>`).join("");
  document.getElementById("paketSelect").innerHTML = PAKET.map(p=>`<option value="${p.id}">${p.nama} – ${rp(p.harga)}</option>`).join("");
  hitungEstimasi();
}
function pilihPaket(id){
  document.getElementById("paketSelect").value = id;
  const p = PAKET.find(x=>x.id===id);
  const porsi = document.getElementById("porsi");
  if(+porsi.value < p.min) porsi.value = p.min;
  hitungEstimasi();
  document.getElementById("orderForm").scrollIntoView({behavior:"smooth"});
}
function hitungEstimasi(){
  const p = PAKET.find(x=>x.id===document.getElementById("paketSelect").value);
  const n = +document.getElementById("porsi").value||0;
  document.getElementById("estimasi").textContent = rp((p?p.harga:0)*n);
}
document.getElementById("paketSelect").addEventListener("change",hitungEstimasi);
document.getElementById("porsi").addEventListener("input",hitungEstimasi);
document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f = new FormData(e.target);
  const p = PAKET.find(x=>x.id===f.get("paket"));
  const n = +f.get("porsi");
  if(n < p.min){ toast(`Minimal ${p.min} porsi untuk ${p.nama}`); return; }
  if(!pay.form){ toast("Pilih metode pembayaran dulu"); return; }
  const pesan = [
    "*Pesanan Katering*",
    `Nama: ${f.get("nama")}`,
    `HP: ${f.get("hp")}`,
    `Paket: ${p.nama} (${rp(p.harga)})`,
    `Porsi: ${n}`,
    `Tanggal: ${f.get("tgl")}`,
    `Alamat: ${f.get("alamat")}`,
    `Catatan: ${f.get("catatan") || "-"}`,
    `Pembayaran: ${payText("form")}`,
    `*Estimasi: ${rp(p.harga*n)}*`
  ].join("\n");
  kirimWA(pesan);
  tambahOrder({jenis:"Katering", nama:f.get("nama"), alamat:f.get("alamat"), hp:f.get("hp"),
    porsi:n, tgl:f.get("tgl"), catatan:f.get("catatan"), detail:p.nama, bayar:payText("form")});
  e.target.reset(); pay.form = null; renderPay("form"); hitungEstimasi();
});

/* ---------- Keranjang ---------- */
function addCart(id){ cart[id]=(cart[id]||0)+1; updateCart(); toast("Ditambahkan ke keranjang"); }
function changeQty(id,d){ cart[id]=(cart[id]||0)+d; if(cart[id]<=0) delete cart[id]; updateCart(); }
function updateCart(){
  const ids = Object.keys(cart);
  const count = ids.reduce((s,i)=>s+cart[i],0);
  const total = ids.reduce((s,i)=>s+cart[i]*MENU.find(m=>m.id==i).harga,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = rp(total);
  document.getElementById("cartItems").innerHTML = ids.length ? ids.map(i=>{
    const m = MENU.find(x=>x.id==i);
    return `<div class="item"><span style="font-size:1.8rem">${m.emoji}</span>
      <div class="info"><b>${m.nama}</b><span>${rp(m.harga)}</span></div>
      <div class="qty"><button onclick="changeQty(${m.id},-1)">−</button><b>${cart[i]}</b><button onclick="changeQty(${m.id},1)">+</button></div></div>`;
  }).join("") : '<div class="empty">Keranjang masih kosong</div>';
}
const drawer = document.getElementById("drawer"), overlay = document.getElementById("overlay");
function openCart(o){ drawer.classList.toggle("show",o); overlay.classList.toggle("show",o); }
document.getElementById("cartBtn").onclick = ()=>openCart(true);
document.getElementById("closeCart").onclick = ()=>openCart(false);
overlay.onclick = ()=>openCart(false);
document.getElementById("checkout").onclick = ()=>{
  const ids = Object.keys(cart);
  if(!ids.length){ toast("Keranjang kosong"); return; }
  const v = id => document.getElementById(id).value.trim();
  const nama=v("cNama"), hp=v("cHp"), alamat=v("cAlamat"), tgl=v("cTgl"), catatan=v("cCatatan");
  if(!nama || !hp || !alamat || !tgl){ toast("Lengkapi nama, HP, alamat & tanggal"); return; }
  if(!pay.cart){ toast("Pilih metode pembayaran dulu"); return; }
  let total = 0, porsi = 0;
  const lines = ids.map(i=>{ const m=MENU.find(x=>x.id==i); total+=m.harga*cart[i]; porsi+=cart[i]; return `- ${m.nama} x${cart[i]} = ${rp(m.harga*cart[i])}`; });
  kirimWA([
    "*Pesanan Menu*", ...lines,
    `Nama: ${nama}`, `HP: ${hp}`, `Alamat: ${alamat}`, `Tanggal: ${tgl}`,
    `Catatan: ${catatan || "-"}`, `Pembayaran: ${payText("cart")}`,
    `*Total: ${rp(total)}*`
  ].join("\n"));
  tambahOrder({jenis:"Menu", nama, alamat, hp, porsi, tgl, catatan, detail:lines.join("; "), bayar:payText("cart")});
  cart = {}; updateCart();
  ["cNama","cHp","cAlamat","cTgl","cCatatan"].forEach(id=>document.getElementById(id).value="");
  pay.cart = null; renderPay("cart"); openCart(false);
};


/* ---------- Toast ---------- */
let tt;
function toast(t){ const el=document.getElementById("toast"); el.textContent=t; el.classList.add("show"); clearTimeout(tt); tt=setTimeout(()=>el.classList.remove("show"),1800); }

/* Init */
renderChips(); renderMenu(); renderPaket(); updateCart(); renderPay("cart"); renderPay("form"); renderOrders();