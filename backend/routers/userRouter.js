import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, isAuth, isAdmin } from '../utils.js';

const userRouter = express.Router();

userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    // remove all entries in the 'Users' collection.
    await User.remove({});

    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
}));

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
        }
        else {
            res.status(401).send({ message: 'Password is invalid.' });
        }
    }
    else {
        res.status(401).send({ message: 'Username is invalid.' });
    }
}));

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    const createdUser = await user.save();
    if (createdUser)
    {
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(createdUser)
        });
    }
    else
    {
        res.status(500).send({ message: 'Failed to register the user.' });
    }
}));

userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id); // get user with id
    if (user)
    {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password)
        {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updatedUser = await user.save(); // save the update user details in the MongoDB
        if (updatedUser)
        {
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser)
            });
        }
        else
        {
            res.status(500).send({ message: 'Failed to update the user.' });
        }
    }
    else
    {
        res.status(400).send({message: 'Not able to find the user.'});
    }
}));


userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // get user with id
    if (user)
    {
        res.send(user);
    }
    else
    {
        res.status(400).send({message : "Order not found"});
    }
}));

userRouter.get('/',isAuth,  isAdmin, expressAsyncHandler(async (req, res) => {
    const users = await User.find({}); // return all users
    res.send(users);
}));


userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user)
    {
        if (user.isAdmin)
        {
            res.status(400).send({message: 'Cannot delete admin'});
        }
        else
        {
            const deleteUser = await user.remove();
            res.send({message: 'User deleted', user: deleteUser});
        }
    }
    else{
        res.status(404).send({message: 'User not found'});
    }
}));

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user)
    {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = req.body.isSeller || user.isSeller;
        user.isAdmin = req.body.isAdmin || user.isAdmin;

        const updatedUser = await user.save();
        res.send({message: 'User updated', updatedUser});
    }
    else
    {
        res.status(404).send({message: 'User not found'});
    }
}));


export default userRouter;