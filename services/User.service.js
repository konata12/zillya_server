// MODELS
import User from '../models/User.js'
import Session from '../models/Session.js'
import Address from '../models/Address.js'

// SERVICES
import {
    removeEmptyValues,
    checkAddress,
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