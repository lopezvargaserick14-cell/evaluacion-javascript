export class ProductCard extends HTMLElement {
  set data(prod) {
    this._prod = prod;
    this.render();
  }

