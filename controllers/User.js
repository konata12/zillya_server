// SERVICES
import {
  createDateForCookie,

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

  // LOGOUT
  logoutSession,

  // GET ME
  decodeAccessToken,
  setSessionLoggedInFalse,
  refreshSessionAccessToken,
  getUserData
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
      return res.status(400).json({
        message: "this email is alredy used"
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

    // save session
    await session.save()

    // configure nodemailer
    const transporter = setTransporter(EMAIL_PASSWORD)

    // send email
    const emailResp = sendVerificationEmail(transporter, session._id, email)
    console.log(emailResp)

    res.status(201).json({
      message: 'Email was sent'
    })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'error while creating user and sending verification email'
    })
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
    console.log(user)

    // if account activated return
    if (user.activated) return res.status(400).json({
      message: 'user already activated'
    })

    // activate user account
    await activateUser(user._id)
    console.log('user activated')

    // cookies expiration
    const accessDateExpiration = createDateForCookie(1000 * 60 * 60 * 24)
    const refreshDateExpiration = createDateForCookie(1000 * 60 * 60 * 24 * 365)

    // set tokens to cookies
    res.cookie('AccessToken', `${session.AccessToken}`, {
      httpOnly: false,
      secure: true,
      expires: accessDateExpiration
    })
    res.cookie('RefreshToken', `${session.RefreshToken}`, {
      httpOnly: true,
      secure: true,
      expires: refreshDateExpiration
    })

    res.status(201).send({
      user: user,
      message: 'user activated'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `user activation error`
    })
  }
}

// login user
export const Login = async (req, res) => {
  try {
    console.log('login')
    const { email, password } = req.body

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({
        message: 'incorrect email or password',
      });
    }

    const isPasswordCorrect = await checkIsPasswordCorrect(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'incorrect email or password',
      });
    }

    // set in session isLogged true
    const session = await getLoginSessionByUserId(user._id)
    console.log(session)

    // refresh access token
    const sessionAfterRefreshing = await refreshSessionAccessToken(session.RefreshToken)

    // cookies expiration
    const accessDateExpiration = createDateForCookie(1000 * 60 * 60 * 24)
    const refreshDateExpiration = createDateForCookie(1000 * 60 * 60 * 24 * 365)

    // set cookies
    res.cookie('AccessToken', `${sessionAfterRefreshing.AccessToken}`, {
      httpOnly: false,
      secure: true,
      expires: accessDateExpiration
    })
    res.cookie('RefreshToken', `${sessionAfterRefreshing.RefreshToken}`, {
      httpOnly: true,
      secure: true,
      expires: refreshDateExpiration
    })

    return res.status(200).json({
      session: session,
      user: user,
      message: 'You successfully entered the system',
    })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'problem while loggin in'
    })
  }
}

// logout
export const Logout = async (req, res) => {
  try {
    console.log('logout')
    const { AccessToken } = req.cookies
    await logoutSession(AccessToken)

    res.status(202).send('succesfully loged out')
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'logout error',
    })
  }
}

// get session
export const GetSession = async (req, res) => {
  try {
    console.log('get session')

    // get tokens
    const { AccessToken, RefreshToken } = req.cookies

    // if there aren't tokens return
    if (AccessToken === undefined || RefreshToken === undefined) {
      return res.status(401).json({
        message: 'access to session denied'
      })
    }

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
    const sessionAfterRefreshing = await refreshSessionAccessToken(RefreshToken)

    // get user
    const user = await getUserFromSession(sessionAfterRefreshing)

    const resUserData = getUserData(user)

    // if user inactive for 24 hour set session isLogged: false
    setTimeout(() => {
      logoutSession(sessionAfterRefreshing.AccessToken)
    }, (1000 * 60 * 60 * 24))

    // set cookies
    const accessDateExpiration = createDateForCookie(1000 * 60 * 60 * 24)
    res.cookie('AccessToken', `${sessionAfterRefreshing.AccessToken}`, {
      httpOnly: false,
      secure: true,
      expires: accessDateExpiration
    })

    res.status(200).json({
      session: sessionAfterRefreshing,
      user: resUserData,
      message: 'succesfully get user session and data',
    })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'access to session denied',
    })
  }
}

export const updateInfo = async (req, res) => {
  try {
    // get tokens
    const { AccessToken, RefreshToken } = req.cookies

    // if there aren't tokens return
    if (AccessToken === undefined || RefreshToken === undefined) {
      return res.status(401).json({
        message: 'access denied'
      })
    }

    res.status(200).json({
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