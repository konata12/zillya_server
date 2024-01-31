// SERVICES
import {
  // VERIFICATE
  findUserByEmail,
  hashPassword,
  createUser,
  createSessionForVerification,
  setTransporter,
  sendVerificationEmail,

  // REGISTER
  getSession,
  getUserFromSession,
  activateUser,

  // LOGIN
  checkIsPasswordCorrect,
  getLoginSessionByUserId,

  // GET ME
  loginSession,
  getSessionByRefreshToken,
  decodeAccessToken,
  setSessionLoggedInFalse,
  refreshSessionAccessToken
} from '../services/User.service.js'

// verificateEmail user
export const VerificateEmail = async (req, res) => {
  try {
    console.log('VerificateEmail')
    const { name, surname, email, password } = req.body
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

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

    // create user
    const user = createUser({ name, surname, email, hash })

    // save user to db
    await user.save()

    // create session
    const userId = user._id
    const session = createSessionForVerification(userId)
    console.log(session._id)

    // save session
    await session.save()

    // configure nodemailer
    const transporter = setTransporter(EMAIL_PASSWORD)

    // send email
    const emailResp = sendVerificationEmail(transporter, session._id)
    console.log(emailResp)

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

// register
export const Register = async (req, res) => {
  try {
    console.log('register')

    // get session id
    const sessionId = req.params.id

    // get session
    const session = await getSession(sessionId)

    // get user
    const user = await getUserFromSession(session)

    // if account activated return
    if (user.activated) return

    // activate user account
    await activateUser(user._id)
    console.log('user activated')

    // set tokens to cookies
    res.cookie('AccessToken', `${session.AccessToken}`, {
      httpOnly: true,
      secure: true,
      expires: Date.now() + (1000 * 60 * 60 * 24)
    })
    res.cookie('RefreshToken', `${session.RefreshToken}`, {
      httpOnly: true,
      secure: true,
      expires: Date.now() + (1000 * 60 * 60 * 24 * 365)
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
    const { email, password } = req.body

    const user = await findUserByEmail(email)
    if (!user) {
      return res.json({
        message: 'incorrect user or password',
        status: 404,
      });
    }

    const isPasswordCorrect = await checkIsPasswordCorrect(password, user.password)
    if (!isPasswordCorrect) {
      return res.json({
        message: 'incorrect user or password',
        status: 404,
      });
    }

    // set in session isLogged true
    const session = await getLoginSessionByUserId(user._id)
    console.log(session)

    // set cookies
    res.cookie('AccessToken', `${session.AccessToken}`, {
      httpOnly: true,
      secure: true,
      expires: Date.now() + (1000 * 60 * 60 * 24)
    })
    res.cookie('RefreshToken', `${session.RefreshToken}`, {
      httpOnly: true,
      secure: true,
      expires: Date.now() + (1000 * 60 * 60 * 24 * 365)
    })

    return res.json({
      basket: session.basket,
      message: 'You successfully entered the system',
      status: 201,
    })
  }
  catch (error) {
    console.log(error)
    return res.json({
      message: 'something went wrong',
      status: 500
    })
  }
}

export const GetSession = async (req, res) => {
  try {
    console.log('get session')

    // get tokens
    const { AccessToken, RefreshToken } = req.cookies
    console.log(AccessToken, RefreshToken)

    // get access token data
    const decodedAccessToken = decodeAccessToken(AccessToken)

    // check if access token expired
    // then set session is logged in false
    if (Date.now() > decodedAccessToken.exp * 1000) {
      console.log('token expired')
      await setSessionLoggedInFalse(RefreshToken)
      return
    }

    // if token doesn't expired then refresh him
    // and set to cookies
    const sessionAfterRefreshing = await refreshSessionAccessToken(RefreshToken)
    console.log(sessionAfterRefreshing.AccessToken === AccessToken)

    res.cookie('AccessToken', `${sessionAfterRefreshing.AccessToken}`, {
      httpOnly: true,
      secure: true,
      expires: Date.now() + (1000 * 60 * 60 * 24)
    })

    res.json({
      // basket: session.basket,
      // isLoggedIn: session.isLoggedIn,
      status: 201,
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      message: 'get me error'
    })
  }
}

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