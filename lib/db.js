import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;

        connection.on("connected",() => {
            console.log("Mongodb connected successfully");
        })
        connection.on("error",(err) => {
            console.log("MongoDB connection error. Please make sure write the code properly")
            process.exit()
        })
        
    } catch (error) {
        console.log("Something goes wrong!")
        console.log(error)
        
    }
}