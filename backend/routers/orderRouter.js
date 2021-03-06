import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth, isAdmin } from '../utils.js';


const orderRouter = express.Router();

// Get all orders - admin privileges
orderRouter.get(('/'), isAuth, isAdmin, expressAsyncHandler(async(Req, res) => {
    try
    {
        const data = await Order.find({}).populate('user', 'name');
        res.send(data);
    }
    catch (error)
    {
        res.status(500).send({message:'Failed to get the orders. Details:' + error.message});
    }
}));


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

orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (order)
    {
        const deletedOrder = await order.remove();
        res.send({message: 'Order deleted', order: deletedOrder});
    }
    else{
        res.status(404).send({message: 'Order not found'});
    }
}));

orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );



  orderRouter.put(
    '/:id/deliver',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );


export default orderRouter;