import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected")
  } catch (error) {
    console.error()
    process.exit(1)
  }
}

export default connectMongoDB;