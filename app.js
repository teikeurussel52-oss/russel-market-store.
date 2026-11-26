const PRODUCTS = [
  {id:1,name:"Écouteurs sans fil",category:"Électronique",price:29.90,emoji:"🎧",description:"Un son clair au quotidien"},
  {id:2,name:"Montre connectée",category:"Électronique",price:49.90,emoji:"⌚",description:"Gardez le rythme avec style"},
  {id:3,name:"Lampe design",category:"Maison",price:24.50,emoji:"💡",description:"Une touche chaleureuse chez vous"},
  {id:4,name:"Sac élégant",category:"Mode",price:34.90,emoji:"👜",description:"Pratique et facile à assortir"},
  {id:5,name:"Lunettes de soleil",category:"Accessoires",price:19.90,emoji:"🕶️",description:"Un style affirmé en toute saison"},
  {id:6,name:"Enceinte Bluetooth",category:"Électronique",price:39.90,emoji:"🔊",description:"Votre musique vous accompagne"},
  {id:7,name:"Coussin décoratif",category:"Maison",price:14.90,emoji:"🛋️",description:"Confort et décoration réunis"},
  {id:8,name:"Sneakers urbaines",category:"Mode",price:54.90,emoji:"👟",description:"Le confort au quotidien"}
];
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n);
const safeRead = (key,fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
let cart = safeRead("rms_cart",[]);
let orders = safeRead("rms_orders",[]);
let projects = safeRead("rms_projects",[
  {id:1,name:"Développement de la boutique",description:"Amélioration de l'expérience en ligne.",progress:75},
  {id:2,name:"Sélection de produits",description:"Préparation des prochaines références.",progress:45},
  {id:3,name:"Service client",description:"Mise en place des informations utiles.",progress:30}
]);
let activeCategory="Tous";
function persist(){localStorage.setItem("rms_cart",JSON.stringify(cart));localStorage.setItem("rms_orders",JSON.stringify(orders));localStorage.setItem("rms_projects",JSON.stringify(projects));}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400);}
function renderProducts(){
 const q=$("#searchInput").value.trim().toLocaleLowerCase("fr");
 const list=PRODUCTS.filter(p=>(activeCategory==="Tous"||p.category===activeCategory)&&(p.name+" "+p.description+" "+p.category).toLocaleLowerCase("fr").includes(q));
 $("#productGrid").innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-visual"><span class="product-category">${p.category}</span><span aria-hidden="true">${p.emoji}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><button class="add-button" data-add="${p.id}" aria-label="Ajouter ${p.name} au panier">+</button></div></div></article>`).join(""):`<div class="no-results">Aucun produit ne correspond à votre recherche.</div>`;
}
function renderCart(){
 const count=cart.reduce((n,x)=>n+x.qty,0);$("#cartCount").textContent=count;
 $("#cartItems").innerHTML=cart.length?cart.map(item=>{const p=PRODUCTS.find(x=>x.id===item.id);if(!p)return "";return `<div class="cart-item"><div class="cart-emoji">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)} / unité</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Diminuer">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Augmenter">+</button></div></div><button class="remove-item" data-remove="${p.id}">Retirer</button></div>`}).join(""):`<div class="empty-cart">Votre panier est vide.<br>Ajoutez un produit pour commencer.</div>`;
 $("#cartTotal").textContent=money(cart.reduce((sum,item)=>sum+(PRODUCTS.find(p=>p.id===item.id)?.price||0)*item.qty,0));
}
function renderProjects(){
 $("#projectGrid").innerHTML=projects.length?projects.map(p=>`<article class="project-card"><div class="project-top"><h3>${escapeHTML(p.name)}</h3><span class="project-status">${p.progress===100?"Terminé":p.progress>0?"En cours":"À venir"}</span></div><p>${escapeHTML(p.description||"Aucune description.")}</p><div class="progress-meta"><span>Progression</span><strong>${p.progress}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${p.progress}%"></div></div><div class="project-actions"><button data-progress="${p.id}">+10 %</button><button data-delete-project="${p.id}">Supprimer</button></div></article>`).join(""):`<div class="no-results">Aucun projet pour le moment.</div>`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function openCart(){ $("#cartDrawer").classList.add("open");$("#overlay").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow="";}
$("#productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add),found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});persist();renderCart();toast("Produit ajouté au panier.");});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("#searchInput").addEventListener("input",renderProducts);
$("#cartOpen").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
$("#cartItems").addEventListener("click",e=>{
 const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");
 if(q){const id=Number(q.dataset.qty),item=cart.find(x=>x.id===id);if(item){item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==id);}}
 if(r)cart=cart.filter(x=>x.id!==Number(r.dataset.remove));persist();renderCart();
});
$("#checkout").addEventListener("click",()=>{
 if(!cart.length){toast("Votre panier est vide.");return;}
 const id="RMS-"+Math.floor(100000+Math.random()*900000);
 const total=cart.reduce((sum,item)=>sum+(PRODUCTS.find(p=>p.id===item.id)?.price||0)*item.qty,0);
 orders.unshift({id,total,date:new Date().toISOString(),status:"Commande enregistrée",items:cart.map(x=>({...x}))});
 cart=[];persist();renderCart();closeCart();
 $("#trackingNumber").value=id;$("#trackingResult").className="tracking-result success";$("#trackingResult").innerHTML=`<strong>Commande ${id} créée en mode démonstration.</strong><br>Total : ${money(total)}. Aucun paiement n'a été réalisé.`;
 $("#suivi").scrollIntoView({behavior:"smooth"});toast("Commande de démonstration créée.");
});
$("#trackingForm").addEventListener("submit",e=>{
 e.preventDefault();const id=$("#trackingNumber").value.trim().toUpperCase();const order=orders.find(o=>o.id===id);
 const el=$("#trackingResult");
 if(order){const date=new Date(order.date).toLocaleDateString("fr-FR");el.className="tracking-result success";el.innerHTML=`<strong>${order.id} — ${order.status}</strong><br>Commande enregistrée le ${date}. Total indicatif : ${money(order.total)}.<br><small>Cette référence existe uniquement dans ce navigateur. Ce suivi n'est pas connecté à un transporteur.</small>`;}
 else{el.className="tracking-result error";el.textContent="Référence introuvable sur cet appareil. Vérifiez le numéro ou utilisez le navigateur sur lequel la commande de démonstration a été créée.";}
});
$("#addProject").addEventListener("click",()=>{$("#projectForm").reset();$("#progressValue").value="0%";$("#progressValue").textContent="0%";$("#projectDialog").showModal();});
$("#projectProgress").addEventListener("input",e=>{$("#progressValue").value=e.target.value+"%";$("#progressValue").textContent=e.target.value+"%";});
$("#projectForm").addEventListener("submit",e=>{
 if(e.submitter?.value!=="save")return;e.preventDefault();
 const name=$("#projectName").value.trim();if(!name)return;
 projects.unshift({id:Date.now(),name,description:$("#projectDescription").value.trim(),progress:Number($("#projectProgress").value)});
 persist();renderProjects();$("#projectDialog").close();toast("Projet ajouté.");
});
$("#projectGrid").addEventListener("click",e=>{
 const p=e.target.closest("[data-progress]"),d=e.target.closest("[data-delete-project]");
 if(p){const item=projects.find(x=>x.id===Number(p.dataset.progress));if(item)item.progress=Math.min(100,item.progress+10);}
 if(d)projects=projects.filter(x=>x.id!==Number(d.dataset.deleteProject));
 persist();renderProjects();
});
$("#menuToggle").addEventListener("click",()=>{const nav=$("#mainNav"),open=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
$("#mainNav").addEventListener("click",e=>{if(e.target.closest("a")){$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}});
$("#year").textContent=new Date().getFullYear();
// Remplacez cette adresse par votre véritable adresse e-mail avant publication.
$("#contactLink").href="mailto:contact@exemple.com?subject=Contact%20Russel%20Market%20Store";
renderProducts();renderCart();renderProjects();
