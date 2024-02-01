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
    console.log(user)

    // if account activated return
    if (user.activated) return

    // activate user account
    const activatedUser = await activateUser(user._id)
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

    res.send({
      session: session,
      userActivated: activatedUser.activated,
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
    console.log('login')
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

    // cookies expiration
    const accessDateExpiration = createDateForCookie(1000 * 60 * 60 * 24)
    const refreshDateExpiration = createDateForCookie(1000 * 60 * 60 * 2 * 365)

    // set cookies
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

    return res.json({
      session: session,
      userActivated: user.activated,
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

// get session
export const GetSession = async (req, res) => {
  try {
    console.log('get session')

    // get tokens
    const { AccessToken, RefreshToken } = req.cookies
    console.log(AccessToken, RefreshToken)
    // return res.status(400).json({
    //   message: 'access to session denied'
    // })

    // if there aren't tokens return
    if (AccessToken === undefined || RefreshToken === undefined) {
      return res.status(200).json({
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

    // set cookies
    const accessDateExpiration = createDateForCookie(1000 * 60 * 60 * 24)
    res.cookie('AccessToken', `${sessionAfterRefreshing.AccessToken}`, {
      httpOnly: false,
      secure: true,
      expires: accessDateExpiration
    })

    res.json({
      session: sessionAfterRefreshing.basket,
      user: resUserData,
      userActivated: user.activated,
      status: 201,
    })
  }
  catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'access to session denied'
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