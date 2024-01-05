import mongoose from 'mongoose'

// validation for every object in choice array of item
const choiceSchema = new mongoose.Schema(
    {
        option: String,
        price: Number,
        discount: Number,
    }
)

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
        choice:{
            type: [choiceSchema],
            required: true,
        },
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