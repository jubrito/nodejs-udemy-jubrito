// the data is the product itself, not the products
const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this); // this = object created based on the class
    }

    static fetchAll() {
        return products;
    }

}