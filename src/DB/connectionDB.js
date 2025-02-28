import mongoose from 'mongoose';

export const connectionDb = async () => {

    const connect = await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log("MongoDB failed to connect"));

}