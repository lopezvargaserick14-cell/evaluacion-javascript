export class ShoppingCart extends HTMLElement {
  set info({ items, subtotal, descuento, total }) {
    if (!items.length) {
      this.innerHTML = "<h3>Carrito</h3><p>Vacío</p>";
      return;
    }

    const fmt = n => "$" + n.toLocaleString("es-CO");
    let html = items.map(i => `
      <div class="item-cart">
        <span>${i.name} (${fmt(i.price)}) x ${i.cantidad}</span>
        <div>
          <button class="b-restar" data-id="${i.id}">-</button>
          <button class="b-sumar" data-id="${i.id}">+</button>
          <button class="b-del" data-id="${i.id}">x</button>
        </div>
      </div>
    `).join("");

    this.innerHTML = `
      <h3>Carrito</h3>
      ${html}
      <hr>
      <p>Subtotal: ${fmt(subtotal)}</p>
      <p>Descuento: ${fmt(descuento)}</p>
      <h4>Total: ${fmt(total)}</h4>
      <button id="b-vaciar">Vaciar</button>
      <button id="b-confirmar">Comprar</button>
    `;

    this.querySelectorAll(".b-sumar").forEach(b => {
      b.onclick = () => this.emit("cambiar-cantidad", { id: +b.dataset.id, delta: 1 });
    });
    this.querySelectorAll(".b-restar").forEach(b => {
      b.onclick = () => this.emit("cambiar-cantidad", { id: +b.dataset.id, delta: -1 });
    });
    this.querySelectorAll(".b-del").forEach(b => {
      b.onclick = () => this.emit("eliminar-item", { id: +b.dataset.id });
    });
    this.querySelector("#b-vaciar").onclick = () => this.emit("vaciar-carrito");
    this.querySelector("#b-confirmar").onclick = () => this.emit("confirmar-pedido");
  }

  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}
customElements.define("shopping-cart", ShoppingCart);
