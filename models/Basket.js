import mongoose from "mongoose";

// SCHEMAS
import Items from './Items.js'
import { BasketProductSchema } from './BasketProduct.js'

export const BasketSchema = new mongoose.Schema(
    {
        products: {
            type: [BasketProductSchema],
            required: true,
        }
    }, {
        timestamps: true,
    },
)

export default mongoose.model('Basket', BasketSchema)