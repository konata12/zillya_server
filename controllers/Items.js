import Item from "../models/Items.js";

// export const getItems = async (req, res) => {
//     try {
//         console.log("getItems");
//         const items = await Item.find()

//         res.status(200).json({items}); 
//     } catch (error) {
//         res.status(500).json({ message: `Something went wrong: ${error}` });
//     }
// };

// pagination
export const getItems = async (req, res) => {
    try {
        // basic
        const itemsOnPage = 9
        // plus in query = %2B

        // sorting parameters
        const parameter = req.query.parameter === undefined || req.query.parameter === '' ?
            'default' : req.query.parameter
        const category = req.query.category === undefined || req.query.category === '' ?
            'all' : req.query.category
        const page = req.query.page === undefined || req.query.page === '' ?
            1 : +req.query.page

        console.log(parameter, category, page)

        // number of items
        const countCategory = category === 'all' ? {} :
            { type: category }
        const itemsNum = category === 'all' ? await Item.estimatedDocumentCount() :
            await Item.countDocuments(countCategory)
        // number of pages
        const pagesNum = Math.ceil(itemsNum / itemsOnPage)

        console.log('items:', itemsNum)
        console.log('pages:', pagesNum)

        // if this page doesn't exist return there aren't such items
        if (!(page >= 1 && page <= pagesNum)) {
            return res.status(400).json({
                message: `There doesn't exist such items`
            })
        }

        // category validation
        switch (category) {
            case 'all':
            case 'vape':
            case 'spray':
            case 'cosmetic':
            case 'tablets':
            case 'pets':
            case 'concentrates':
            case 'oil':
            case 'food':
            case 'drinks':
            case 'devices':
                break;

            default:
                return res.status(400).json({
                    message: `There doesn't exist such items by this category`
                })
        }
        // parameter validation
        switch (parameter) {
            case 'default':
            case '-title':
            case '+title':
            case '-price':
            case '+price':
                break;

            default:
                return res.status(400).json({
                    message: `There doesn't exist such items by this parameter`
                })
        }

        // create base aggregation query
        const aggregateQuery = [
            // get object of default choice of item
            {
                $addFields: {
                    defaultChoice: {
                        $arrayElemAt: ["$choice", 0]
                    },
                }
            },
            // get discount price of item
            {
                $addFields: {
                    discountPrice: {
                        $multiply: ["$defaultChoice.price", {
                            $divide: [{
                                $subtract: [100, "$defaultChoice.discount"]
                            }, 100]
                        }]
                    },
                }
            },
        ]

        // skip
        const skip = (page - 1) * itemsOnPage
        console.log(skip)

        // category
        const matchCategory = category === 'all' ? {} :
            { type: category }
        // add filtering by category
        aggregateQuery.unshift({ $match: matchCategory })
        console.log(matchCategory)

        // sorting
        // get - or + to define sort direction, d means default so no direction
        const parameterSelector = parameter.slice(0, 1) === 'd' ? 'default' :
            parameter.slice(0, 1)
        // get -1, 1 or '' for sort value
        const sortValue = parameterSelector === '-' || parameterSelector === '+' ? +(parameterSelector + 1) :
            ''
        // get parameter for sorting: price, title or '' if default
        const sortField = parameter.slice(0, 1) === 'd' ? 'default' :
            parameter.slice(1)
        // setting sort object
        const sort = {}
        // add sorting
        switch (sortField) {
            case 'price':
                sort.discountPrice = sortValue
                aggregateQuery.push({ $sort: sort })
                break;
            case 'title':
                sort.titleFstPart = sortValue
                sort.titleScndPart = sortValue
                aggregateQuery.push({ $sort: sort })
                break;

            default:
                break;
        }

        // console.log(parameter.slice(0, 1))
        // console.log('parameterSelector:', parameterSelector)
        // console.log('sortSelector:', sortValue)
        // console.log('sortField:', sortField)
        console.log('sort:', sort)

        // adding pagination to aggregate
        aggregateQuery.push({ $skip: skip })
        aggregateQuery.push({ $limit: itemsOnPage })

        // get filtered items from db
        console.log(aggregateQuery)
        const items = await Item.aggregate(aggregateQuery)

        console.log('send items')
        res.status(200).json({
            itemsNum,
            items
        });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};

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

// export const getItems = async (req, res) => {
//     console.log(req.params);
//     try {
//         const sortParametr = req.params.sort
//         const sortCategory = req.params.category
//         console.log(sortParametr);
//         console.log(sortCategory);
//         const items = await Item.find()

//         if (items) {
//             res.status(200).json({items});
//         }
//     } catch (error) {
//         res.status(500).json({ message: `Something went wrong: ${error}` });
//     }
// };