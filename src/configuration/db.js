require('dotenv').config();
const mongoose = require('mongoose');
// uri
const uri = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
connectDB();