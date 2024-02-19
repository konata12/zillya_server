// SERVICES
// default
import {
    removeEmptyValues,
    setAddressToUserResponse,
    setBasketResponse,
    validateCookies,
} from '../services/Default.service.js'

// user
import {
    // EDIT USER DATA
    editUserData,

    // ADD ITEM TO BASKET
    addItemToBasketService,
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
        console.log('add item to basket')
        const { AccessToken, RefreshToken } = req.cookies
        const { itemChoice, quantity } = req.body

        const cookieIsValid = await validateCookies(res, AccessToken, RefreshToken)
        if (!cookieIsValid) return

        // push item to basket
        const basket = await addItemToBasketService(itemChoice, quantity, AccessToken)

        // set basket response data
        const basketRes = await setBasketResponse(basket._id)

        res.status(200).json({
            basket: basketRes,
            message: 'product added to basket'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `add item to basket error`
        })
    }
}