const {readFile} = require("fs").promises;
const path = require("path");


const mypath = path.join(__dirname, "../data/cart.json");


async function listcart() {
    try{
        const data = await readFile(mypath,"utf-8");
    const cartitems = JSON.parse(data);
    return cartitems;
    // console.log(cartitems);
    }catch(error){
         console.log("Error reading cart file:", error);
         throw error;
    }
    
}

// listcart().then(cartitems => {
//     console.log("Cart Items:", cartitems);
// });

module.exports = listcart;