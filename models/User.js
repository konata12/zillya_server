import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
      name: {        
        type: String,
        required: true,
      },
      surname: {        
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      index: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
      houseNum: {
        type: String,
        required: false,
      },
      apartment: {
        type: String,
        required: false,
      },
      orders: {
        type: Array,
        required: true,
      },
      staff: {
        type: Boolean,
        required: true,
      },
    },
    { timestamps: true },
)

export default mongoose.model('User', UserSchema)