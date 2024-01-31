import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        basket: {
            type: Array,
            required: false
        },
        isLoggedIn: {
            type: Boolean,
            required: true
        }
    }
)

export default mongoose.model('Session', SessionSchema)