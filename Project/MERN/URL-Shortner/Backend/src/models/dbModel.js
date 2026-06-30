import mongoose from "mongoose";

const dbSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
        unique: true
    }
})

const urlModel = mongoose.model("urlModel", dbSchema)

export default urlModel;