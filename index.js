const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const BrandRouter = require('./routes/BrandRoutes.js')
const CategoryRouter = require('./routes/CategoryRoutes.js')
const ProductRouter = require('./routes/ProductRoutes.js');
const UserRoutes = require('./routes/UserRoutes.js');
const CartRoutes = require('./routes/CartRoutes.js');
const OrderRoutes = require('./routes/OrderRoutes.js');
const morgan = require('morgan');

require('dotenv').config();

const PORT = process.env.PORT;

// DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL).then((conn) => {
    console.log(`Database connected successfully to ${conn.connection.name}`)
}).catch((error) => {
    console.error('Database connection not successful');
    console.error(error);
});

server.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}
));
server.use(cookieParser());

server.use(morgan('dev'));
server.use(express.json());


server.use('/products', ProductRouter);
server.use('/brands', BrandRouter);
server.use('/categories', CategoryRouter);
server.use('/users', UserRoutes);
server.use('/carts', CartRoutes);
server.use('/orders', OrderRoutes);

server.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
})
