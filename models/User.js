import mongoose from 'mongoose'

// SCHEMAS
import Address from './Address.js'

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
      type: mongoose.Schema.Types.ObjectId,
      ref: Address,
      required: true
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