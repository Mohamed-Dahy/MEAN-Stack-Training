const express = require("express");
const productsRouter = require("./routes/products.routes");

const app = express();
const PORT = 3000;


app.use(express.json());

app.use("/products", productsRouter);


app.listen(PORT, ()=>{
    console.log("server is running at port ", PORT)
});



