import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

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

productRouter.post('/create', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const product = new Product({
        name : 'Enter name ' + Date.now(),
        image : '/images/p2.jpg',
        price : 0,
        category : 'Enter category',
        brand : 'Enter nrand',
        countInStock : 0,
        numReviews : 0,
        description : 'Enter description',
        rating : 0.0
    });

    try{
        const createdProduct = await product.save();
        res.send({message:'Product created', product:createdProduct});
    }
    catch (error)
    {
        res.status(500).send({message:'Failed to create the product. Details:' + error.message});
    }
}));

export default productRouter;