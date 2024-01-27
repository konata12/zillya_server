import Item from "../models/Items.js";

// SERVICES
import {
    createObjectToCountItems,
    countItems,
    countPages,
    validateCategory,
    validateParameter,
    validatePage,
    createBaseAggregateQuery,
    countSkip,
    createAggregateMatch,
    createAggregateSort,
    fetchItems,
    defineParameterSelector,
    defineSortValue,
    defineSortField,
} from '../services/Items.service.js'

// pagination
export const getItems = async (req, res) => {
    try {
        // basic
        const itemsOnPage = 9

        // sorting parameters
        const parameter = req.query.parameter || 'default';
        const category = req.query.category || 'all';
        const page = +req.query.page || 1;

        console.log(parameter, category, page)

        // category validation
        if (validateCategory(category)) return res.status(400).json({
            message: `There doesn't exist such items by this category`
        })

        // parameter validation
        if (validateParameter(parameter)) return res.status(400).json({
            message: `There doesn't exist such items by this parameter`
        })

        // number of items
        const countCategory = createObjectToCountItems(category)
        const itemsNum = await countItems(category, countCategory)

        // number of pages
        const pagesNum = countPages(itemsNum, itemsOnPage)

        // page validation
        if (validatePage(page, pagesNum)) return res.status(400).json({
            message: `There doesn't exist such items`
        })

        // create base aggregation query
        const aggregateQuery = createBaseAggregateQuery()

        // skip
        const skip = countSkip(page, itemsOnPage)

        // category
        const matchCategory = createAggregateMatch(category)

        // sorting
        const parameterSelector = defineParameterSelector(parameter)
        const sortValue = defineSortValue(parameterSelector)
        const sortField = defineSortField(parameter)
        const sort = createAggregateSort(sortField, sortValue)

        // get filtered items from db
        const items = await fetchItems(aggregateQuery, matchCategory, sort, skip, itemsOnPage)

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
        const id = req.params.id

        console.log("getItem");
        const item = await Item.findById(id)

        res.status(200).json({ item });
    } catch (error) {
        res.status(500).json({ message: `Something went wrong: ${error}` });
    }
};
