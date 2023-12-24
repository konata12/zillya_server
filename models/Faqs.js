import mongoose from 'mongoose'

const FaqsSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      }
    },
    { timestamps: true },
)

export default mongoose.model('Faqs', FaqsSchema)