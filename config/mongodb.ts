import mongoose from "mongoose";

let isConnected = false;

const connectMongoDB = async (): Promise<void> => {

  try {
    const uri = 'mongodb+srv://Users:pass123@thespot.nch3qwy.mongodb.net/TheSpotDB?appName=TheSpot';
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

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
