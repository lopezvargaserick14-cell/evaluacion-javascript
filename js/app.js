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
  let subtotal = 0;
  let totalUnits = 0;
  let items = [];

  for (let c of cart) {
    let p = prods.find(x => x.id === c.id);
    if (p && p.active && p.stock > 0) {
      if (c.cantidad > p.stock) c.cantidad = p.stock;
      subtotal += p.price * c.cantidad;
      totalUnits += c.cantidad;
      items.push({ ...p, cantidad: c.cantidad });
    }
  }

  save();

  let descuento = 0;
  if (subtotal >= 300000) {
    descuento = subtotal * 0.1;
  }

  unitsEl.textContent = totalUnits;
  cartEl.info = { items, subtotal, descuento, total: subtotal - descuento };
}

function filter() {
  let res = prods;
  let txt = search.value.toLowerCase();

  if (txt) {
    res = res.filter(p => p.name.toLowerCase().includes(txt) || p.description.toLowerCase().includes(txt));
  }
  if (fCat.value !== "todas") {
    res = res.filter(p => p.category === fCat.value);
  }
  if (fDisp.checked) {
    res = res.filter(p => p.active && p.stock > 0);
  }

  if (fOrd.value === "precio-menor") res.sort((a, b) => a.price - b.price);
  if (fOrd.value === "precio-mayor") res.sort((a, b) => b.price - a.price);
  if (fOrd.value === "nombre-az") res.sort((a, b) => a.name.localeCompare(b.name));

  list.productos = res;
}

search.oninput = filter;
fCat.onchange = filter;
fOrd.onchange = filter;
fDisp.onchange = filter;

bClear.onclick = () => {
  search.value = "";
  fCat.value = "todas";
  fOrd.value = "";
  fDisp.checked = false;
  filter();
};

document.addEventListener("agregar-carrito", e => {
  let p = prods.find(x => x.id === e.detail.id);
  if (!p || !p.active || p.stock <= 0) {
    alert("Producto no disponible");
    return;
  }

  let item = cart.find(x => x.id === p.id);
  if (item) {
    if (item.cantidad >= p.stock) {
      alert("No hay suficiente stock");
      return;
    }
    item.cantidad++;
  } else {
    cart.push({ id: p.id, cantidad: 1 });
  }
  updateCart();
});

document.addEventListener("cambiar-cantidad", e => {
  let p = prods.find(x => x.id === e.detail.id);
  let item = cart.find(x => x.id === e.detail.id);
  if (!item || !p) return;

  let nueva = item.cantidad + e.detail.delta;
  if (nueva < 1) return;
  if (nueva > p.stock) {
    alert("Supera el stock");
    return;
  }

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

document.addEventListener("confirmar-pedido", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }
});

async function init() {
  msgEl.textContent = "Cargando catálogo...";
  try {
    prods = await getProductos();
    msgEl.textContent = "";

    prods.forEach(p => {
      if (!fCat.innerHTML.includes(p.category)) {
        fCat.innerHTML += `<option value="${p.category}">${p.category}</option>`;
      }
    });

    updateCart();
    filter();
  } catch (err) {
    msgEl.textContent = "Error al cargar catálogo";
  }
}

init();