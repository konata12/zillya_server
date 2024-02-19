import mongoose from "mongoose";

// SCHEMAS
import Items from './Items.js'

export const BasketProductSchema = new mongoose.Schema(
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
    }, {
        timestamps: true,
        _id : false,
    },
)

export default mongoose.model('BasketProduct', BasketProductSchema)