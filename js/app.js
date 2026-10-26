import { getProductos } from "./api.js";
import "./product-list.js";
import "./carrito.js";

let prods = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const list = document.querySelector("#lista-productos");
const cartEl = document.querySelector("#carrito-compras");
const unitsEl = document.querySelector("#totalUnidades");
const msgEl = document.querySelector("#mensajeEstado");

const search = document.querySelector("#buscador");
const fCat = document.querySelector("#filtroCategoria");
const fOrd = document.querySelector("#filtroOrden");
const fDisp = document.querySelector("#checkDisponibles");
const bClear = document.querySelector("#btnLimpiar");

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  const items = [];
  let subtotal = 0;
  let totalUnits = 0;

  cart = cart.filter(c => {
    const p = prods.find(x => x.id === c.id);
    if (!p || !p.active || p.stock <= 0) return false;
    if (c.cantidad > p.stock) c.cantidad = p.stock;
    subtotal += p.price * c.cantidad;
    totalUnits += c.cantidad;
    items.push({ ...p, cantidad: c.cantidad });
    return true;
  });

  save();
  const descuento = subtotal >= 300000 ? subtotal * 0.1 : 0;
  unitsEl.textContent = totalUnits;
  cartEl.info = { items, subtotal, descuento, total: subtotal - descuento };
}

function filter() {
  let res = [...prods];
  const q = search.value.toLowerCase().trim();
  if (q) res = res.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  if (fCat.value && fCat.value !== "todas") res = res.filter(p => p.category === fCat.value);
  if (fDisp.checked) res = res.filter(p => p.active && p.stock > 0);

  if (fOrd.value === "precio-menor") res.sort((a, b) => a.price - b.price);
  if (fOrd.value === "precio-mayor") res.sort((a, b) => b.price - a.price);
  if (fOrd.value === "nombre-az") res.sort((a, b) => a.name.localeCompare(b.name));

  list.productos = res;
}

[search, fCat, fOrd, fDisp].forEach(el => el.oninput = el.onchange = filter);

bClear.onclick = () => {
  search.value = "";
  fCat.value = "todas";
  fOrd.value = "";
  fDisp.checked = false;
  filter();
};

document.addEventListener("agregar-carrito", e => {
  const p = prods.find(x => x.id === e.detail.id);
  if (!p || !p.active || p.stock <= 0) return alert("Producto no disponible");
  const item = cart.find(x => x.id === p.id);
  if (item) {
    if (item.cantidad + 1 > p.stock) return alert("Supera el inventario");
    item.cantidad++;
  } else {
    cart.push({ id: p.id, cantidad: 1 });
  }
  updateCart();
});

document.addEventListener("cambiar-cantidad", e => {
  const { id, delta } = e.detail;
  const p = prods.find(x => x.id === id);
  const item = cart.find(x => x.id === id);
  if (!p || !item) return;
  const nueva = item.cantidad + delta;
  if (nueva < 1) return alert("Cantidad mínima: 1");
  if (nueva > p.stock) return alert("Stock superado");
  item.cantidad = nueva;
  updateCart();
});

document.addEventListener("eliminar-item", e => {
  cart = cart.filter(x => x.id !== e.detail.id);
  updateCart();
});

document.addEventListener("vaciar-carrito", () => {
  cart = [];
  updateCart();
});


async function init() {
  msgEl.textContent = "Cargando catálogo...";
  try {
    prods = await getProductos();
    msgEl.textContent = "";
    const cats = [...new Set(prods.map(p => p.category))];
    cats.forEach(c => fCat.innerHTML += `<option value="${c}">${c}</option>`);
    updateCart();
    filter();
  } catch (err) {
    msgEl.textContent = "Error al cargar catálogo";
  }
}

init();