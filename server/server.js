import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sllerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

await connectDB();
await connectCloudinary();

const app = express();
const port = process.env.PORT || 4000;

//allow multiple origins
const allowedOrigins = ['http://localhost:5173']

app.post('/stripe',express.raw({type: 'application/json'}), stripeWebhooks)
//Middleware

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));




app.get('/', (req, res) => res.send("Api is Working"))
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);




app.listen(port, () => {
    console.log(`Sever is running on http://localhost:${port}`)

})