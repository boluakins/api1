const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv/config')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const postsRoute = require('./routes/posts');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');

app.use(morgan('dev'));
app.use('/posts', postsRoute);
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.get('/', (req, res) => {
    res.send('I\'m getting the hang of this');
});

try {
    mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connected to atlas')
 );
} catch (error) {
    console.log(error);
}
app.listen(port, () => console.log(`app listening!`))