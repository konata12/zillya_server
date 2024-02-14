import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            required: false,
        },
        index: {
            type: Number,
            required: false,
        },
        street: {
            type: String,
            required: false,
        },
        houseNum: {
            type: Number,
            required: false,
        },
        apartment: {
            type: Number,
            required: false,
        },
    }, { timestamps: true },
)

export default mongoose.model('Address', AddressSchema)