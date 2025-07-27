const listcart = require("./listCart");
const { writeFile } = require("fs").promises;
const path = require("path");
const mypath = path.join(__dirname,"../data/cart.json");
const products = require("../data/products.json");

async function addToCart(productId, quantity) {
    if(productId <=0 || quantity <=0){
        console.log("Invalid Product ID or Quantity");
        return;
    }
   try{
    const cart = await listcart();
    const product = products.find((p) => p.id === productId);


    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      console.log(`Increased quantity of product ID ${productId} by ${quantity}`);
    }else if (!product){
        console.log(`Product with id : ${productId} not found`);
        return;
    }else{
        cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
        console.log(`Product with id : ${productId} added successfully`);
    }
    await writeFile(mypath, JSON.stringify(cart, null, 2));


   }catch (error) {
        console.log("Error fetching product:", error);
        return;
    };

}

// addToCart(3,5);
module.exports = addToCart;