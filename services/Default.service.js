import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

// MODELS
import Session from '../models/Session.js'
import Address from '../models/Address.js'
import Basket from '../models/Basket.js'
import Items from '../models/Items.js'

// SERVICES
export const stringToObjectId = (str) => {
    return new mongoose.Types.ObjectId(str)
}

const bsonObjectToJs = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const generateAccessToken = (data, expiresIn) => {
    const dataJWT = { token: data }
    const expiration = expiresIn !== 'none' ?
        { expiresIn: expiresIn } :
        {}
    return jwt.sign(dataJWT, process.env.JWT_SECRET, expiration);
}

export const decodeAccessToken = async (res, AccessToken, RefreshToken) => {
    try {
        const decoded = jwt.decode(AccessToken, process.env.JWT_SECRET)

        // if can't decode throw error
        if (!decoded) throw new Error("can't decode")

        return decoded
    } catch (error) {
        console.log(error)

        await setSessionLoggedInFalse(res, RefreshToken)
        res.status(401).json({
            message: 'access denied 2'
        })

        return false
    }
}

export const getSessionByToken = async (AccessToken) => {
    return await Session.findOne({ AccessToken: AccessToken })
}

export const createDateForCookie = (date) => {
    return new Date((Date.now() + date))
}

export const getAddress = async (user) => {
    return await Address.findOne({ _id: user.address })
}

export const getBasket = async (basketId) => {
    return await Basket.findOne({ _id: basketId })
}

export const removeEmptyValues = (obj) => {
    const filteredArray = Object.entries(obj).filter(([_, value]) => value !== '')
    const data = Object.fromEntries(filteredArray)

    return data
}

export const checkAddress = (obj) => {
    const addressKeys = {
        city: 'city',
        index: 'index',
        street: 'street',
        houseNum: 'houseNum',
        apartment: 'apartment'
    }

    const addressArray = Object.entries(obj).map((value) => {
        if (addressKeys[value[0]]) return value
    }).filter(value => value !== undefined)

    const address = Object.fromEntries(addressArray)

    return address
}

export const setAddressToUserResponse = (user, address) => {
    const userRes = JSON.parse(JSON.stringify(user))
    const cloneAddress = JSON.parse(JSON.stringify(address))
    const addresRes = checkAddress(cloneAddress)

    userRes.address = addresRes

    return userRes
}

export const setBasketResponse = async (basketId) => {
    const basket = bsonObjectToJs(await getBasket(basketId))

    // array of basket products ids
    const choiceIdArray = basket.products.map((product) => {
        return stringToObjectId(product.product)
    })

    // get items from basket
    const basketProductsBSON = await Items.find({
        choice: {
            $elemMatch: {
                _id: {
                    $in: choiceIdArray
                }
            }
        }
    })

    // convert bson items to js
    const basketProductsJS = basketProductsBSON.map((product) => {
        return bsonObjectToJs(product)
    })

    // set product to object, not id
    basket.products = basket.products.map((product) => {
        // id of product from basket
        const choiceId = product.product

        // cycle through array of items
        for (const item of basketProductsJS) {
            // returns true if items choice contains product from basket
            const itemContainsChoice = item.choice.find((choice) => {
                return choice._id === choiceId
            })

            if (itemContainsChoice) {
                // set data to product
                product.product = item
                product.product.choiceId = choiceId
            }
        }

        return product
    })

    return basket
}

// clear AccessToken from cookies and logout session
export const setSessionLoggedInFalse = async (res, RefreshToken) => {
    try {
        res.clearCookie('AccessToken')
        return await Session.findOneAndUpdate({ RefreshToken }, {
            isLoggedIn: false
        }, {
            new: true
        })
    } catch (error) {
        console.log(error)
        return false
    }
}

const checkForTokens = async (res, AccessToken, RefreshToken) => {
    if (AccessToken === undefined || RefreshToken === undefined) {
        await setSessionLoggedInFalse(RefreshToken)
        res.status(401).json({
            message: 'access denied 1'
        })

        return false
    }
    return true
}

const checkTokenExpiration = async (res, tokenData, RefreshToken) => {
    // if expired
    if (Date.now() > tokenData.exp * 1000) {
        await setSessionLoggedInFalse(res, RefreshToken)
        res.status(401).json({
            message: 'access denied 3'
        })

        return true
    }

    return false
}

export const validateCookies = async (res, AccessToken, RefreshToken) => {
    // if there aren't tokens return, logout
    const containTokens = await checkForTokens(res, AccessToken, RefreshToken)
    if (!containTokens) return false // works

    // get access token data if can't decode return, logout
    const decodedAccessToken = await decodeAccessToken(res, AccessToken, RefreshToken)
    if (!decodedAccessToken) return false // works

    // if access token expired return, logout
    const tokenExpired = await checkTokenExpiration(res, decodedAccessToken, RefreshToken)
    if (tokenExpired) return false //works

    return true
}