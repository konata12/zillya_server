import mongoose from 'mongoose'

const ItemsSchema = new mongoose.Schema(
    {
        img: {
            type: String,
            required: true,
        },
        titleFstPart: {
            type: String,
            required: true,
        },
        titleScndPart: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        choice: [
            {
                type: Object,
                required: true,
            }
        ],
        aboutFrstPart: {
            type: String,
            required: true,
        },
        aboutScndPart: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

export default mongoose.model('Items', ItemsSchema)