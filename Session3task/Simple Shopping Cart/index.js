const listCart = require("./Modules/listCart");
const addToCart = require("./Modules/addToCart");
const removeFromCart = require("./Modules/removeFromCart"); 
const calculateTotal = require("./Modules/calculateTotal");


async function main() {
    console.log("Welcome to the Simple Shopping Cart Application");
    
    
    console.log(await listCart());

    
    await addToCart(1, 2); 
    await addToCart(2, 1); 
    console.log(await listCart());

   
    await calculateTotal();

    await removeFromCart(1);
    console.log(await listCart());

    console.log("Thank you for using the Simple Shopping Cart Application");
}

main();