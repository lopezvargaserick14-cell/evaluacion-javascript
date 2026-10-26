import "./product-card.js";

export class ProductList extends HTMLElement {
  set productos(items) {
    this._items = items;
    this.render();
  }


