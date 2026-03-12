import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      // Mongoose 6+ doesn't need these options anymore
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.bold);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`.red.bold);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected'.yellow.bold);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination'.yellow);
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
