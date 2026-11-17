// Protótipo acadêmico: autenticação, pedidos e pagamentos são SIMULADOS no navegador.
const products=[
{id:1,name:'Cappuccino Clássico',desc:'Cappuccino cremoso com leite e um toque de canela.',price:12.90,cat:'Quentes',emoji:'☕'},
{id:2,name:'Espresso Duplo',desc:'Café espresso duplo, intenso e encorpado.',price:8.90,cat:'Quentes',emoji:'☕'},
{id:3,name:'Latte Macchiato',desc:'Leite vaporizado com espresso e espuma cremosa.',price:13.90,cat:'Quentes',emoji:'🥛'},
{id:4,name:'Mocha',desc:'Chocolate, espresso e leite vaporizado.',price:14.90,cat:'Quentes',emoji:'🍫'},
{id:5,name:'Café Gelado',desc:'Espresso gelado com leite e gelo.',price:15.90,cat:'Gelados',emoji:'🧋'},
{id:6,name:'Frappé de Caramelo',desc:'Bebida gelada com caramelo e chantilly.',price:18.90,cat:'Gelados',emoji:'🥤'},
{id:7,name:'Brownie',desc:'Brownie de chocolate macio e intenso.',price:11.90,cat:'Doces',emoji:'🍫'},
{id:8,name:'Cheesecake',desc:'Fatia de cheesecake com calda de frutas vermelhas.',price:17.90,cat:'Doces',emoji:'🍰'},
{id:9,name:'Pão de Queijo',desc:'Pão de queijo quentinho e crocante.',price:7.90,cat:'Salgados',emoji:'🧀'},
{id:10,name:'Croissant',desc:'Croissant amanteigado e delicado.',price:12.50,cat:'Salgados',emoji:'🥐'}];
const storage=(key,def)=>{try{return JSON.parse(localStorage.getItem('cafe_'+key))??def}catch{return def}};
let cart=storage('cart',{}),orders=storage('orders',[]),user=storage('user',null),page='home',category='Todos',search='',currentOrder=null;
const save=(k,v)=>localStorage.setItem('cafe_'+k,JSON.stringify(v));
const money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const content=()=>document.getElementById('content');
const subtotal=()=>Object.entries(cart).reduce((s,[id,n])=>s+(products.find(p=>p.id==id)?.price||0)*n,0);
const quantity=()=>Object.values(cart).reduce((s,n)=>s+n,0);
function toast(msg){let e=document.getElementById('toast');e.textContent=msg;e.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>e.classList.remove('show'),2300)}
function updateHeader(){document.getElementById('cart-count').textContent=quantity();document.getElementById('account-button').textContent=user?'Olá, '+user.name.split(' ')[0]:'Entrar';document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('selected',b.dataset.page===page))}
function go(p){page=p;window.scrollTo(0,0);render()}
function add(id){cart[id]=(cart[id]||0)+1;save('cart',cart);updateHeader();toast('Produto adicionado ao carrinho!')}
function changeQty(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];save('cart',cart);render()}
function productCard(p){return `<article class="product"><div class="product-art">${p.emoji}</div><div class="product-body"><h3>${esc(p.name)}</h3><p class="muted">${esc(p.desc)}</p><div class="product-footer"><span class="price">${money(p.price)}</span><button class="add" onclick="add(${p.id})" aria-label="Adicionar ${esc(p.name)}">+</button></div></div></article>`}
function categories(){return `<div class="categories">${['Todos','Quentes','Gelados','Doces','Salgados'].map(c=>`<button class="chip ${category===c?'active':''}" onclick="category='${c}';go('catalog')">${c}</button>`).join('')}</div>`}
function home(){content().innerHTML=`<section class="hero"><div class="hero-copy"><div>✦ FEITO COM CARINHO</div><h1>Um café especial para cada momento.</h1><p>Seu pedido favorito, preparado com afeto e entregue até você.</p><button class="primary" onclick="go('catalog')">Explorar cardápio →</button></div><div class="hero-art">☕</div></section><div class="section-head"><h2>Nossas categorias</h2><button class="link" onclick="go('catalog')">Ver todas</button></div>${categories()}<div class="section-head"><h2>Mais pedidos</h2><button class="link" onclick="go('catalog')">Ver cardápio →</button></div><div class="grid">${products.slice(0,6).map(productCard).join('')}</div>`}
function catalog(){const items=products.filter(p=>(category==='Todos'||p.cat===category)&&(p.name+' '+p.desc).toLowerCase().includes(search.toLowerCase()));content().innerHTML=`<h2>Nosso cardápio</h2><p class="muted">Escolha seus favoritos e monte seu pedido.</p><input class="search" placeholder="🔎 Buscar cafés, bebidas, doces..." value="${esc(search)}" oninput="search=this.value;refreshProducts()">${categories()}<div class="section-head"><h2>Produtos <span class="muted" id="result-count">(${items.length})</span></h2></div><div class="grid" id="products-grid">${items.map(productCard).join('')||'<p>Nenhum produto encontrado.</p>'}</div>`}
function refreshProducts(){const items=products.filter(p=>(category==='Todos'||p.cat===category)&&(p.name+' '+p.desc).toLowerCase().includes(search.toLowerCase()));document.getElementById('products-grid').innerHTML=items.map(productCard).join('')||'<p>Nenhum produto encontrado.</p>';document.getElementById('result-count').textContent=`(${items.length})`}
function cartView(){if(!quantity()){content().innerHTML=`<div class="empty"><div class="symbol">🛒</div><h2>Seu carrinho está vazio</h2><p class="muted">Que tal escolher um café?</p><button class="primary" onclick="go('catalog')">Ver cardápio</button></div>`;return}content().innerHTML=`<h2>Meu carrinho</h2><div class="two-col"><div class="panel">${Object.entries(cart).map(([id,n])=>{let p=products.find(p=>p.id==id);return `<div class="cart-line"><div class="cart-emoji">${p.emoji}</div><div class="cart-info"><b>${esc(p.name)}</b><span class="muted">${money(p.price)} cada · ${money(p.price*n)} no total</span></div><div class="qty"><button onclick="changeQty(${id},-1)">−</button><strong aria-label="Quantidade ${n}">${n}</strong><button onclick="changeQty(${id},1)">+</button></div></div>`}).join('')}</div><div class="panel"><h2>Resumo do pedido</h2><div class="summary-row"><span>Subtotal</span><b>${money(subtotal())}</b></div><div class="summary-row"><span>Taxa de entrega</span><b>${money(6)}</b></div><div class="summary-row total"><span>Total</span><span>${money(subtotal()+6)}</span></div><button class="primary full" onclick="go('checkout')">Finalizar pedido →</button></div></div>`}
// Contas demonstrativas por navegador: não armazena senhas nem autentica usuários de verdade.
const demoAccounts=()=>storage('accounts',[]);
const emailKey=s=>String(s||'').trim().toLowerCase();
function login(){
 const signed=!!user;
 content().innerHTML=`<div class="panel" style="max-width:500px;margin:35px auto"><div style="text-align:center;font-size:45px">☕</div><h2 style="text-align:center">${signed?'Minha conta':'Acesse sua conta'}</h2>
 ${signed?`<p>Olá, <b>${esc(user.name)}</b>!</p><p class="muted">${esc(user.email)}</p><button class="secondary full" onclick="go('profile')">Editar meus dados</button><button class="primary full" onclick="go('orders')">Meus pedidos</button><button class="secondary full" onclick="logout()">Sair da conta</button>`:
 `<div class="auth-tabs"><button class="chip active" onclick="go('login')">Entrar</button><button class="chip" onclick="go('register')">Criar conta</button><button class="chip" onclick="go('recover')">Esqueci a senha</button></div>
 <form onsubmit="event.preventDefault();loginSubmit(this)"><div class="form-group"><label>E-mail</label><input name="email" type="email" required autocomplete="email"></div><div class="form-group"><label>Senha demonstrativa</label><input name="password" type="password" minlength="6" required autocomplete="off"></div><button class="primary full">Entrar</button></form>
 <div class="notice">Demonstração acadêmica: a senha não é salva nem validada. Use apenas dados fictícios.</div>`}</div>`;
}
function register(){
 content().innerHTML=`<div class="panel auth-panel"><h2>Criar conta demonstrativa</h2><p class="muted">Cadastros disponíveis apenas neste navegador. Não utilize dados pessoais reais.</p><form onsubmit="event.preventDefault();registerSubmit(this)">
 <div class="form-group"><label>Nome completo</label><input name="name" minlength="3" maxlength="80" required></div>
 <div class="form-group"><label>E-mail</label><input name="email" type="email" required></div>
 <div class="form-group"><label>Senha demonstrativa (mínimo 6 caracteres)</label><input name="password" type="password" minlength="6" required autocomplete="off"></div>
 <div class="form-group"><label>Confirmar senha</label><input name="confirm" type="password" minlength="6" required autocomplete="off"></div>
 <button class="primary full">Cadastrar</button></form><button class="secondary full" onclick="go('login')">Voltar ao login</button>
 <div class="notice">A senha não é armazenada. Este cadastro serve somente para simular a experiência.</div></div>`;
}
function registerSubmit(f){
 const name=f.elements.name.value.trim(),email=emailKey(f.elements.email.value);
 if(name.length<3){toast('Informe um nome com pelo menos 3 caracteres.');return}
 if(f.elements.password.value!==f.elements.confirm.value){toast('As senhas não coincidem.');return}
 const accounts=demoAccounts();
 if(accounts.some(a=>a.email===email)){toast('E-mail já cadastrado neste navegador.');return}
 accounts.push({name,email});save('accounts',accounts);user={name,email};save('user',user);
 toast('Cadastro demonstrativo criado!');go('home');
}
function loginSubmit(f){
 const email=emailKey(f.elements.email.value),account=demoAccounts().find(a=>a.email===email);
 if(!account){toast('Conta não encontrada neste navegador. Cadastre-se primeiro.');return}
 user={name:account.name,email:account.email};save('user',user);
 toast('Acesso demonstrativo realizado!');go('home');
}
function recover(){
 content().innerHTML=`<div class="panel auth-panel"><h2>Recuperar acesso</h2><p class="muted">Simulação de recuperação de senha.</p>
 <form onsubmit="event.preventDefault();recoverSubmit(this)"><div class="form-group"><label>E-mail cadastrado</label><input type="email" name="email" required></div><button class="primary full">Verificar e-mail</button></form>
 <div class="notice">Não enviamos e-mails nem redefinimos senhas reais. Nenhuma senha é armazenada neste protótipo.</div><button class="secondary full" onclick="go('login')">Voltar</button></div>`;
}
function recoverSubmit(f){
 const found=demoAccounts().some(a=>a.email===emailKey(f.elements.email.value));
 toast(found?'Conta demonstrativa localizada. Faça login com uma senha fictícia.':'E-mail não cadastrado neste navegador.');
}
function profile(){
 if(!user){go('login');return}
 content().innerHTML=`<div class="panel auth-panel"><h2>Editar meus dados</h2><form onsubmit="event.preventDefault();profileSubmit(this)">
 <div class="form-group"><label>Nome</label><input name="name" required minlength="3" value="${esc(user.name)}"></div>
 <div class="form-group"><label>E-mail</label><input name="email" type="email" required value="${esc(user.email)}"></div>
 <button class="primary full">Salvar alterações</button></form>
 <p class="muted">A alteração de senha real não está disponível nesta demonstração.</p><button class="secondary full" onclick="go('login')">Voltar à conta</button></div>`;
}
function profileSubmit(f){
 const name=f.elements.name.value.trim(),email=emailKey(f.elements.email.value);
 if(name.length<3){toast('Nome muito curto.');return}
 const accounts=demoAccounts();
 if(accounts.some(a=>a.email===email&&a.email!==user.email)){toast('E-mail já usado neste navegador.');return}
 const old=user.email;
 const index=accounts.findIndex(a=>a.email===old);
 if(index>=0)accounts[index]={name,email};else accounts.push({name,email});
 save('accounts',accounts);
 orders.forEach(o=>{if(o.customer===old)o.customer=email});save('orders',orders);
 user={name,email};save('user',user);toast('Dados atualizados!');go('login');
}
function logout(){user=null;save('user',null);go('login')}
function checkout(){if(!quantity()){go('cart');return}if(!user){toast('Entre para continuar o pedido.');go('login');return}content().innerHTML=`<h2>Finalizar pedido</h2><div class="two-col"><form class="panel" onsubmit="event.preventDefault();finish(this)"><h2>Endereço de entrega</h2><div class="form-group"><label>Rua / Avenida</label><input name="street" required placeholder="Ex.: Rua das Flores"></div><div class="form-group"><label>Número</label><input name="number" required placeholder="Ex.: 100"></div><div class="form-group"><label>Bairro</label><input name="district" required placeholder="Ex.: Asa Norte"></div><div class="form-group"><label>Complemento (opcional)</label><input name="complement" placeholder="Apartamento, bloco..."></div><div class="form-group"><label>Forma de pagamento</label><label class="radio-card"><input type="radio" name="payment" value="PIX" checked> PIX</label><label class="radio-card"><input type="radio" name="payment" value="Cartão de crédito"> Cartão de crédito</label><label class="radio-card"><input type="radio" name="payment" value="Cartão de débito"> Cartão de débito</label><label class="radio-card"><input type="radio" name="payment" value="Dinheiro"> Dinheiro</label></div><div class="notice">Pagamento fictício para demonstração. Nenhuma cobrança será realizada.</div><button class="primary full">Confirmar pedido demonstrativo</button></form><aside class="panel"><h2>Resumo</h2>${Object.entries(cart).map(([id,n])=>{let p=products.find(p=>p.id==id);return `<div class="summary-row"><span>${n}× ${esc(p.name)}</span><b>${money(p.price*n)}</b></div>`}).join('')}<div class="summary-row"><span>Entrega</span><b>${money(6)}</b></div><div class="summary-row total"><span>Total</span><span>${money(subtotal()+6)}</span></div></aside></div>`}
function finish(f){const order={id:Date.now(),created:new Date().toISOString(),customer:user.email,items:Object.entries(cart).map(([id,n])=>({id:Number(id),n})),total:subtotal()+6,payment:f.payment.value,address:[f.street.value,f.number.value,f.district.value,f.complement.value].filter(Boolean).join(', ')};orders.unshift(order);save('orders',orders);cart={};save('cart',cart);currentOrder=order.id;toast('Pedido demonstrativo confirmado!');go('tracking')}
function ordersView(){let mine=orders.filter(o=>user&&o.customer===user.email);content().innerHTML=`<h2>Meus pedidos</h2>${!user?`<div class="empty"><p>Entre na sua conta para ver os pedidos.</p><button class="primary" onclick="go('login')">Entrar</button></div>`:!mine.length?`<div class="empty"><div class="symbol">📦</div><h2>Nenhum pedido ainda</h2><button class="primary" onclick="go('catalog')">Fazer primeiro pedido</button></div>`:`<div class="panel">${mine.map(o=>`<div class="order"><div class="order-head"><div><b>Pedido #${String(o.id).slice(-6)}</b><div class="muted">${new Date(o.created).toLocaleString('pt-BR')}</div></div><span class="status">Acompanhamento ilustrativo</span></div><p>${o.items.map(i=>i.n+'× '+products.find(p=>p.id===i.id)?.name).join(', ')}</p><div class="order-head"><b>${money(o.total)}</b><button class="secondary" onclick="currentOrder=${o.id};go('tracking')">Acompanhar pedido</button></div></div>`).join('')}</div>`}`}
function tracking(){let o=orders.find(o=>o.id===currentOrder);if(!o){go('orders');return}content().innerHTML=`<h2>Rastreamento do pedido</h2><div class="panel" style="max-width:700px"><div class="order-head"><div><b>Pedido #${String(o.id).slice(-6)}</b><p class="muted">${esc(o.address)}</p></div><span class="status">Demonstração</span></div><div class="notice">Acompanhamento ilustrativo: apenas o recebimento do pedido é registrado; os demais status não são atualizados em tempo real.</div><div class="timeline"><div class="step done"><b>Pedido recebido ✓</b><p class="muted">${new Date(o.created).toLocaleString('pt-BR')}</p></div><div class="step"><b>Em preparação</b><p class="muted">Aguardando atualização</p></div><div class="step"><b>Saiu para entrega</b></div><div class="step"><b>Entregue</b></div></div><div class="summary-row"><span>Pagamento simulado</span><b>${esc(o.payment)}</b></div><div class="summary-row"><span>Total</span><b>${money(o.total)}</b></div><button class="primary full" onclick="go('orders')">Voltar aos pedidos</button></div>`}
function render(){updateHeader();({home,catalog,cart:cartView,login,checkout,orders:ordersView,tracking,register,recover,profile}[page]||home)()}
render();
