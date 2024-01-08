import Item from "../../models/Items.js";

export const getItems = async (req, res) => {
    try {
        console.log("getItems");
        const items = await Item.find()

        res.status(200).json({items}); 
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

// export const getItems = async (req, res) => {
//     try {
//         // basic
//         const itemsOnPage = 9
//         // plus in query = %2B

//         // sorting parameters
//         const parameter = req.query.parameter === undefined ?
//             '' : req.query.parameter
//         const category = req.query.category === undefined ?
//             'default' : req.query.category
//         const page = req.query.page === undefined ?
//             1 : +req.query.page
//         const keyword = req.query.keyword === undefined ?
//             '' : req.query.keyword

//         console.log(parameter, category, page, !!keyword.lenght)

//         // number of items
//         const itemsNum = keyword.lenght ? await Item.countDocuments({ title: { '$regex': new RegExp(`${keyword}`) } }) :
//             await Item.estimatedDocumentCount()
//         // number of pages
//         const pagesNum = Math.ceil(itemsNum / itemsOnPage)

//         console.log('items:', itemsNum)
//         console.log('pages:', pagesNum)

//         // if this page doesn't exist return there aren't such items
//         if (!(page >= 1 && page <= pagesNum)) {
//             return res.status(400).json({
//                 message: `There doesn't exist such items`
//             })
//         }

//         // category validation
//         switch (category) {
//             case 'vape':
//             case 'spray':
//             case 'cosmetic':
//             case 'tablets':
//             case 'pets':
//             case 'concentrates':
//             case 'oil':
//             case 'food':
//             case 'drinks':
//             case 'devices':
//                 break;

//             default:
//                 return res.status(400).json({
//                     message: `There doesn't exist such items by this category`
//                 })
//         }
//         // parameter validation
//         switch (parameter) {
//             case 'default':
//             case '-title':
//             case '+title':
//             case '-price':
//             case '+price':
//                 break;

//             default:
//                 return res.status(400).json({
//                     message: `There doesn't exist such items by this parameter`
//                 })
//         }

//         // sorting
//         // get - or + to define sort direction, d means default so no direction
//         const parameterSelector = parameter.slice(0, 1) === 'd' ? 'default' :
//             parameter.slice(0, 1)
//         // get -1, 1 or '' for sort value
//         const sortValue = parameterSelector === '-' || parameterSelector === '+' ? +(parameterSelector + 1) :
//             ''
//         // get parameter for sorting: price, title or '' if default
//         const sortField = parameter.slice(0, 1) === 'd' ? 'default' :
//             parameter.slice(1) === 'price'
//         // setting sort object
//         const sort = {}
//         sortField === 'default' ? '' :
//             sort[sortField] = sortValue

//         console.log(parameterSelector === '-' || parameterSelector === '+')

//         console.log(parameter.slice(0, 1))
//         console.log('parameterSelector:', parameterSelector)
//         console.log('sortSelector:', sortValue)
//         console.log('sortField:', sortField)
//         console.log('sort:', sort)

//         // get filtered items from db
//         const items = await Item.find()
//             .sort(sort)
//             .skip((page - 1) * itemsOnPage)
//             .limit(itemsOnPage)

//         // console.log(items)
//         console.log('end')
//         res.status(200).json(items);
//     } catch (error) {
//         res.status(500).json({ message: `Something went wrong: ${error}` });
//     }
// };

export const getItem = async (req, res) => {
    try {
        const id = req.params.id.slice(1, req.params.id.length)
        console.log("getItem");
        const item = await Item.findById({ id })

        res.status(200).json({ item });
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

        res.status(200).json({ newItem });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.body;

        const deletedItem = await Item.findByIdAndDelete({ id })

        res.status(200).json({ deletedItem });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

// export const getItemsAdmin = async (req, res) => {
//     try {
//         const items = await Item.find()

//         if (items) {
//             res.status(200).json({items});
//         }
//     } catch (error) {
//         res.status(500).json({ message: `Something went wrong: ${error}` });
//     }
// };