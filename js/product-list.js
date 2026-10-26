import "./product-card.js";

export class ProductList extends HTMLElement {
  set productos(items) {
    this._items = items;
    this.render();
  }

  render() {
    this.innerHTML = "";
    if (!this._items || this._items.length === 0) {
      this.innerHTML = `<div class="sin-datos">No hay productos que coincidan con los filtros</div>`;
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "catalogo-grid";
    this._items.forEach(prod => {
      const card = document.createElement("product-card");
      card.data = prod;
      wrap.appendChild(card);
    });
    this.appendChild(wrap);
  }
}

customElements.define("product-list", ProductList);
