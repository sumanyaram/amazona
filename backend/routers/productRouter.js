import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async(req, res) => {
    const products = await Product.find({}); // return all products
    res.send(products);
}));


productRouter.get('/seed', expressAsyncHandler(async(req, res) => {
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}))

// this api should come after the /seed api. otherwise id value will be interpreted wrongly as 'seed'
// which is wrong
productRouter.get('/:id', expressAsyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id); // return product with specific id
    if (product)
    {
        res.send(product);
    }
    else
    {
        res.status(400).send({message: 'Product not found'});
    }
}));

export default productRouter;