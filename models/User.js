import mongoose from 'mongoose'

const AdressSchema = new mongoose.Schema(
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
  }
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
    number: {
      type: String,
      required: false,
    },
    adress: {
      type: AdressSchema,
      default: {},
      required: false
    },
    orders: {
      type: Array,
      required: true,
    },
    staff: {
      type: Boolean,
      required: true,
    },
    activated: {
      type: Boolean,
      required: true
    }
  }, { timestamps: true },
)

export default mongoose.model('User', UserSchema)