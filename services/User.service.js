import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// MODELS
import User from '../models/User.js'
import Session from '../models/Session.js'

const generateAccessToken = (data, expiresIn) => {
    const dataJWT = { token: data }
    const expiration = expiresIn !== 'none' ?
        { expiresIn: expiresIn } :
        {}
    return jwt.sign(dataJWT, process.env.JWT_SECRET, expiration);
}

export const createDateForCookie = (date) => {
    return new Date((Date.now() + date))
}

const removeEmptyValues = (obj) => {
    const filteredArray = Object.entries(obj).filter(([_, value]) => value !== '')
    const data = Object.fromEntries(filteredArray)
    // const address = checkAddress(data)

    // console.log(Object.keys(address).length)

    // if (Object.keys(address).length) {
    //     data.address = address
    // }

    return data
}

const filterAddress = (userData) => {
    const address = checkAddress(userData)
    if (Object.keys(address).length) {
        userData.address = address
    }

    return userData
}

const checkAddress = (obj) => {
    console.log('anus')
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

// VERIFICATE
export const findUserByEmail = async (email) => {
    return await User.findOne({ email })
}

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

export const createUser = ({ name, surname, email, hash }) => {
    return new User({
        name,
        surname,
        email,
        password: hash,
        staff: false,
        activated: false
    })
}

export const createSessionForVerification = (userId) => {

    const AccessToken = generateAccessToken(uuidv4(), '1d')
    const RefreshToken = generateAccessToken(uuidv4(), 'none')
    return new Session({
        AccessToken,
        RefreshToken,
        userId,
        basket: [],
        isLoggedIn: false
    })
}

export const setTransporter = (EMAIL_PASSWORD) => {
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'localhost',
        port: 465,
        secure: true,
        logger: true,
        auth: {
            user: 'dimakeshaa@gmail.com',
            pass: EMAIL_PASSWORD
        }
    })
}

export const createUUID = () => {
    return uuidv4()
}

export const sendVerificationEmail = async (transporter, sessionId, email) => {
    return await transporter.sendMail({
        from: 'dimakeshaa@gmail.com',
        to: email,
        subject: 'JOPA',
        html: `<h1>http://localhost:3000/verificate/${sessionId}</h1>`
    })
}

// REGISTER
export const getSession = async (sessionId) => {
    return await Session.findOne({ _id: sessionId })
}

export const getUserFromSession = async (session) => {
    return await User.findOne({ _id: session.userId })
}

export const activateUser = async (userId) => {
    await User.findOneAndUpdate({ _id: userId }, {
        activated: true
    })
}

// LOGIN
export const checkIsPasswordCorrect = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword)
}

export const getLoginSessionByUserId = async (userId) => {
    // return await Session.findOne({ userId: userId })
    return await Session.findOneAndUpdate({ userId: userId }, {
        isLoggedIn: true
    }, {
        new: true
    })
}

// LOGOUT
export const logoutSession = async (AccessToken) => {
    await Session.findOneAndUpdate({ AccessToken: AccessToken }, {
        isLoggedIn: false
    }, {
        new: true
    })
}

// GET ME
export const decodeAccessToken = (AccessToken) => {
    return jwt.verify(AccessToken, process.env.JWT_SECRET)
}

export const setSessionLoggedInFalse = async (RefreshToken) => {
    return await Session.findOneAndUpdate({ RefreshToken }, {
        isLoggedIn: false
    }, {
        new: true
    })
}

export const refreshSessionAccessToken = async (RefreshToken) => {
    const AccessToken = generateAccessToken(uuidv4(), '1d')

    return await Session.findOneAndUpdate({ RefreshToken }, {
        AccessToken: AccessToken
    }, {
        new: true
    })
}

export const getUserData = (user) => {
    const userData = {
        name: user.name,
        surname: user.surname,
        email: user.email,
        orders: user.orders,
        address: user.address,
        staff: user.staff,
    }

    return userData
}

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

export const editUserData = async (userData, AccessToken) => {
    const filteredData = removeEmptyValues(userData)

    const userDataWithAddress = filterAddress(filteredData)

    const session = await getSessionByAccessToken(AccessToken)
    const user = await updateUser(session, userDataWithAddress)
    console.log('update', user)

    return user
}