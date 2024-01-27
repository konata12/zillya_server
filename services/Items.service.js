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