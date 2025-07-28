const productsControllers = require("../controllers/products.controllers");

const express = require("express");

const router = express.Router();

router
    .route("/")
    .get(productsControllers.getALLProducts)
    .post(productsControllers.createProduct);

router
    .route("/:id")
    .get(productsControllers.getProductByID)
    .put(productsControllers.updateProduct)
    .delete(productsControllers.deleteProduct);


module.exports = router;



// //get all products
// app.get("/products", productsControllers.getALLProducts);

// //get product by id
// app.get("/products/:id", productsControllers.getProductByID);

// // //create product
// // app.post("/products", productsControllers.createProduct);

// //update products
// app.put("/products/:id", productsControllers.updateProduct);

// //delete products
// app.delete("/products/:id", productsControllers.deleteProduct);