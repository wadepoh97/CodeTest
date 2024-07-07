import mongoose, { Schema } from "mongoose";

await mongoose.connect('mongodb://localhost:27017/userProfileDB')
    .then(() => console.log('Connected!'));