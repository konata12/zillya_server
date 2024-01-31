// SERVICES
import {
  // VERIFICATE
  findUserByEmail,
  hashPassword,
  createUser,
  createSessionForVerification,
  setTransporter,
  sendVerificationEmail,
  createUUID,

  // REGISTER
  getSession,
  getUserIdFromSession,
  activateUser,

  // LOGIN
  isCheckPasswordCorrect,
  getLoginSessionByUserId,

  // GET ME
  loginSession,
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

    // activate user account
    const userId = getUserIdFromSession(session)
    await activateUser(userId)

    // set tokens to cookies
    res.cookie('AccessToken', `${session.AccessToken}`, {
      httpOnly: true,
      secure: true
    })
    res.cookie('RefreshToken', `${session.RefreshToken}`, {
      httpOnly: true,
      secure: true
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

    const isPasswordCorrect = await isCheckPasswordCorrect(password, user.password)
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
    res.cookie('session', `${session.sessionId}`, {
      httpOnly: true,
      secure: true
    })

    return res.json({
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

export const GetMe = async (req, res) => {
  try {
    const sessionId = req.cookies.session
    console.log(sessionId)
    const session = await loginSession(sessionId)
    console.log(session)

    res.json({
      basket: session.basket,
      isLoggedIn: session.isLoggedIn,
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

export const checkIfUserIsLoggedin = async (req, res) => {
  try {
    const { AccessToken, RefreshToken } = req.cookies



  } catch (error) {
    console.log(error)
    res.json({
      message: 'checkIfUserIsLoggedin error'
    })
  }
}

export const Login = async (req, res) => {
  try {
    console.log('login')
    console.log(req.body)
    const { email, password } = req.body

    console.log(email)
    console.log(password)
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: 'This user does not exist',
        status: 404,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.json({
        message: "incorrect password",
        status: 401,
      })
    }

    const token = jwt.sign({
      id: user._id,
    }, process.env.JWT_SECRET,
      { expiresIn: '30d' },
    )

    if (!token) {
      return res.json({ message: 'something went wrong', status: 500 })
    }

    return res.json({
      token, user, message: 'You successfully entered the system', status: 201,
    })

  }
  catch (error) {
    return res.json({ message: 'something went wrong', status: 500 })
  }
}

get me

export const GetMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: 'this user is not exist'
      })
    }

    const token = jwt.sign({
      id: user._id,
    }, process.env.JWT_SECRET,
      { expiresIn: '30d' },
    )

    res.json({
      user, token
    })

  }
  catch (error) {
    console.log(error);
    res.json({
      message: "no permision"
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