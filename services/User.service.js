// MODELS
import User from '../models/User.js'
import Session from '../models/Session.js'
import Address from '../models/Address.js'
import Basket from '../models/Basket.js'
import Items from '../models/Items.js'

// SERVICES
import {
    removeEmptyValues,
    checkAddress,
    getSessionByToken,
    stringToObjectId,
} from './Default.service.js'


// PATCH USER DATA
export const getSessionByAccessToken = async (AccessToken) => {
    return await Session.findOne({ AccessToken })
}

export const updateUser = async (session, userData) => {
    return await User.findOneAndUpdate({ _id: session.userId },
        userData, {
        new: true
    })
}

export const updateAddress = async (user, userAddress) => {
    return await Address.findOneAndUpdate({ _id: user.address },
        userAddress, {
        new: true
    })
}

export const editUserData = async (userData, AccessToken) => {
    const filteredData = removeEmptyValues(userData)
    const userAddress = checkAddress(filteredData)

    const session = await getSessionByAccessToken(AccessToken)
    const user = await updateUser(session, filteredData)
    const address = await updateAddress(user, userAddress)

    return { user, address }
}

// ADD ITEM TO BASKET
const checkBasketForChoice = async (choiceId, basketId) => {
    const containsProduct = await Basket.findOne({
        _id: basketId,
        products: {
            $elemMatch: { product: choiceId }
        }
    })

    return containsProduct
}

const addQuantityToBasketItem = async (choiceId, quantity, basketId) => {
    const basket = await Basket.findOne({ _id: basketId })

    basket.products = basket.products.map((product) => {
        if (String(product.product) === String(choiceId)) {
            product.quantity += +quantity
            return product
        } else {
            return product
        }
    })

    basket.save()
    return basket
}

const pushItemToBasket = async (choiceId, quantity, basketId) => {
    return await Basket.findOneAndUpdate({ _id: basketId }, {
        $push: {
            products: {
                product: choiceId,
                quantity
            }
        }
    }, {
        new: true
    })
}

export const addItemToBasketService = async (itemChoice, quantity, AccessToken) => {
    const session = await getSessionByAccessToken(AccessToken)
    const basketId = stringToObjectId(session.basket)
    const choiceId = stringToObjectId(itemChoice._id)

    const containsItem = await checkBasketForChoice(choiceId, basketId)
    console.log(333, Boolean(containsItem))

    if (containsItem) {
        return await addQuantityToBasketItem(choiceId, quantity, basketId)
    }

    return await pushItemToBasket(choiceId, quantity, basketId)
}