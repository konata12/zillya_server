import mongoose from "mongoose";

// SCHEMAS
import Items from './Items.js'

export const BasketSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Items,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }, { timestamps: true },
)

export default mongoose.model('Basket', BasketSchema)