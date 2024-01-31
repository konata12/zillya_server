import Item from "../models/Items.js";

export const createObjectToCountItems = (category) => {
    try {
        if (category === 'all') return {}
        return { type: category }
    } catch (error) {
        throw new Error(error)
    }
}

export const countItems = async (category, countCategory) => {
    try {
        if (category === 'all') return await Item.estimatedDocumentCount()
        return await Item.countDocuments(countCategory)
    } catch (error) {
        throw new Error(error)
    }
}

export const countPages = (itemsNum, itemsOnPage) => {
    try {
        return Math.ceil(itemsNum / itemsOnPage)
    } catch (error) {
        throw new Error(error)
    }
}

export const checkIfPageExists = (page, pagesNum) => {
    try {
        if (!(page >= 1 && page <= pagesNum)) {
            return res.status(400).json({
                message: `There doesn't exist such items`
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const validateCategory = (category) => {
    try {
        const catigories = {
            all: 'all',
            vape: 'vape',
            spray: 'spray',
            cosmetic: 'cosmetic',
            tablets: 'tablets',
            pets: 'pets',
            concentrates: 'concentrates',
            oil: 'oil',
            food: 'food',
            drinks: 'drinks',
            devices: 'devices',
        }

        // if (!catigories[category]) throw new Error(`There doesn't exist such items by this category`)
        if (!catigories[category]) return true
    } catch (error) {
        throw new Error(error)
    }
}

export const validateParameter = (parameter) => {
    try {
        const parameters = {
            default: 'default',
            "-title": '-title',
            "+title": '+title',
            "-price": '-price',
            "+price": '+price',
        }

        if (!parameters[parameter]) return true
    } catch (error) {
        throw new Error(error)
    }
}

export const validatePage = (page, pagesNum) => {
    try {
        if (!(page >= 1 && page <= pagesNum)) return true
    } catch (error) {
        throw new Error(error)
    }
}

export const createBaseAggregateQuery = () => {
    try {
        return [
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
    } catch (error) {
        throw new Error(error)
    }
}

export const countSkip = (page, itemsOnPage) => {
    try {
        return (page - 1) * itemsOnPage
    } catch (error) {
        throw new Error(error)
    }
}

export const createAggregateMatch = (category) => {
    try {
        if (category === 'all') return {}
        return { type: category }
    } catch (error) {
        throw new Error(error)
    }
}

export const defineParameterSelector = (parameter) => {
    try {
        // get - or + to define sort direction, d means default so no direction
        if (parameter.slice(0, 1) === 'd') return 'default'
        return parameter.slice(0, 1)
    } catch (error) {
        throw new Error(error)
    }
}

export const defineSortValue = (parameterSelector) => {
    try {
        // get -1, 1 or '' for sort value
        if (parameterSelector === '-') return -1
        if (parameterSelector === '+') return 1
        return ''
    } catch (error) {
        throw new Error(error)
    }
}

export const defineSortField = (parameter) => {
    try {
        // get parameter for sorting: price, title or '' if default
        if (parameter.slice(0, 1) === 'd') return 'default'
        return parameter.slice(1)
    } catch (error) {
        throw new Error(error)
    }
}

export const createAggregateSort = (sortField, sortValue) => {
    try {
        // setting sort object
        if (sortField === 'price') return {
            discountPrice: sortValue
        }

        if (sortField === 'title') return {
            titleFstPart: sortValue,
            titleScndPart: sortValue
        }

        if (sortField === 'default') return false
    } catch (error) {
        throw new Error(error)
    }
}

export const fetchItems = async (aggregateQuery, matchCategory, sort, skip, itemsOnPage) => {
    try {
        aggregateQuery.unshift({ $match: matchCategory })
        if (sort) aggregateQuery.push({ $sort: sort })
        aggregateQuery.push({ $skip: skip })
        aggregateQuery.push({ $limit: itemsOnPage })

        return await Item.aggregate(aggregateQuery)
    } catch (error) {
        throw new Error(error)
    }
}