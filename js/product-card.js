export class ProductCard extends HTMLElement {
  set data(p) {
    const ok = p.active && p.stock > 0;
    this.innerHTML = `
      <div class="card">
        <h4>${p.name}</h4>
        <small>${p.category}</small>
        <p>${p.description}</p>
        <b>$${p.price.toLocaleString("es-CO")}</b>
        <p>Stock: ${p.stock}</p>
        <button class="btn-add" ${!ok ? "disabled" : ""}>
          ${ok ? "Agregar" : "Agotado"}
        </button>
      </div>
    `;

    const btn = this.querySelector(".btn-add");
    if (btn && ok) {
      btn.onclick = () => {
        this.dispatchEvent(new CustomEvent("agregar-carrito", {
          detail: { id: p.id },
          bubbles: true,
          composed: true
        }));
      };
    }
  }
}
customElements.define("product-card", ProductCard);
