import mongoose from "mongoose";

let isConnected = false;

const connectMongoDB = async (): Promise<void> => {

  try {
    const uri = process.env.MONGODB_URI!;

    if (isConnected) {
      return;
    }

    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }

    await mongoose.connect(uri);
    isConnected = true;
  } catch (error) {
    console.log("Error connecting to MongoDB:", (error as Error).message);
  }
};

export default connectMongoDB;
