import jwt from 'jsonwebtoken'

// MODELS
import User from '../models/User.js'
import Session from '../models/Session.js'
import Address from '../models/Address.js'

// SERVICES
export const generateAccessToken = (data, expiresIn) => {
    const dataJWT = { token: data }
    const expiration = expiresIn !== 'none' ?
        { expiresIn: expiresIn } :
        {}
    return jwt.sign(dataJWT, process.env.JWT_SECRET, expiration);
}

export const decodeAccessToken = async (res, AccessToken, RefreshToken) => {
    try {
        const decoded = jwt.verify(AccessToken, process.env.JWT_SECRET)
        console.log(decoded)

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

// clear AccessToken from cookies and logout session
export const setSessionLoggedInFalse = async (res, RefreshToken) => {
    try {
        console.log('anus')
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
    if (Date.now() > tokenData.exp * 1000) {
        console.log('token expired')

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
    if(tokenExpired) return false //works

    return true
}