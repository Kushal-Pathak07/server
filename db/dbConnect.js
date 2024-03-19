import mongoose, { connect } from "mongoose";
const dbConnect = async () => {
    try
    {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database connect successfully");
    }
    catch(error)
    {
        console.log("Error while connecting to MongoDB ", error);
    }
};

export default dbConnect;