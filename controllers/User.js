import User from '../models/User.js'
import { v4 as uuidv4 } from 'uuid'

// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

// SERVICES
import {
  // VERIFICATE
  findUserByEmail,
  hashPassword,
  createUser,
  createSession,
  setTransporter,
  sendVerificationEmail,
  createUUID,

  // REGISTER
  getSession,
  getUserIdFromSession,
  activateUser,
} from '../services/User.service.js'

//verificateEmail user
export const VerificateEmail = async (req, res) => {
  try {
    // req.session.value = 'anus'
    console.log('VerificateEmail')
    console.log(req.body);
    const { name, surname, email, password } = req.body

    // check if there is such a user
    const isUsed = await findUserByEmail(email)
    if (isUsed) {
      return res.json({
        message: "this email is alredy used",
        status: 400
      })
    }

    // HASHING PASSWORD
    const hash = hashPassword(password)
    const uuid = createUUID()

    // create user
    const user = createUser({ name, surname, email, hash })

    // save user to db
    await user.save()

    // create session
    const userId = user._id
    const session = createSession({ uuid, userId })

    // save session
    await session.save()

    const transporter = setTransporter()

    const emailResp = sendVerificationEmail(transporter, uuid)
    // console.log(emailResp)

    res.json({
      message: 'Email was sent',
      status: 201
    })
  }
  catch (error) {
    console.log(error);
    res.json({ message: `error while creating user ${error}`, status: 400 })
  }
}

export const Register = async (req, res) => {
  try {
    console.log('register')
    console.log(req.cookies)
    // console.log(req.headers)
    console.log(req.params.id)

    // get session id
    const sessionId = req.params.id

    const session = await getSession(sessionId)
    console.log(session)

    // activate user account
    const userId = getUserIdFromSession(session)
    await activateUser(userId)
    console.log(userId)

    // res.header("Access-Control-Allow-Origin", "http://localhost:3000/verificate/caa48a3b-f4ba-4fd6-be75-954b6a7bca06");
    res.cookie('session', `${sessionId}`, {
      maxAge: 9000000000000,
      httpOnly: true,
      secure: false
    })

    res.send({
      session: session,
      userCreated: true,
      message: 'user'
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: `error while creating user ${error}`,
      status: 400
    })
  }
}

// login user
export const Login = async (req, res) => {
  try {


    return res.json({
      sessionID: '',
      message: 'You successfully entered the system',
      status: 201,
    })
  }
  catch (error) {
    return res.json({ message: 'something went wrong', status: 500 })
  }
}

export const GetMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json({

    })
  }
  catch (error) {
    console.log(error);
    res.json({
      message: "no permision"
    })

  }
}

// export const Login = async (req, res) => {
//   try {
//     console.log('login')
//     console.log(req.body)
//     const { email, password } = req.body

//     console.log(email)
//     console.log(password)
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({
//         message: 'This user does not exist',
//         status: 404,
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password)

//     if (!isPasswordCorrect) {
//       return res.json({
//         message: "incorrect password",
//         status: 401,
//       })
//     }

//     const token = jwt.sign({
//       id: user._id,
//     }, process.env.JWT_SECRET,
//       { expiresIn: '30d' },
//     )

//     if (!token) {
//       return res.json({ message: 'something went wrong', status: 500 })
//     }

//     return res.json({
//       token, user, message: 'You successfully entered the system', status: 201,
//     })

//   }
//   catch (error) {
//     return res.json({ message: 'something went wrong', status: 500 })
//   }
// }

//get me

// export const GetMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.json({
//         message: 'this user is not exist'
//       })
//     }

//     const token = jwt.sign({
//       id: user._id,
//     }, process.env.JWT_SECRET,
//       { expiresIn: '30d' },
//     )

//     res.json({
//       user, token
//     })

//   }
//   catch (error) {
//     console.log(error);
//     res.json({
//       message: "no permision"
//     })

//   }
// }

export const updateInfo = async (req, res) => {

  const data = req.body.userData;

  try {
    const user = await User.findById(data._id);

    if (user) {
      user._id = data._id,
        user.name = data.name,
        user.surname = data.surname,
        user.email = data.email,
        user.number = data.number,
        user.city = data.city,
        user.index = data.index,
        user.houseNum = data.houseNum,
        user.apartment = data.apartment,
        user.orders = user.orders
    };


    await user.save()

    res.json({ user })
  }
  catch (error) {
    console.log(error);
    res.json({
      message: `no permision ${error}`
    })

  }
}