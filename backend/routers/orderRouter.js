import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';


const orderRouter = express.Router();

orderRouter.get('/mine',
isAuth,  // only authenticated user can see the order
expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id}); // return all orders
    if (orders)
    {
        res.send(orders);
    }
    else
    {
        res.status(400).send({message: 'Orders not found'});
    }
}));

orderRouter.get('/:id',
isAuth,  // only authenticated user can see the order
expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if (order)
    {
        res.send(order);
    }
    else
    {
        res.status(400).send({message: 'Order not found'});
    }
}));

orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async(req, res) => {
    if (req.body.orderItems.length === 0)
    {
        res.statusCode(400).send({message: 'Cart is empty'});
    }
    else
    {
        const order = new Order(
            {
                orderItems: req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user._id,

            }
        );

        const createdOrder = await order.save();
        res.status(201).send({message: 'New order created', order: createdOrder});
    }
}));

export default orderRouter;