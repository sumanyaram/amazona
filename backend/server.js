import express  from 'express';
import data from './data.js';

const app = new express();

app.get('/api/products', (req, res) => {
    res.send(data.products);
});



app.get('/api/products/:id', (req, res) => {
  const product = data.products.find(x => x._id === req.params.id);
  if (product)
  {
    res.status(200).send(product);
  }
  else
  {
    res.status(404).send({ message: 'Product not found' });
  }
});




app.get('/', (req, res) => {
    res.send('i am ready always!');
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});