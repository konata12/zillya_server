import mongoose from 'mongoose'

const FaqsSchema = new mongoose.Schema(
    {
      Title: {
        type: String,
        required: true,
      },
      Text: {
        type: String,
        required: true,
      }
    },
    { timestamps: true },
)

export default mongoose.model('User', FaqsSchema)