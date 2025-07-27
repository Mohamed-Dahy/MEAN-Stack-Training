const listcart = require("./listCart");
const { writeFile } = require("fs").promises;
const path = require("path");
const mypath = path.join(__dirname,"../data/cart.json");


async function calctotalprice() {
    const cart = await listcart();
    let total = 0;
    if (cart.length === 0) {
        console.log("Cart is empty");
        return;
    }
    cart.forEach((item) => {
        total += item.price * item.quantity;
    });
    console.log(`Total price of items in the cart: $${total}`);
    try {
        await writeFile(mypath, JSON.stringify(cart, null, 2));
    } catch (error) {
        console.log("Error writing to cart file:", error);
        return;
    }

    
}

// calctotalprice();
module.exports = calctotalprice;