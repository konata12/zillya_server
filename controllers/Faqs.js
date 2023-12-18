import Faq from "../models/Faqs.js";

export const createFaq = async (req, res) => {
  try {
    console.log('createFaq');
    console.log(req.body);
    console.log(req);
    const { title, text } = req.body;
    
    const newFaq = new Faq({
      title,
      text
    });

    newFaq.save();

    res.status(200).json({newFaq});
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};
