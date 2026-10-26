export class ProductCard extends HTMLElement {
  set data(prod) {
    this._prod = prod;
    this.render();
  }

  get data() {
    return this._prod;
  }

  render() {
    const p = this._prod;
    if (!p) return;
    const ok = p.active && p.stock > 0;
    const precioFmt = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(p.price);

    this.innerHTML = `
      <div class="card ${!ok ? 'agotado' : ''}">
        <h3>${p.name}</h3>
        <span class="badge">${p.category}</span>
        <p class="desc">${p.description}</p>
        <p class="precio">${precioFmt}</p>
        <p class="stock">Disponibles: ${p.stock}</p>
        <button class="btn-add" ${!ok ? 'disabled' : ''}>
          ${ok ? 'Agregar al carrito' : 'No disponible'}
        </button>
      </div>
    `;

    const btn = this.querySelector(".btn-add");
    if (btn && ok) {
      btn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("agregar-carrito", {
          detail: { id: p.id },
          bubbles: true,
          composed: true
        }));
      });
    }
  }
}

customElements.define("product-card", ProductCard);
