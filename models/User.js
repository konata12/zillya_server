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
  }, { _id : false }
)

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
    phomeNumber: {
      type: String,
      required: false,
    },
    address: {
      type: AddressSchema,
      default: {},
      required: false
    },
    orders: {
      type: Array,
      required: true,
    },
    staff: {
      type: Boolean,
      default: false,
      required: true,
    },
    activated: {
      type: Boolean,
      required: true
    }
  }, { timestamps: true },
)

export default mongoose.model('User', UserSchema)