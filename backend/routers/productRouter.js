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

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product)
    {
        product.name = req.body.name;        
        product.price = req.body.price;        
        product.image = req.body.image;        
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;

        try
        {
            const updatedProduct = await product.save();
            res.send({message: 'Product updated successfully', product: updatedProduct});
        }
        catch(error)
        {
            res.status(500).send({message:'Failed to update the product. Details:' + error.message});
        }
    }
    else
    {
        res.status(404).send({message: 'Product not found'});
    }
}));

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product)
    {
        const deletedProduct = await product.remove();
        res.send({message: 'Product deleted', product: deletedProduct});
    }
    else{
        res.status(404).send({message: 'Product not found'});
    }
}));



export default productRouter;