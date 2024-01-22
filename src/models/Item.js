// Item.js
class Item {
    constructor(name, quantity, price) {
      this.name = name;
      this.quantity = quantity;
      this.price = price;
    }
  
    getName() {
      return this.name;
    }
  
    setName(name) {
      this.name = name;
    }
  
    getQuantity() {
      return this.quantity;
    }
  
    setQuantity(quantity) {
      this.quantity = quantity;
    }
  
    getPrice() {
      return this.price;
    }
  
    setPrice(price) {
      this.price = price;
    }
  }
  
  export default Item;
  