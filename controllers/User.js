// SERVICES
// default
import {
    removeEmptyValues,
    setAddressToUserResponse,
    validateCookies,
} from '../services/Default.service.js'

// user
import {
    // EDIT USER DATA
    editUserData,
} from '../services/User.service.js'

// edit user data
export const UpdateInfo = async (req, res) => {
    try {
        console.log('edit user data')
        const { AccessToken, RefreshToken } = req.cookies
        const userData = req.body

        const filteredData = removeEmptyValues(userData)
        const containsData = Object.keys(filteredData).length

        if (!containsData) return res.status(400).json({
            message: 'no info to update'
        })

        const cookieIsValid = await validateCookies(res, AccessToken, RefreshToken)

        if (!cookieIsValid) return

        // // if there aren't tokens return
        // if (AccessToken === undefined || RefreshToken === undefined) {
        //     return res.status(401).json({
        //         message: 'access denied'
        //     })
        // }

        // // get access token data
        // const decodedAccessToken = decodeAccessToken(AccessToken)

        // // check if access token expired
        // // then set session is logged in false
        // if (Date.now() > decodedAccessToken.exp * 1000) {
        //     console.log('token expired')

        //     await setSessionLoggedInFalse(RefreshToken)
        //     return res.status(401).json({
        //         message: 'access denied'
        //     })
        // }

        // update user and user data
        const { user, address } = await editUserData(userData, AccessToken)

        // set address to user for response
        const userResData = setAddressToUserResponse(user, address)

        res.status(200).json({
            user: userResData,
            message: 'succesfully edited user data'
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: `user edit error`
        })
    }
}

// add item to basket
export const addItemToBasket = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `add item to basket error`
        })
    }
}