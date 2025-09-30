import mongoose from 'mongoose';
let isConnected :boolean = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected!"); 
    return mongoose.connection
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URL || "", {
        dbName: "unsplash", // DB name 
      });

      isConnected = true;
      console.log("Connected to MongoDB!"); 
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  return mongoose.connection; // return the connection object
};

export default connectToDatabase;
// This function connects to a MongoDB database using Mongoose.
// It uses the connection string stored in the environment variable MONGODB_URL.