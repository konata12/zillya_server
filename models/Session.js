import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        AccessToken: {
            type: String,
            required: true
        },
        RefreshToken: {
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
    }, { timestamps: true },
)

export default mongoose.model('Session', SessionSchema)