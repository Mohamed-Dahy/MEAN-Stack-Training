const listcart = require("./listCart");
const { writeFile } = require("fs").promises;
const path = require("path");
const mypath = path.join(__dirname,"../data/cart.json");

async function removefromcart(productId) {
    if(productId <= 0){
        console.log("Invalid productid");
        return;
    }
    try {
        const cart = await listcart();
        const newcart = cart.filter((item) => item.id !== productId);
        if (newcart.length === cart.length) {
            console.log(`Product with id : ${productId} not found in cart`);
            return;
        }else{
            console.log(`Product with id : ${productId} has been removed successfully`);
                await writeFile(mypath, JSON.stringify(newcart, null, 2));
        }
 

    }catch(error){
        console.log("Error removing from cart:", error);
        return;
    }
    
}

// removefromcart(3);
module.exports = removefromcart;