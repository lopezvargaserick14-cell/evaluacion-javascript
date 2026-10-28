import { getProductos } from "./api.js";
import "./product-list.js";
import "./carrito.js";

let prods = [];

function getStoredCart() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => {
      if (!item || typeof item !== "object") return false;
      const { id, cantidad } = item;
      return typeof id === "number" && id > 0 && typeof cantidad === "number" && cantidad >= 1;
    });
  } catch {
    return [];
  }
}

let cart = getStoredCart();

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
    const { id, cantidad } = c;
    let p = prods.find(x => x.id === id);
    if (p) {
      const { price, stock, active } = p;
      if (active && stock > 0) {
        if (c.cantidad > stock) c.cantidad = stock;
        subtotal += price * c.cantidad;
        totalUnits += c.cantidad;
        items.push({ ...p, cantidad: c.cantidad });
      }
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
  const txt = search.value.toLowerCase().trim();

  if (txt) {
    res = res.filter(({ name, description }) => 
      name.toLowerCase().includes(txt) || description.toLowerCase().includes(txt)
    );
  }
  if (fCat.value !== "todas") {
    res = res.filter(({ category }) => category === fCat.value);
  }
  if (fDisp.checked) {
    res = res.filter(({ active, stock }) => active && stock > 0);
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

document.addEventListener("agregar-carrito", ({ detail: { id } }) => {
  if (typeof id !== "number" || id <= 0) return;

  let p = prods.find(x => x.id === id);
  if (!p || !p.active || p.stock <= 0) {
    alert("Producto no disponible");
    return;
  }

  let item = cart.find(x => x.id === id);
  if (item) {
    if (item.cantidad >= p.stock) {
      alert("No hay suficiente stock disponible");
      return;
    }
    item.cantidad++;
  } else {
    cart.push({ id, cantidad: 1 });
  }
  updateCart();
});

document.addEventListener("cambiar-cantidad", ({ detail: { id, delta } }) => {
  if (typeof id !== "number" || id <= 0) return;

  let p = prods.find(x => x.id === id);
  let item = cart.find(x => x.id === id);
  if (!item || !p) return;

  let nueva = item.cantidad + delta;
  if (nueva < 1) return;
  if (nueva > p.stock) {
    alert("Supera el stock disponible");
    return;
  }

  item.cantidad = nueva;
  updateCart();
});

document.addEventListener("eliminar-item", ({ detail: { id } }) => {
  cart = cart.filter(x => x.id !== id);
  updateCart();
});

document.addEventListener("vaciar-carrito", () => {
  cart = [];
  updateCart();
});

document.addEventListener("confirmar-pedido", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de comprar.");
    return;
  }

  let valido = true;
  for (let c of cart) {
    let p = prods.find(x => x.id === c.id);
    if (!p || !p.active || p.stock <= 0) {
      valido = false;
      break;
    }
  }

  if (!valido) {
    alert("Algunos productos del carrito ya no están disponibles.");
    updateCart();
    return;
  }

  const idPedido = "TECNO-" + Date.now().toString(36).toUpperCase();

  let subtotal = 0;
  let resumenLineas = "";
  for (let c of cart) {
    let p = prods.find(x => x.id === c.id);
    const totalLinea = p.price * c.cantidad;
    subtotal += totalLinea;
    resumenLineas += `• ${p.name} x${c.cantidad} ($${totalLinea.toLocaleString("es-CO")})\n`;
  }

  let descuento = subtotal >= 300000 ? subtotal * 0.1 : 0;
  let total = subtotal - descuento;

  alert(
    `✅ ¡PEDIDO CONFIRMADO!\n\n` +
    `N° de Pedido: ${idPedido}\n\n` +
    `Resumen:\n${resumenLineas}\n` +
    `Subtotal: $${subtotal.toLocaleString("es-CO")}\n` +
    `Descuento: $${descuento.toLocaleString("es-CO")}\n` +
    `Total a Pagar: $${total.toLocaleString("es-CO")}\n\n` +
    `(Simulación de compra local completada con éxito)`
  );
  cart = [];
  updateCart();
});

async function init() {
  msgEl.textContent = "Cargando catálogo...";
  try {
    prods = await getProductos();
    msgEl.textContent = "";

    if (!prods.length) {
      msgEl.textContent = "No hay productos disponibles en el catálogo.";
      return;
    }

    prods.forEach(({ category }) => {
      if (!fCat.innerHTML.includes(category)) {
        fCat.innerHTML += `<option value="${category}">${category}</option>`;
      }
    });

    updateCart();
    filter();
  } catch (err) {
    msgEl.textContent = "Error al cargar catálogo. Intente de nuevo más tarde.";
  }
}

init();