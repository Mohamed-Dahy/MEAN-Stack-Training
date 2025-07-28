const products = require("../data/products")

const getALLProducts = (req, res) => {
    res.status(200).send(products);
};

const getProductByID = (req, res) =>{
    const id = +req.params.id;
    const product = products.find((product) => {
            return product.id === id;
    });
    if(product){
        res.status(200).json({product: product});
    } else{
        res.status(404).json({message: "Product not found"});
    }
}

const createProduct = (req, res) =>{
    let body = req.body;
    if(!body.productName || !body.price){
        return res.status(400).json({message: "Product name or price is missinggg"});
    }

    body = {id: products.length +1, ...body};
    products.push(body);
    res.status(201).json({message: "Product added"})
};


const updateProduct = (req, res) =>{
    const id = req.params.id;
    const body = req.body;
    const index = products.findIndex((product) => {
        return product.id == id
    });
    if(index === -1){
        return res.status(404).json({message: "product was not found at all"});
    }
    products[index] = {...products[index], ...body};
    res.status(200).json({message: "Product updated"});
}

const deleteProduct = (req,res) =>{
    const id = req.params.id;
    const index = products.findIndex((product) => {
        return product.id == id;
    });
    if(index === -1){
        return res.status(404).json({message: "product was not found at allll"});
    } 
    products.splice(index, 1);
    res.status(200).json({message:"product successfully deleted"});
    

};


module.exports = {
    getALLProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
}