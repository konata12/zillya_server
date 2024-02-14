import mongoose from "mongoose";

// SCHEMAS
import { BasketSchema } from './Basket.js'

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
            type: [BasketSchema],
            required: false
        },
        isLoggedIn: {
            type: Boolean,
            required: true
        }
    }, { timestamps: true },
)

export default mongoose.model('Session', SessionSchema)