import mongoose from 'mongoose';

const connectDB = async (req, res) => {
  try {
    const mongoURI = process.env.MONGODB_URI
    console.log(mongoURI)
    if (mongoURI) {
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.error('MONGODB_URI is not defined');
    }
  } catch (error) {
    console.error(`MONGODB connection error: ${error}`);
    process.exit(1);
  }
}

export default connectDB