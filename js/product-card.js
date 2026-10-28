export class ProductCard extends HTMLElement {
  set data(p) {
    if (!p) return;
    const { id, name, category, description, price, stock, active } = p;
    const ok = active && stock > 0 && id > 0;

    this.innerHTML = `
      <div class="card">
        <h4>${name}</h4>
        <small>${category}</small>
        <p>${description}</p>
        <b>$${price.toLocaleString("es-CO")}</b>
        <p>Stock: ${stock}</p>
        <button class="btn-add" ${!ok ? "disabled" : ""}>
          ${ok ? "Agregar" : "Agotado"}
        </button>
      </div>
    `;

    const btn = this.querySelector(".btn-add");
    if (btn && ok) {
      btn.onclick = () => {
        this.dispatchEvent(new CustomEvent("agregar-carrito", {
          detail: { id },
          bubbles: true,
          composed: true
        }));
      };
    }
  }
}
customElements.define("product-card", ProductCard);
