import express  from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';

const app = new express();
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/amazona', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.get('/', (req, res) => {
    res.send('i am ready always!');
});


// errors inside express async handler rotuers will be sent to the below middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send({message : err.message});
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});