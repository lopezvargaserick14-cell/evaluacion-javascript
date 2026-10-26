import "./product-card.js";

export class ProductList extends HTMLElement {
  set productos(lista) {
    this.innerHTML = "";
    if (!lista || !lista.length) {
      this.innerHTML = "<p>No hay productos</p>";
      return;
    }
    lista.forEach(p => {
      const card = document.createElement("product-card");
      card.data = p;
      this.appendChild(card);
    });
  }
}
customElements.define("product-list", ProductList);
