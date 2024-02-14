import jwt from 'jsonwebtoken'

// MODELS
import Address from '../models/Address.js'

// SERVICES

export const generateAccessToken = (data, expiresIn) => {
    const dataJWT = { token: data }
    const expiration = expiresIn !== 'none' ?
        { expiresIn: expiresIn } :
        {}
    return jwt.sign(dataJWT, process.env.JWT_SECRET, expiration);
}

export const decodeAccessToken = (AccessToken) => {
    return jwt.verify(AccessToken, process.env.JWT_SECRET)
}

export const createDateForCookie = (date) => {
    return new Date((Date.now() + date))
}

export const getAddress = async (user) => {
    return await Address.findOne({ _id: user.address })
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
    console.log('res user', userRes)

    return userRes
}

export const setSessionLoggedInFalse = async (RefreshToken) => {
    return await Session.findOneAndUpdate({ RefreshToken }, {
        isLoggedIn: false
    }, {
        new: true
    })
}

export const validateCookies = async (res, AccessToken, RefreshToken) => {
    // if there aren't tokens return
    if (AccessToken === undefined || RefreshToken === undefined) {
        res.status(401).json({
            message: 'access denied 1'
        })
        return false
    }

    // get access token data
    const decodedAccessToken = decodeAccessToken(AccessToken)

    // check if access token expired
    // then set session is logged in false
    if (Date.now() > decodedAccessToken.exp * 1000) {
        console.log('token expired')

        await setSessionLoggedInFalse(RefreshToken)
        res.status(401).json({
            message: 'access denied 2'
        })
        return false
    }

    return true
}