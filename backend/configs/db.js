import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URL); // Add this line
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")
    } catch (error) {
        console.log("DB error:", error.message)
    }
}
export default connectDb;
