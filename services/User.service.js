import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// bxlj rvki tnci ykza

// MODELS
import User from '../models/User.js'
import Session from '../models/Session.js'

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

export const createSession = ({ uuid, userId }) => {
    return new Session({
        sessionId: uuid,
        userId,
        basket: [],
        isLoggedIn: false
    })
}

export const setTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'localhost',
        port: 465,
        secure: true,
        logger: true,
        auth: {
            user: 'dimakeshaa@gmail.com',
            pass: 'bxlj rvki tnci ykza'
        }
    })
}

export const createUUID = () => {
    return uuidv4()
}

export const sendVerificationEmail = async (transporter, userUUID) => {
    return await transporter.sendMail({
        from: 'dimakeshaa@gmail.com',
        to: 'dimakeshaa@gmail.com',
        subject: 'JOPA',
        html: `<h1>http://localhost:3000/verificate/${userUUID}</h1>`
    })
}

// REGISTER
export const getSession = async (sessionId) => {
    return await Session.find({ sessionId: sessionId })
}

export const getUserIdFromSession = (session) => {
    console.log(session)
    console.log(session[0].userId)
    return session[0].userId
}

export const activateUser = async (userId) => {
    await User.findOneAndUpdate({ _id: userId }, {
        activated: true
    })
}