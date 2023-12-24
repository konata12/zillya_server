import Faq from "../models/Faqs.js";

export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find()
    console.log(faqs);

    res.status(200).json(faqs); 
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { title, text } = req.body;
    
    const newFaq = new Faq({
      title,
      text
    });

    await newFaq.save();

    res.status(200).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.body;
    
    const deletedFaq = await Faq.findByIdAndDelete(id)

    res.status(200).json(deletedFaq);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};