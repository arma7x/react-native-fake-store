export class FakeStore {

  // eslint-disable-next-line
  static getProducts() {
    return fetch('https://fakestoreapi.com/products').then(res=>res.json());
  }

  // eslint-disable-next-line
  static getProduct(id: string) {
    return fetch(`https://fakestoreapi.com/products/${id}`).then(res=>res.json());
  }

}
