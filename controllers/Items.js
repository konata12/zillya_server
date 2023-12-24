import Item from "../models/Items.js";

export const getItems = async (req, res) => {
    try {
        console.log("getItems");
        const items = await Item.find()

        res.status(200).json({items}); 
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

export const getItem = async (req, res) => {
    try {
        const id = req.params.id.slice(1, req.params.id.length)
        console.log("getItem");
        const item = await Item.findById({id})

        res.status(200).json({item}); 
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

export const createItem = async (req, res) => {
    try {
        const { img, titleFstPart, titleScndPart, subtitle, choice, aboutFrstPart, aboutScndPart, type } = req.body;
        const newItem = new Item({
            img,
            titleFstPart,
            titleScndPart,
            subtitle,
            choice,
            aboutFrstPart,
            aboutScndPart,
            type,
        });

        console.log(newItem);

        await newItem.save();

        res.status(200).json({newItem});
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.body;
        
        const deletedItem = await Item.findByIdAndDelete({id})

        res.status(200).json({deletedItem});
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

export const getItemsSorted = async (req, res) => {
    console.log(req.params);
    try {
        const sortParametr = req.params.sort
        const sortCategory = req.params.category
        console.log(sortParametr);
        console.log(sortCategory);
        const items = await Item.find()

        if (items) {
            res.status(200).json({items}); 
        }
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};