import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

// MODELS
import User from '../models/User.js'
import Session from '../models/Session.js'
import Address from '../models/Address.js'
import Basket from '../models/Basket.js'

// SERVICES
import {
    generateAccessToken,
} from './Default.service.js'

// VERIFICATE
export const findUserByEmail = async (email) => {
    return await User.findOne({ email })
}

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

export const createUser = ({ name, surname, email, hash, address }) => {
    return new User({
        name,
        surname,
        email,
        password: hash,
        address: address._id,
        staff: false,
        activated: false
    })
}

export const createUserAddress = () => {
    return new Address({})
}

const createBasket = async () => {
    const basket = new Basket()
    await basket.save()

    return basket
}

export const createSessionForVerification = async (userId) => {
    const AccessToken = generateAccessToken(uuidv4(), '1d')
    const RefreshToken = generateAccessToken(uuidv4(), 'none')
    const basket = await createBasket()

    return new Session({
        AccessToken,
        RefreshToken,
        userId,
        basket: basket,
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
export const getSessionById = async (sessionId) => {
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
export const refreshSessionAccessToken = async (RefreshToken) => {
    const AccessToken = generateAccessToken(uuidv4(), '1d')

    return await Session.findOneAndUpdate({ RefreshToken }, {
        AccessToken: AccessToken,
        isLoggedIn: true
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
